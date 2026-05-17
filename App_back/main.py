from app.database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import reviews, users, auth

# Crée les tables en BDD au démarrage
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Analyse de Sentiment", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router)
app.include_router(users.router)
app.include_router(auth.router)


@app.get("/")
def home():
    return {"message": "API Analyse de Sentiment — v1.0"}
