import time
from .ocr_corrector import OCRCorrector
from .content_detector import ContentIntelligence
from .sentence_scorer import SentenceScorer
from .flan_summarizer import FlanT5Summarizer
from .output_formatter import OutputFormatter


class SummarizationPipeline:
    def __init__(self):
        self.corrector = OCRCorrector()
        self.detector = ContentIntelligence()
        self.scorer = SentenceScorer()
        self.flan = FlanT5Summarizer()
        self.formatter = OutputFormatter()

    def load_models(self):
        self.flan.load()

    def run(self, raw_text: str, corrected_text: str = None, confidence: float = 0.8, device_used: str = "cpu") -> dict:
        t0 = time.time()
        if corrected_text is None:
            corrected = self.corrector.correct(raw_text)
        else:
            corrected = corrected_text

        profile = self.detector.analyze(corrected)
        top_sents = self.scorer.get_top_sentences(corrected, k=5)
        flan_result = self.flan.summarize(corrected, top_sents, profile)
        elapsed_ms = int((time.time() - t0) * 1000)
        return self.formatter.format(raw_text, corrected, profile, flan_result, confidence, elapsed_ms, device_used)


summarization_pipeline = SummarizationPipeline()

