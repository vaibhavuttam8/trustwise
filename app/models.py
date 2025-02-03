from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class TextAnalysis(Base):
    __tablename__ = "text_analyses"

    id = Column(Integer, primary_key=True, index=True)
    input_text = Column(String(1000), nullable=False)
    toxicity_score = Column(Float)
    gibberish_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 