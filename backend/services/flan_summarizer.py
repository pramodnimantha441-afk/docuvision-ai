import re
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Dict, List, Any


class FlanT5Summarizer:
    """
    DocuVision AI Abstractive Summarizer v4.0 (Powered by Google Flan-T5).
    Generates high-precision executive summaries, key points, action items,
    and topical keywords with robust multi-pass parsing.
    """
    MODEL_NAME = 'google/flan-t5-base'

    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    def load(self):
        if self.model and self.tokenizer:
            return
        print(f"[DocuVision NLP] Loading {self.MODEL_NAME} on {self.device}...")
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            self.MODEL_NAME,
            torch_dtype=torch.float16 if self.device.type == 'cuda' else torch.float32
        )
        self.model = self.model.to(self.device)
        self.model.eval()
        print(f"[DocuVision NLP] Flan-T5 transformer loaded successfully on {self.device}.")

    def _run_prompt(self, prompt: str, max_new_tokens: int = 150) -> str:
        if not self.model or not self.tokenizer:
            return ""
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                num_beams=4,
                early_stopping=True,
                no_repeat_ngram_size=3,
                length_penalty=1.2,
            )
        decoded = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        return decoded

    def _parse_list(self, text: str) -> List[str]:
        """Robustly parse numbered or bulleted lists from generated output."""
        if not text or not text.strip():
            return []

        # Try regex numbered items: 1. Item 2. Item or 1) Item 2) Item
        numbered = re.findall(r'(?:^|\d+[\.\)]\s*)([^\d\.\)]+?)(?=\s*\d+[\.\)]|$)', text, re.MULTILINE)
        cleaned = [item.strip('- *•\n\t ') for item in numbered if item.strip()]

        if not cleaned:
            # Fallback to line / bullet splitting
            lines = [l.strip('- *•\n\t ') for l in re.split(r'[\n;]', text)]
            cleaned = [l for l in lines if l and len(l) > 3]

        return [c for c in cleaned if len(c) > 2]

    def _parse_keywords(self, text: str) -> List[str]:
        """Parse comma or newline separated keywords."""
        if not text:
            return []
        raw = re.split(r'[,;\n•*]', text)
        keywords = []
        for kw in raw:
            k = kw.strip().strip('.-* ')
            # Remove leading numbers like "1."
            k = re.sub(r'^\d+[\.\)]\s*', '', k).strip()
            if k and len(k) >= 2 and k.lower() not in ('none', 'n/a', 'keyword', 'keywords'):
                keywords.append(k)
        return list(dict.fromkeys(keywords))[:8]

    def summarize(self, cleaned_text: str, top_sentences: List[str], content_profile: Any) -> Dict[str, Any]:
        if not self.model or not self.tokenizer:
            self.load()

        if not cleaned_text or len(cleaned_text.strip()) < 10:
            return {
                'summary': 'Insufficient text provided for summarization.',
                'key_points': [],
                'action_items': [],
                'keywords': []
            }

        # Truncate text appropriately for context
        context = cleaned_text[:1400]

        # ── 1. Executive Summary ──────────────────────────────────────────────
        summary_prompt = (
            f"Summarize the main ideas and core purpose of the following document in 2 concise, fluent sentences:\n\n"
            f"{context}\n\n"
            f"Summary:"
        )
        summary = self._run_prompt(summary_prompt, max_new_tokens=120)
        if not summary or len(summary) < 15:
            # Fallback prompt
            summary = self._run_prompt(f"Provide a brief summary of this text:\n{context}", max_new_tokens=100)

        # ── 2. Key Points ─────────────────────────────────────────────────────
        kp_prompt = (
            f"Extract the top 3 most important key points from this text as a numbered list:\n\n"
            f"{context}\n\n"
            f"1."
        )
        kp_raw = self._run_prompt(kp_prompt, max_new_tokens=150)
        # Prepend 1. if model continued from prompt
        if kp_raw and not kp_raw.startswith("1."):
            kp_raw = "1. " + kp_raw
        key_points = self._parse_list(kp_raw)
        if not key_points and top_sentences:
            key_points = top_sentences[:3]

        # ── 3. Action Items ───────────────────────────────────────────────────
        action_items = []
        action_prompt = (
            f"Identify any action items, tasks, or next steps mentioned in this text as a list. "
            f"If none are explicitly mentioned, list key recommendations:\n\n{context}"
        )
        action_raw = self._run_prompt(action_prompt, max_new_tokens=100)
        parsed_actions = self._parse_list(action_raw)
        action_items = [a for a in parsed_actions if not any(w in a.lower() for w in ('none mentioned', 'no action', 'no specific'))][:4]

        # ── 4. Keywords ───────────────────────────────────────────────────────
        kw_prompt = (
            f"Extract 5 to 7 central domain keywords and topics from the following text, separated by commas:\n\n{context}"
        )
        kw_raw = self._run_prompt(kw_prompt, max_new_tokens=60)
        keywords = self._parse_keywords(kw_raw)
        if len(keywords) < 3:
            # Extract high-frequency non-stop words from context
            words = [w.lower() for w in re.findall(r'[a-zA-Z]{4,}', context) if w.lower() not in ('with', 'this', 'that', 'from', 'have', 'were', 'which', 'their', 'about')]
            top_kw = list(dict.fromkeys(words))[:5]
            keywords = list(dict.fromkeys(keywords + top_kw))[:6]

        return {
            'summary': summary.strip(),
            'key_points': key_points[:5],
            'action_items': action_items,
            'keywords': keywords[:8]
        }

