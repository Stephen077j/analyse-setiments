from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_current_user, get_db
from app.sentiment import analyze_sentiment

router = APIRouter(tags=["reviews"])


@router.get("/api/reviews", response_model=List[schemas.ReviewOut])
def get_reviews(db: Session = Depends(get_db)):
    """Récupère tous les avis — public."""
    return db.query(models.Review).order_by(models.Review.id.desc()).all()


@router.post("/api/reviews", response_model=schemas.ReviewOut)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Crée un avis — nécessite d'être connecté."""
    sentiment, score = analyze_sentiment(review.text)

    db_review = models.Review(
        text=review.text,
        sentiment=sentiment,
        score=score,
        author=current_user.username,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@router.delete("/api/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Supprime un avis — seul l'auteur peut supprimer son avis."""
    from fastapi import HTTPException, status

    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Avis introuvable")
    if review.author != current_user.username:
        raise HTTPException(status_code=403, detail="Action non autorisée")

    db.delete(review)
    db.commit()
    return {"message": "Avis supprimé"}
