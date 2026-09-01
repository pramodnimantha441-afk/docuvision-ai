from dataclasses import dataclass
import re


@dataclass
class ContentProfile:
    content_type: str
    word_count: int
    sentence_count: int
    has_action_items: bool
    has_dates: bool
    has_numbers: bool
    has_equations: bool
    tone: str
    length_tier: str


class ContentIntelligence:
    """
    v2.0: Expanded content-type detection (8 types), richer tone analysis,
    equation detection, and improved date pattern matching.
    """

    _DATE_PATTERN = re.compile(
        r'\b('
        r'january|february|march|april|may|june|july|august|september|october|november|december'
        r'|monday|tuesday|wednesday|thursday|friday|saturday|sunday'
        r'|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}'
        r'|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}'
        r')\b',
        re.IGNORECASE
    )
    _EQUATION_PATTERN = re.compile(
        r'[=\+\-\*\/\^]\s*[\d\w]|[\d\w]\s*[=\+\*\/\^]|\b(integral|derivative|theorem|formula|equation|solve)\b',
        re.IGNORECASE
    )

    def analyze(self, text: str) -> ContentProfile:
        words = text.split()
        word_count = len(words)
        sentences = re.split(r'[.!?]+', text)
        sentence_count = len([s for s in sentences if s.strip()])

        lower_text = text.lower()

        has_action_items = bool(re.search(r'\b(todo|to do|action|task|must|should|need to|remember)\b', lower_text))
        has_dates = bool(self._DATE_PATTERN.search(text))
        has_numbers = bool(re.search(r'\d+', text))
        has_equations = bool(self._EQUATION_PATTERN.search(text))

        # ── Content type detection (priority order) ──────────────────────────
        content_type = "general"
        if "meeting" in lower_text or "agenda" in lower_text or "minutes" in lower_text:
            content_type = "meeting_notes"
        elif has_equations or any(w in lower_text for w in ("theorem", "formula", "proof", "derive", "integral")):
            content_type = "academic_math"
        elif any(w in lower_text for w in ("lecture", "professor", "chapter", "textbook", "exam", "quiz")):
            content_type = "lecture_notes"
        elif any(w in lower_text for w in ("study", "revision", "notes on", "summary of")):
            content_type = "study_notes"
        elif "todo" in lower_text or "task" in lower_text or has_action_items:
            content_type = "todo_list"
        elif any(w in lower_text for w in ("recipe", "ingredient", "tablespoon", "teaspoon", "bake", "cook")):
            content_type = "recipe"
        elif any(w in lower_text for w in ("sincerely", "regards", "dear sir", "dear madam", "yours faithfully")):
            content_type = "letter"
        elif "dear diary" in lower_text or "feeling" in lower_text or "today i" in lower_text:
            content_type = "diary"

        # ── Tone detection ────────────────────────────────────────────────────
        tone = "neutral"
        if any(w in lower_text for w in ("urgent", "asap", "immediately", "critical", "emergency")):
            tone = "urgent"
        elif any(w in lower_text for w in ("please", "thank", "kindly", "appreciate", "grateful")):
            tone = "polite"
        elif text.count("!") > 2:
            tone = "emphatic"
        elif any(w in lower_text for w in ("formal", "hereby", "pursuant", "therefore", "whereas")):
            tone = "formal"

        # ── Length tier ───────────────────────────────────────────────────────
        length_tier = "short"
        if word_count > 300:
            length_tier = "long"
        elif word_count > 80:
            length_tier = "medium"

        return ContentProfile(
            content_type=content_type,
            word_count=word_count,
            sentence_count=sentence_count,
            has_action_items=has_action_items,
            has_dates=has_dates,
            has_numbers=has_numbers,
            has_equations=has_equations,
            tone=tone,
            length_tier=length_tier
        )
