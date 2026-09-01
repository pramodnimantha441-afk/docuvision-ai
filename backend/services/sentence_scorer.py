import math
import collections
import re
from typing import List

class SentenceScorer:
    def get_top_sentences(self, text: str, k: int = 5) -> List[str]:
        sentences = re.split(r'(?<=[.!?]) +', text.strip())
        if len(sentences) <= k:
            return sentences

        # Tokenize and compute term frequency (TF) per sentence
        sent_words = []
        doc_freq = collections.defaultdict(int)
        
        for sentence in sentences:
            words = [w.lower() for w in re.findall(r'\b\w+\b', sentence)]
            sent_words.append(words)
            unique_words = set(words)
            for w in unique_words:
                doc_freq[w] += 1

        total_sents = len(sentences)
        
        # Compute IDF
        idf = {}
        for w, count in doc_freq.items():
            idf[w] = math.log(total_sents / (count + 1)) + 1 # Smoothing

        scores = []
        for i, (sentence, words) in enumerate(zip(sentences, sent_words)):
            # Compute TF-IDF for this sentence
            word_counts = collections.Counter(words)
            tf_idf_score = 0.0
            for w, count in word_counts.items():
                tf = count / (len(words) + 1)
                tf_idf_score += tf * idf.get(w, 0)
            
            # Positional weights
            if i < total_sents * 0.2:
                tf_idf_score *= 1.5
            elif i > total_sents * 0.9:
                tf_idf_score *= 1.2
            
            # Length scoring
            if len(words) < 5:
                tf_idf_score *= 0.5
            elif 10 <= len(words) <= 25:
                tf_idf_score *= 1.2
            
            scores.append((tf_idf_score, i, sentence))
        
        # Sort by score descending, take top k
        scores.sort(reverse=True, key=lambda x: x[0])
        top_k = scores[:k]
        
        # Sort by original index
        top_k.sort(key=lambda x: x[1])
        
        return [s[2] for s in top_k]
