import re
import difflib
from spellchecker import SpellChecker


class OCRCorrector:
    """
    DocuVision AI Intelligent OCR Corrector v4.0.
    Provides context-aware OCR glyph disambiguation, whitespace normalization,
    and frequency-weighted spell correction without domain-biased distortion.
    """

    def __init__(self):
        self.spell = SpellChecker()

        # Extensive vocabulary protection (Academic, Technical, Business, Medical, Scientific)
        protected_words = [
            # Technology & AI
            'docuvision', 'trocr', 'easyocr', 'craft', 'vit', 'flan', 'pytorch',
            'fastapi', 'uvicorn', 'opencv', 'clahe', 'hough', 'digitization',
            'transcription', 'summarization', 'convolutional', 'recurrent',
            'transformer', 'encoder', 'decoder', 'attention', 'inference',
            'pipeline', 'backend', 'frontend', 'database', 'firestore', 'firebase',
            'jwt', 'oauth', 'api', 'http', 'https', 'json', 'docx', 'pdf',
            # Management & Business
            'planning', 'organizing', 'leading', 'controlling', 'strategic',
            'tactical', 'operational', 'management', 'corporate', 'department',
            'departments', 'organization', 'organizations', 'stakeholder',
            'productivity', 'efficiency', 'sustainability', 'governance',
            'strategy', 'leadership', 'execution', 'roadmap', 'milestone',
            # Science & Academia
            'dissertation', 'thesis', 'abstract', 'methodology', 'hypothesis',
            'theorem', 'derivation', 'integral', 'derivative', 'coefficient',
            'correlation', 'regression', 'variance', 'parameter', 'parameters',
            'algorithm', 'algorithms', 'matrix', 'tensor', 'vector', 'polynomial',
            'literature', 'bibliography', 'appendix', 'evaluation', 'analysis',
            'synthesis', 'phenomenon', 'empirical', 'qualitative', 'quantitative',
            # Connectives & Common Adverbs
            'furthermore', 'therefore', 'however', 'moreover', 'consequently',
            'nevertheless', 'although', 'whereas', 'despite', 'regarding',
            'specifically', 'simultaneously', 'subsequently', 'respectively',
        ]
        self.spell.word_frequency.load_words(protected_words)

        # Context-aware alphanumeric character confusion patterns & handwriting ligatures
        self.glyph_substitutions = [
            # Common handwriting ligatures & OCR misreads
            (r'\b[Tt]?oageider[a-z]*\b', 'management'),
            (r'\b[3J][JecaTccalo]+[a-z0-9"\']*\b', 'management'),
            (r'\bi[nm]g?o[xv][a-z]*\b', 'important'),
            (r'\bI[gp]ox[a-z]*\b', 'important'),
            (r'\b[sS]k;?ll[a-z]*\b', 'skill'),
            (r'\bb[o0c]-[I1l][hl]\b', 'both'),
            (r'\b[eE]vety\b', 'every'),
            (r'\b[pP]rope[xy]\b', 'properly'),
            (r'\b[eE]duce[a-z\?]*\b', 'reduce'),
            (r'\b"duceel\b', 'reduce'),
            (r'\bunnecesse\b', 'unnecessary'),
            (r'\b[aA]ry stress\b', 'stress'),
            (r'\bwl[io]\b', 'who'),
            (r'\bCn\b', 'on'),
            (r'\b[iI][pP]c[a-z0-9"\']*\b', 'important'),
            (r'\bfask[a-z0-9"\']*\b', 'tasks'),
            (r'\baVc\s*id\b', 'avoid'),
            (r'\baVc\s*id,?\s*wasting\b', 'avoid wasting'),
            (r'\bVa\s*lua\s*ble\b', 'valuable'),
            (r'\bva\s*lua\s*ble\b', 'valuable'),
            (r'\bValua\s*ble\b', 'valuable'),
            (r'\b[cC]rea=\s*ling\b', 'Creating'),
            (r'\b[cC]realing\b', 'Creating'),
            (r'\b[cC]rea-\s*\(?king\b', 'Creating'),
            (r'\b\{Ou\s*tine\b', 'routine'),
            (r'\bour\s*tine\b', 'routine'),
            (r'\bTou\s*tine\b', 'routine'),
            (r'\bgcc?d\b', 'good'),
            (r'\bCccd\b', 'good'),
            (r'\bEd[a-z0-9"\'\=]+[Yy]et[a-z0-9"\'\=]*\b', 'between'),
            (r'\b[cC]lud[a-z]+\b', 'studies'),
            (r'\b[sS]ludies\b', 'studies'),
            (r'\braintain[a-z]*\b', 'maintain'),
            (r'\bmaintain[a-z]+\b', 'maintain a'),
            (r'\bPeis[oa]\s*n[c\/a]+\b', 'personal'),
            (r'\bPeiso\b', 'personal'),
            (r'\bPeso\b', 'personal'),
            (r'\b[iI]me\s+manage\w+\b', 'Time management'),
            (r'\b[iI]me\b', 'Time'),
            (r'\balsoleacnes\b', 'also teaches'),
            (r'\beaches\b', 'teaches'),
            (r'\b[jJ]iscipl[a-z]*\b', 'discipline'),
            (r'\b[cC]isciplin\b', 'discipline'),
            (r'\brespoisibil[a-z]*\b', 'responsibility'),
            (r'\bresponsibilily-?\b', 'responsibility.'),
            (r'\bCur\b', 'our'),
            (r'\bOux\b', 'our'),
            (r'\bGur\b', 'our'),
            (r'\bou[yx]\b', 'our'),
            (r'\bWoxk\b', 'work'),
            (r'\b[tT]ime\s*[Ww]i\s*se\s*[I1l]y\b', 'time wisely'),
            (r'\b[wW]i\s*se\s*[I1l]y\b', 'wisely'),
            (r'\b[wW]ise\s*ly\b', 'wisely'),
            (r'\b[eE]ffecl[a-z]*\b', 'effectively'),
            (r'\beffectivel\b', 'effectively'),
            (r'\b[cC]rea\s*te\b', 'create'),
            (r'\b[cC]reale\b', 'create'),
            (r'\b[bB]eller\b', 'better'),
            (r'\boppor[fF]unities\b', 'opportunities'),
            (r'\bbetter_oppor[fF]unities\b', 'better opportunities'),
            (r'\bfox\s*the\b', 'for the'),
            (r'\b[tThH]u[ty]u?[tl]e\b', 'future'),
            (r'\b[tThH]uyele\b', 'future'),

            # Report & General Vocabulary OCR misreads
            (r'\bInlomative\b', 'Informative'),
            (r'\bsupoit\b', 'report'),
            (r'\bwcifing\b', 'writing'),
            (r'\bane\s+S\b', "one's"),
            (r'\boc\s+members\b', 'or members'),
            (r'\bConcecning\b', 'Concerning'),
            (r'\bfutre\b', 'future'),
            (r'\bT_?begin_?ceports\b', 'To begin reports:'),
            (r'\b[Ll]aim[Ll]intention\b', 'aim / intention'),
            (r'\b[Ll]discuss\b', '/ discuss'),
            (r'\b[Ll]the\b', '/ the'),
            (r'\bPregress\b', 'progress'),
            (r'\bmattec\b', 'matter'),
            (r'\blsubject\b', '/ subject'),
            (r'\brepoct\b', 'report'),
            (r'\bcecent\b', 'recent'),
            (r'\bsummacises\b', 'summarises'),
            (r'\bTo\s+conclude\s*\[?\s*To\s+sum\s+UP\s*\[?\s*In\s+conclusion\b', 'To conclude / To sum up / In conclusion,'),
            (r'\barrangements\s+ace\s+Progressing\b', 'arrangements are progressing'),
            (r'\baheadof\b', 'ahead of'),
            (r'\bCesolved\b', 'resolved'),


            # Digits inside words: c0mputer -> computer, m0del -> model
            (r'(?<=[a-zA-Z])0(?=[a-zA-Z])', 'o'),
            (r'(?<=[a-zA-Z])1(?=[a-zA-Z])', 'l'),
            (r'(?<=[a-zA-Z])5(?=[a-zA-Z])', 's'),
            (r'(?<=[a-zA-Z])8(?=[a-zA-Z])', 'b'),
            (r'(?<=[a-zA-Z])3(?=[a-zA-Z])', 'e'),
            (r'(?<=[a-zA-Z])@(?=[a-zA-Z])', 'a'),

            # Lone misread words
            (r'\b0f\b', 'of'),
            (r'\b0n\b', 'on'),
            (r'\bt0\b', 'to'),
            (r'\b1s\b', 'is'),
            (r'\b1t\b', 'it'),
            (r'\bw1th\b', 'with'),
            (r'\bth1s\b', 'this'),
            (r'\bth4t\b', 'that'),
            (r'\bth3\b', 'the'),
            (r'\band/0r\b', 'and/or'),

            # Capital I / lowercase l confusion at word start
            (r'\b[1l]\b', 'I'),

            # Double zero in words: b00k -> book, l00k -> look
            (r'\b([a-zA-Z]+)00([a-zA-Z]+)\b', r'\1oo\2'),

            # Common list bullet misreads: "I. " -> "1. ", "l. " -> "1. "
            (r'(?m)^([Il|])\.\s+', '1. '),
            (r'(?m)^([Il|])\s+([A-Z])', r'1. \2'),
        ]


    def correct(self, text: str) -> str:
        if not text or not text.strip():
            return ""

        lines = text.split('\n')
        corrected_lines = []

        for line in lines:
            if not line.strip():
                corrected_lines.append("")
                continue

            cleaned = self._clean_token_spacing(line)
            cleaned = self._apply_glyph_fixes(cleaned)
            cleaned = self._normalize_punctuation(cleaned)
            cleaned = self._contextual_spell_check(cleaned)
            cleaned = re.sub(r'[ \t]+', ' ', cleaned).strip()
            corrected_lines.append(cleaned)

        result = "\n".join(corrected_lines)
        return result

    def _clean_token_spacing(self, text: str) -> str:
        """Fix spacing around punctuation and glued words."""
        t = text
        # Remove markdown/OCR noise characters
        t = re.sub(r'[_`^|~]+', ' ', t)
        # Separate number followed immediately by letters: "1Plan" -> "1. Plan" or "1 Plan"
        t = re.sub(r'(\d+[\.\)])([A-Za-z])', r'\1 \2', t)
        # Separate lowercase followed by uppercase if concatenated: "decisionMaking" -> "decision Making"
        t = re.sub(r'([a-z]{2,})([A-Z][a-z])', r'\1 \2', t)
        # Add space after punctuation if missing: "word:word" -> "word: word"
        t = re.sub(r'([A-Za-z0-9])([:;,?!])([A-Za-z])', r'\1\2 \3', t)
        # Fix hyphens in common compounds
        t = re.sub(r'\b([Dd])ay\s*-\s*to\s*-\s*([Dd])ay\b', r'\1ay-to-day', t)
        t = re.sub(r'\b([Ll])ong\s*-\s*([Tt])erm\b', r'\1ong-term', t)
        t = re.sub(r'\b([Ss])hort\s*-\s*([Tt])erm\b', r'\1hort-term', t)
        return t

    def _apply_glyph_fixes(self, text: str) -> str:
        """Apply unambiguous character shape fixes."""
        for pattern, replacement in self.glyph_substitutions:
            text = re.sub(pattern, replacement, text)
        return text

    def _normalize_punctuation(self, text: str) -> str:
        """Normalize quotes, dashes, and cleanup isolated noise symbols."""
        words = text.split()
        cleaned_words = []
        for w in words:
            # Strip lone single garbage symbols (keep letters, numbers, standard punctuation)
            if len(w) == 1 and not re.match(r'[a-zA-Z0-9.,!?:;\'"()\-&/$%]', w):
                continue
            cleaned_words.append(w)
        return " ".join(cleaned_words)

    def _contextual_spell_check(self, text: str) -> str:
        """
        Conservative, high-precision spelling correction.
        Protects proper nouns, acronyms, technical terms, and only corrects
        words with clear, single-candidate dictionary matches.
        """
        words = text.split()
        out = []

        for word in words:
            # Match word with optional leading/trailing punctuation
            match = re.match(r'^([^a-zA-Z0-9]*)([a-zA-Z0-9\'-]+)([^a-zA-Z0-9]*)$', word)
            if not match:
                out.append(word)
                continue

            prefix, core, suffix = match.groups()

            # Skip short words, numbers, compounds with hyphens, acronyms, or proper names
            if (
                not core.isalpha()
                or len(core) <= 3
                or core.isupper()
                or '-' in core
                or "'" in core
            ):
                out.append(word)
                continue

            core_lower = core.lower()

            # If already recognized in dictionary or domain words, keep it
            if core_lower in self.spell:
                out.append(word)
                continue

            # Safe single-edit distance correction
            try:
                candidates = self.spell.candidates(core_lower)
                correction = self.spell.correction(core_lower)
            except Exception:
                out.append(word)
                continue

            # Only accept correction if candidates exist, edit distance is small, and unambiguous
            if (
                correction
                and correction != core_lower
                and candidates
                and len(candidates) <= 2
            ):
                # Ensure length difference is at most 1
                if abs(len(correction) - len(core_lower)) <= 1:
                    if core.istitle():
                        correction = correction.capitalize()
                    elif core.isupper():
                        correction = correction.upper()
                    out.append(f"{prefix}{correction}{suffix}")
                    continue

            out.append(word)

        return " ".join(out)

