from fastapi import APIRouter, File, UploadFile, Form, Depends
from middleware.auth_middleware import verify_firebase_token
from services.ml_pipeline import pipeline
from services.summarizer import summarization_pipeline
from services.content_detector import ContentIntelligence
from services.output_formatter import OutputFormatter
import datetime
import time

router = APIRouter()

_detector  = ContentIntelligence()
_formatter = OutputFormatter()


@router.post('/transcribe')
async def transcribe(
    image: UploadFile = File(...),
    mode: str = Form(default='transcription'),
    token_data: dict = Depends(verify_firebase_token)
):
    """
    Main endpoint: upload handwriting image → returns transcribed + (optionally) summarized text.
    mode: 'transcription' | 'summarization'
    """
    t0 = time.time()

    # Read image bytes
    image_bytes = await image.read()

    # ── Stage 1: OCR inference ─────────────────────────────────────────────
    ml_result = pipeline.predict(image_bytes)
    corrected_text = ml_result['text']
    original_raw   = ml_result.get('raw_text', corrected_text)
    confidence     = ml_result['confidence']
    device_used    = str(pipeline.device) if pipeline._loaded else "cpu"

    if not corrected_text.strip() or len(corrected_text.strip()) < 2:
        elapsed = int((time.time() - t0) * 1000)
        return {
            "transcribed_text":   "Could not extract text from the image. Please try a clearer image.",
            "original_raw_text":  "",
            "summary":            None,
            "key_points":         [],
            "action_items":       [],
            "keywords":           [],
            "content_type":       "general",
            "tone":               "neutral",
            "has_dates":          False,
            "has_action_items":   False,
            "has_equations":      False,
            "word_count":         0,
            "sentence_count":     0,
            "paragraph_count":    0,
            "reading_time_sec":   0,
            "transcription_confidence": confidence,
            "confidence_label":   "Low — review recommended",
            "total_processing_time_ms": elapsed,
            "device_used":        device_used,
            "processed_at":       datetime.datetime.utcnow().isoformat() + "Z"
        }

    if mode == 'summarization' and len(corrected_text.split()) > 5:
        # ── Full summarization pipeline ───────────────────────────────────
        output = summarization_pipeline.run(original_raw, corrected_text=corrected_text, confidence=confidence, device_used=device_used)
    else:
        # ── Transcription mode: Content analysis and formatting ───────────
        profile = _detector.analyze(corrected_text)
        elapsed = int((time.time() - t0) * 1000)
        output  = _formatter.format(
            original_raw, corrected_text, profile,
            {'summary': None, 'key_points': [], 'action_items': [], 'keywords': []},
            confidence, elapsed, device_used
        )

    return output

