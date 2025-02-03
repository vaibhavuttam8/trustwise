from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database
from .ml_utils import ModelHandler
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Drop all tables and recreate them
models.Base.metadata.drop_all(bind=database.engine)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
model_handler = ModelHandler()

@app.get("/")
def read_root():
    return {"message": "Welcome to Text Analysis API"}

@app.post("/analyze/", response_model=schemas.TextAnalysis)
def analyze_text(
    text_analysis: schemas.TextAnalysisCreate,
    db: Session = Depends(database.get_db)
):
    # Get scores from both models
    toxicity_score = model_handler.get_toxicity_score(text_analysis.input_text)
    gibberish_score = model_handler.get_gibberish_score(text_analysis.input_text)
    
    # Create new text analysis entry
    db_analysis = models.TextAnalysis(
        input_text=text_analysis.input_text,
        toxicity_score=toxicity_score,
        gibberish_score=gibberish_score
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

@app.get("/analyses/", response_model=List[schemas.TextAnalysis])
def get_analyses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    analyses = db.query(models.TextAnalysis).offset(skip).limit(limit).all()
    return analyses 