import datetime
from typing import Dict, Any


class OutputFormatter:
    """
    v2.0: Added paragraph_count, sentence_count, has_equations, device_used
    to the output payload. Fixed reading_time_sec to use 138 wpm average.
    """

    def format(
        self,
        original_text: str,
        corrected_text: str,
        profile: Any,
        flan_output: Dict[str, Any],
        confidence: float,
        processing_time_ms: int,
        device_used: str = "cpu",
    ) -> Dict[str, Any]:

        # Confidence label
        if confidence >= 0.85:
            confidence_label = "High"
        elif confidence >= 0.65:
            confidence_label = "Medium"
        else:
            confidence_label = "Low — review recommended"

        # Reading time at ~138 words/min (2.3 words/sec)
        reading_time_sec = max(1, int(profile.word_count / 2.3))

        # Paragraph count: double newlines separate paragraphs
        paragraph_count = max(1, corrected_text.count('\n\n') + 1) if corrected_text else 1

        # has_equations — new field from v2.0 ContentProfile
        has_equations = getattr(profile, 'has_equations', False)

        return {
            # ── Primary Output ─────────────────────────────────────────────
            'transcribed_text': corrected_text,
            'original_raw_text': original_text,

            # ── Summarization ──────────────────────────────────────────────
            'summary': flan_output.get('summary'),
            'key_points': flan_output.get('key_points', []),
            'action_items': flan_output.get('action_items', []),
            'keywords': flan_output.get('keywords', []),

            # ── Content Intelligence ───────────────────────────────────────
            'content_type': profile.content_type,
            'tone': profile.tone,
            'has_dates': profile.has_dates,
            'has_action_items': profile.has_action_items,
            'has_equations': has_equations,

            # ── Document Stats ─────────────────────────────────────────────
            'word_count': profile.word_count,
            'sentence_count': profile.sentence_count,
            'paragraph_count': paragraph_count,
            'reading_time_sec': reading_time_sec,

            # ── Quality & Performance ──────────────────────────────────────
            'transcription_confidence': confidence,
            'confidence_label': confidence_label,
            'total_processing_time_ms': processing_time_ms,
            'device_used': device_used,
            'processed_at': datetime.datetime.utcnow().isoformat() + "Z",
        }
