from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TextAnalysisBase(BaseModel):
    input_text: str

class TextAnalysisCreate(TextAnalysisBase):
    pass

class TextAnalysis(TextAnalysisBase):
    id: int
    toxicity_score: float
    gibberish_score: float
    created_at: datetime

    class Config:
        from_attributes = True 