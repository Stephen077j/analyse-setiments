from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_db
from app.security import hash_password

router = APIRouter(tags=["users"])


@router.post("/api/register", status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.username == user_data.username
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce nom d'utilisateur est déjà pris",
        )

    new_user = models.User(
        username=user_data.username,
        password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "Compte créé avec succès"}
