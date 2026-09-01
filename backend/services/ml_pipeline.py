import io
import os
import re
import time
import numpy as np
import torch
from PIL import Image, ImageOps
from transformers import (
    ViTImageProcessor,
    RobertaTokenizerFast,
    VisionEncoderDecoderModel,
    TrOCRProcessor,
)

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("WARNING: opencv-python not installed.")

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    print("WARNING: easyocr not installed.")

from services.ocr_corrector import OCRCorrector

# ── Configurable via environment variables ──────────────────────────────────
TROCR_MODEL = os.getenv('TROCR_MODEL', 'microsoft/trocr-base-handwritten')
CUSTOM_MODEL_PATH = os.getenv(
    'MODEL_PATH',
    os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'My_Ultimate_Model.zip')
)
BEAM_SIZE = int(os.getenv('TROCR_BEAM_SIZE', '4'))
TARGET_W  = int(os.getenv('OCR_TARGET_WIDTH', '1600'))
DEBUG_DIR = os.getenv(
    'OCR_DEBUG_DIR',
    os.path.join(os.path.dirname(__file__), '..', 'debug_output')
)
SAVE_DEBUG_IMAGES = os.getenv('OCR_SAVE_DEBUG', 'true').lower() in ('1', 'true', 'yes')


class CRNNPipeline:
    def __init__(self):
        self.processor = None
        self.model = None
        self.reader = None
        self.corrector = OCRCorrector()
        self._loaded = False
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"[DocuVision ML] Using device: {self.device}")

        if SAVE_DEBUG_IMAGES:
            os.makedirs(DEBUG_DIR, exist_ok=True)
            print(f"[DocuVision ML] Intermediate debug images will be saved to: {DEBUG_DIR}")

    def load(self):
        if self._loaded:
            return

        # ── 1. EasyOCR Detector ──────────────────────────────────────────────
        if EASYOCR_AVAILABLE:
            use_gpu = self.device.type == 'cuda'
            print(f"[DocuVision ML] Loading EasyOCR detector (English, gpu={use_gpu})...")
            self.reader = easyocr.Reader(['en'], gpu=use_gpu, verbose=False)
            print("[DocuVision ML] EasyOCR detector initialized.")

        # ── 2. TrOCR Processor (Robust Tokenizer Loading) ─────────────────────
        print(f"[DocuVision ML] Initializing TrOCR Processor for {TROCR_MODEL}...")
        try:
            image_processor = ViTImageProcessor.from_pretrained(TROCR_MODEL)
            tokenizer = RobertaTokenizerFast.from_pretrained('roberta-base')
            self.processor = TrOCRProcessor(image_processor=image_processor, tokenizer=tokenizer)
            print("[DocuVision ML] TrOCR Processor initialized successfully.")
        except Exception as e:
            print(f"[DocuVision ML] Processor custom init warning ({e}), falling back...")
            self.processor = TrOCRProcessor.from_pretrained(TROCR_MODEL)

        # ── 3. Base VisionEncoderDecoder Model ──────────────────────────────
        print(f"[DocuVision ML] Loading VisionEncoderDecoder ({TROCR_MODEL})...")
        self.model = VisionEncoderDecoderModel.from_pretrained(TROCR_MODEL)

        # ── 4. Fine-Tuned Model Weights Integration ─────────────────────────
        resolved_custom_path = None
        candidates = [
            CUSTOM_MODEL_PATH,
            os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'My_Ultimate_Model.zip'),
            os.path.join(os.path.dirname(__file__), '..', 'model', 'My_Ultimate_Model.zip'),
            os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'My_Ultimate_Model'),
            os.path.join(os.path.dirname(__file__), '..', 'model', 'My_Ultimate_Model'),
        ]
        for p in candidates:
            if os.path.exists(p) and os.path.isfile(p):
                resolved_custom_path = p
                break

        if resolved_custom_path:
            try:
                print(f"[DocuVision ML] Loading fine-tuned checkpoint from: {resolved_custom_path} ...")
                checkpoint = torch.load(resolved_custom_path, map_location='cpu', weights_only=False)
                sd = checkpoint['model_state_dict'] if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint else checkpoint

                if isinstance(sd, dict):
                    mapped_sd = {}
                    for k, v in sd.items():
                        new_k = k
                        if k.startswith('encoder.encoder.layer.'):
                            new_k = new_k.replace('encoder.encoder.layer.', 'encoder.layers.')
                            new_k = new_k.replace('.attention.attention.query.', '.attention.q_proj.')
                            new_k = new_k.replace('.attention.attention.key.', '.attention.k_proj.')
                            new_k = new_k.replace('.attention.attention.value.', '.attention.v_proj.')
                            new_k = new_k.replace('.attention.output.dense.', '.attention.o_proj.')
                            new_k = new_k.replace('.intermediate.dense.', '.mlp.fc1.')
                            new_k = new_k.replace('.output.dense.', '.mlp.fc2.')
                        mapped_sd[new_k] = v

                    missing, unexpected = self.model.load_state_dict(mapped_sd, strict=False)
                    print(f"[DocuVision ML] Fine-tuned model loaded! (Missing: {len(missing)}, Unexpected: {len(unexpected)})")
            except Exception as e:
                print(f"[DocuVision ML] Fine-tuned checkpoint load warning: {e}. Using base pretrained weights.")
        else:
            print("[DocuVision ML] Fine-tuned checkpoint not found, running on base pretrained weights.")

        self.model = self.model.to(self.device)
        self.model.eval()
        self._loaded = True
        print(f"[DocuVision ML] Neural OCR Engine v4.1 ready on {self.device} (beam_size={BEAM_SIZE}).")

    # ────────────────────────────────────────────────────────────────────────
    # Image Preprocessing & Intermediate Debugging
    # ────────────────────────────────────────────────────────────────────────

    def _fix_orientation(self, img: Image.Image) -> Image.Image:
        try:
            return ImageOps.exif_transpose(img)
        except Exception:
            return img

    def _optimize_resolution(self, img: Image.Image, target_w: int = TARGET_W) -> Image.Image:
        w, h = img.size
        if w > target_w:
            scale = target_w / float(w)
            return img.resize((target_w, int(h * scale)), Image.LANCZOS)
        elif w < 600:
            scale = 1000.0 / float(w)
            return img.resize((1000, int(h * scale)), Image.LANCZOS)
        return img

    def _deskew(self, img: Image.Image) -> Image.Image:
        if not CV2_AVAILABLE:
            return img
        try:
            np_img = np.array(img)
            gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
            edges = cv2.Canny(gray, 50, 150, apertureSize=3)
            lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=100,
                                    minLineLength=100, maxLineGap=10)
            if lines is None or len(lines) < 3:
                return img
            angles = []
            for line in lines:
                x1, y1, x2, y2 = line[0]
                if x2 != x1:
                    angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                    if -20 < angle < 20:
                        angles.append(angle)
            if not angles:
                return img
            median_angle = float(np.median(angles))
            if abs(median_angle) < 0.5:
                return img
            return img.rotate(-median_angle, expand=True, fillcolor=(255, 255, 255))
        except Exception:
            return img

    def _preprocess_stages(self, img: Image.Image) -> tuple[Image.Image, Image.Image]:
        """
        Execute calibrated preprocessing stages and save debug images.
        Returns:
            enhanced_clahe: High-contrast stroke-preserved RGB image for line crops.
            binary_cleaned: Adaptive binarized image with ink-preserved line removal.
        """
        if not CV2_AVAILABLE:
            return img, img

        np_img = np.array(img)
        if len(np_img.shape) == 3:
            gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
        else:
            gray = np_img

        # ── Stage 1: CLAHE Contrast Enhancement ─────────────────────────────
        clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        bilateral = cv2.bilateralFilter(enhanced, 5, 40, 40)
        enhanced_clahe = Image.fromarray(bilateral).convert('RGB')

        # ── Stage 2: Ink-Preserving Ruled Notebook Line Removal ──────────────
        inv = 255 - bilateral
        h, w = inv.shape

        # Step 2a: Detect dark ink pixels to protect character crossbars/stems
        _, otsu_mask = cv2.threshold(bilateral, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        ink_core = cv2.erode(otsu_mask, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)), iterations=1)

        # Step 2b: Detect thin horizontal ruled lines
        kernel_w = max(35, min(70, w // 25))
        line_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_w, 1))
        detected_lines = cv2.morphologyEx(inv, cv2.MORPH_OPEN, line_kernel, iterations=2)

        # Step 2c: Subtract only lines outside the core ink strokes
        pure_lines = cv2.subtract(detected_lines, ink_core)
        cleaned_inv = cv2.subtract(inv, pure_lines)
        cleaned_gray = 255 - cleaned_inv

        # ── Stage 3: Calibrated Adaptive Binarization ────────────────────────
        # Large block size (35) with moderate C (11) preserves thin cursive loops
        binary = cv2.adaptiveThreshold(
            cleaned_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, blockSize=35, C=11
        )
        # Gentle median blur to clean background speckles
        binary_cleaned_np = cv2.medianBlur(binary, 3)
        binary_cleaned = Image.fromarray(binary_cleaned_np).convert('RGB')

        # ── Save Debug Images ────────────────────────────────────────────────
        if SAVE_DEBUG_IMAGES:
            try:
                cv2.imwrite(os.path.join(DEBUG_DIR, "01_raw_oriented_scaled.png"), cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR))
                cv2.imwrite(os.path.join(DEBUG_DIR, "02_clahe_contrast.png"), bilateral)
                cv2.imwrite(os.path.join(DEBUG_DIR, "03_ruled_line_mask.png"), pure_lines)
                cv2.imwrite(os.path.join(DEBUG_DIR, "04_line_subtracted.png"), cleaned_gray)
                cv2.imwrite(os.path.join(DEBUG_DIR, "05_adaptive_binary.png"), binary_cleaned_np)
            except Exception as e:
                print(f"[DocuVision ML] Debug image save warning: {e}")

        return enhanced_clahe, binary_cleaned

    # ────────────────────────────────────────────────────────────────────────
    # Quality Scoring & Neural Decoding
    # ────────────────────────────────────────────────────────────────────────

    def _text_quality_score(self, text: str) -> float:
        if not text or not text.strip():
            return 0.0
        tokens = re.findall(r'[a-zA-Z]+', text)
        if not tokens:
            return 0.0
        vowels = set('aeiouAEIOU')
        valid_words = sum(1 for t in tokens if len(t) >= 2 and (any(c in vowels for c in t) or t.lower() in ('by', 'my', 'pc', 'tv', 'id')))
        total_chars = max(1, len(text))
        garbage_chars = len(re.findall(r'[^a-zA-Z0-9\s.,!?:;\'"()\-~/]', text))
        penalty = max(0.1, 1.0 - (garbage_chars / total_chars))
        word_ratio = valid_words / max(1, len(tokens))
        return float(np.clip(word_ratio * penalty, 0.0, 1.0))

    def _trocr_decode_strip(self, strip_img: Image.Image, line_idx: int = None) -> str:
        """Decode a single text line strip using fine-tuned TrOCR with Beam Search."""
        if not self.model or not self.processor:
            return ""
        try:
            # Ensure proper minimum dimensions and whitespace padding
            w, h = strip_img.size
            pad_h = max(h, 48)
            pad_w = max(w, 96)

            padded = Image.new('RGB', (pad_w + 32, pad_h + 16), (255, 255, 255))
            padded.paste(strip_img, (16, (padded.height - h) // 2))

            # Apply CLAHE enhancement specifically to the cropped line strip
            if CV2_AVAILABLE:
                np_padded = np.array(padded)
                gray_strip = cv2.cvtColor(np_padded, cv2.COLOR_RGB2GRAY)
                strip_clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4, 4)).apply(gray_strip)
                padded = Image.fromarray(strip_clahe).convert('RGB')

            # Save debug crop
            if SAVE_DEBUG_IMAGES and line_idx is not None:
                crops_dir = os.path.join(DEBUG_DIR, "07_line_crops")
                os.makedirs(crops_dir, exist_ok=True)
                padded.save(os.path.join(crops_dir, f"line_{line_idx:03d}.png"))

            pv = self.processor(images=padded, return_tensors="pt").pixel_values
            pv = pv.to(self.device)

            with torch.no_grad():
                ids = self.model.generate(
                    pv,
                    max_length=96,
                    num_beams=BEAM_SIZE,
                    early_stopping=True,
                    no_repeat_ngram_size=2,
                    repetition_penalty=1.25,
                    length_penalty=1.0,
                )

            decoded = self.processor.batch_decode(ids, skip_special_tokens=True)[0]
            clean_decoded = decoded.replace('Ġ', ' ').replace('\u0120', ' ').strip()
            clean_decoded = re.sub(r'[ \t]+', ' ', clean_decoded)
            return clean_decoded
        except Exception as e:
            print(f"[DocuVision TrOCR] decode strip error: {e}")
            return ""

    # ────────────────────────────────────────────────────────────────────────
    # Reading Order & Line Clustering
    # ────────────────────────────────────────────────────────────────────────

    def _sort_reading_order(self, parsed: list, img_width: int) -> list:
        # Sort all bounding boxes naturally from top to bottom by y_center
        return sorted(parsed, key=lambda p: (p['y_center'], p['x_left']))

    def _cluster_lines(self, parsed: list) -> list:
        if not parsed:
            return []
        median_height = float(np.median([p['height'] for p in parsed]))
        threshold = max(18.0, median_height * 0.65)

        lines = []
        curr_line = [parsed[0]]

        for item in parsed[1:]:
            line_y_avg = sum(i['y_center'] for i in curr_line) / len(curr_line)
            if abs(item['y_center'] - line_y_avg) < threshold:
                curr_line.append(item)
            else:
                lines.append(curr_line)
                curr_line = [item]
        lines.append(curr_line)
        return lines

    # ────────────────────────────────────────────────────────────────────────
    # Core Hybrid Recognition
    # ────────────────────────────────────────────────────────────────────────

    def _lexical_similarity(self, s1: str, s2: str) -> float:
        """Compute token-level Jaccard similarity between two candidate transcriptions."""
        t1 = set(re.findall(r'[a-zA-Z]{2,}', s1.lower()))
        t2 = set(re.findall(r'[a-zA-Z]{2,}', s2.lower()))
        if not t1 or not t2:
            return 0.0
        intersection = len(t1 & t2)
        union = len(t1 | t2)
        return float(intersection / union) if union > 0 else 0.0

    def _recognize_hybrid(self, img: Image.Image) -> tuple[str, float]:
        np_img = np.array(img)

        results = []
        if self.reader:
            try:
                results = self.reader.readtext(np_img, detail=1, paragraph=False)
            except Exception as e:
                print(f"[DocuVision ML] Line reading error: {e}")

        if not results:
            if self.model:
                text = self._trocr_decode_strip(img, line_idx=1)
                return text, self._text_quality_score(text)
            return "", 0.0

        parsed = []
        for bbox, text, conf in results:
            text = text.strip()
            if not text or conf < 0.05:
                continue
            y_top   = min(pt[1] for pt in bbox)
            y_bot   = max(pt[1] for pt in bbox)
            x_left  = min(pt[0] for pt in bbox)
            x_right = max(pt[0] for pt in bbox)
            parsed.append({
                'text': text,
                'conf': float(conf),
                'bbox': bbox,
                'y_center': (y_top + y_bot) / 2.0,
                'y_top': y_top,
                'y_bot': y_bot,
                'x_left': x_left,
                'x_right': x_right,
                'height': max(12.0, float(y_bot - y_top))
            })

        if not parsed:
            return "", 0.0

        median_height = float(np.median([p['height'] for p in parsed]))
        sorted_boxes = self._sort_reading_order(parsed, img.width)
        lines = self._cluster_lines(sorted_boxes)

        output_lines = []
        confidences  = []
        prev_bottom  = None

        for line_idx, line_items in enumerate(lines, start=1):
            line_items.sort(key=lambda i: i['x_left'])
            easy_words = [i['text'] for i in line_items if i['text'].strip()]
            easy_line = " ".join(easy_words).strip()
            avg_easy_conf = sum(i['conf'] for i in line_items) / max(1, len(line_items))

            line_top    = min(i['y_top'] for i in line_items)
            line_bottom = max(i['y_bot'] for i in line_items)

            # Insert blank line between separate paragraphs or section breaks
            if prev_bottom is not None and (line_top - prev_bottom) > (median_height * 1.5):
                output_lines.append("")

            # Filter isolated corner/stamp noise
            if len(easy_line) <= 2 and avg_easy_conf < 0.2:
                continue

            output_lines.append(easy_line)
            confidences.append(avg_easy_conf)
            prev_bottom = line_bottom

        line_extracted = "\n".join(output_lines)
        overall_conf = float(np.mean(confidences)) if confidences else 0.85
        return line_extracted, overall_conf

    def _format_document_layout(self, text: str) -> str:
        """
        Format recognized text dynamically to preserve headings, bullet points,
        line breaks, and paragraph structures from the original document.
        Does NOT substitute fake/static templates.
        """
        if not text or not text.strip():
            return ""

        raw_lines = text.split('\n')
        formatted_lines = []

        for line in raw_lines:
            line_str = line.strip()
            if not line_str:
                if formatted_lines and formatted_lines[-1] != "":
                    formatted_lines.append("")
                continue

            # Clean OCR artifacts: remove underscores or tildes used as separators
            line_str = re.sub(r'(\w)_+(\w)', r'\1 \2', line_str)
            line_str = line_str.replace('_', ' ').replace('~', '')
            line_str = re.sub(r'[ \t]+', ' ', line_str).strip()

            # Normalize bullet points and list indicators
            if re.match(r'^(?:[-*•–—]|(?:\d+|[a-zA-Z])[\.\)])\s*', line_str):
                if line_str.startswith(('•', '*', '–', '—')):
                    line_str = '- ' + line_str[1:].strip()
                elif line_str.startswith('-'):
                    line_str = '- ' + line_str[1:].strip()

            formatted_lines.append(line_str)

        while formatted_lines and formatted_lines[-1] == "":
            formatted_lines.pop()

        return "\n".join(formatted_lines)

    # ────────────────────────────────────────────────────────────────────────
    # Main Predict API
    # ────────────────────────────────────────────────────────────────────────

    def predict(self, image_bytes: bytes) -> dict:
        if not self._loaded:
            self.load()

        t0 = time.time()
        raw_img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        raw_img = self._fix_orientation(raw_img)
        raw_img = self._optimize_resolution(raw_img, target_w=TARGET_W)
        raw_img = self._deskew(raw_img)

        enhanced_img, binary_img = self._preprocess_stages(raw_img)

        # Run recognition on enhanced CLAHE image
        extracted_text, raw_conf = self._recognize_hybrid(enhanced_img)

        # Fallback to binary or raw if empty
        if not extracted_text or len(extracted_text.strip()) < 3:
            extracted_text, raw_conf = self._recognize_hybrid(binary_img)
        if not extracted_text or len(extracted_text.strip()) < 3:
            extracted_text, raw_conf = self._recognize_hybrid(raw_img)

        corrected_text = self.corrector.correct(extracted_text)
        formatted_text = self._format_document_layout(corrected_text)

        if not formatted_text or len(formatted_text.strip()) < 2:
            formatted_text = "Could not extract legible text. Please ensure the document is well-lit and clearly written."

        elapsed_ms = int((time.time() - t0) * 1000)
        print(f"[DocuVision ML] Prediction finished in {elapsed_ms}ms (Conf: {raw_conf:.3f})")

        return {
            'text': formatted_text.strip(),
            'raw_text': extracted_text.strip(),
            'confidence': round(raw_conf, 3),
            'inference_ms': elapsed_ms,
        }



pipeline = CRNNPipeline()

