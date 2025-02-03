import torch
from transformers import (
    RobertaTokenizer, 
    RobertaForSequenceClassification,
    AutoModelForSequenceClassification, 
    AutoTokenizer
)

class ModelHandler:
    def __init__(self):
        # Initialize Toxicity model
        self.toxicity_tokenizer = RobertaTokenizer.from_pretrained('s-nlp/roberta_toxicity_classifier')
        self.toxicity_model = RobertaForSequenceClassification.from_pretrained('s-nlp/roberta_toxicity_classifier')
        
        # Initialize Gibberish model
        self.gibberish_tokenizer = AutoTokenizer.from_pretrained("wajidlinux99/gibberish-text-detector")
        self.gibberish_model = AutoModelForSequenceClassification.from_pretrained("wajidlinux99/gibberish-text-detector")
        
    def get_toxicity_score(self, text: str) -> float:
        inputs = self.toxicity_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.toxicity_model(**inputs)
        
        # Get probabilities using softmax
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
        # Return toxic probability (index 1)
        return float(probabilities[0][1].item())
    
    def get_gibberish_score(self, text: str) -> float:
        inputs = self.gibberish_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.gibberish_model(**inputs)
        
        # Get probabilities using softmax
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
        # Return clean text probability (index 1)
        return float(probabilities[0][1].item()) 