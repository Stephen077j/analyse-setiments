from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class ReviewCreate(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Le texte ne peut pas être vide")
        if len(v.strip()) < 3:
            raise ValueError("Le texte est trop court (minimum 3 caractères)")
        return v.strip()


class ReviewOut(BaseModel):
    id: int
    text: str
    sentiment: str
    score: float
    author: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Le nom d'utilisateur doit faire au moins 3 caractères")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError("Le mot de passe doit faire au moins 6 caractères")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
