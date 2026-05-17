from textblob import TextBlob

# Mots-clés français pour améliorer la détection
# (TextBlob est optimisé pour l'anglais)
FRENCH_POSITIVE = {
    "bien", "bon", "super", "excellent", "parfait", "génial", "bravo",
    "merci", "magnifique", "incroyable", "top", "formidable", "agréable",
    "satisfait", "content", "heureux", "adore", "aime", "recommande",
    "fantastique", "remarquable", "exceptionnel", "qualité", "efficace",
}

FRENCH_NEGATIVE = {
    "mauvais", "nul", "horrible", "terrible", "catastrophe", "décevant",
    "déçu", "problème", "erreur", "bug", "lent", "cher", "inutile",
    "déteste", "honte", "scandale", "arnaque", "fuite", "cassé",
    "impossible", "difficile", "compliqué", "pire", "aucun",
}


def analyze_sentiment(text: str) -> tuple[str, float]:
    """
    Analyse le sentiment d'un texte.
    Combine TextBlob (EN) + détection lexicale française.
    """
    blob = TextBlob(text)
    polarity: float = blob.sentiment.polarity

    # Ajustement basé sur les mots français
    words = set(text.lower().split())
    fr_pos = len(words & FRENCH_POSITIVE)
    fr_neg = len(words & FRENCH_NEGATIVE)

    if fr_pos > 0 or fr_neg > 0:
        fr_score = (fr_pos - fr_neg) / (fr_pos + fr_neg)
        # Moyenne pondérée : 40% TextBlob, 60% lexique FR
        polarity = 0.4 * polarity + 0.6 * fr_score

    polarity = round(max(-1.0, min(1.0, polarity)), 4)

    if polarity > 0.05:
        sentiment = "positif"
    elif polarity < -0.05:
        sentiment = "négatif"
    else:
        sentiment = "neutre"

    return sentiment, polarity
