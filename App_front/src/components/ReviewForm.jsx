import { useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"

const SENTIMENT_CONFIG = {
  positif: { emoji: "😊", label: "Positif", className: "result-positive" },
  négatif: { emoji: "😠", label: "Négatif", className: "result-negative" },
  neutre:  { emoji: "😐", label: "Neutre",  className: "result-neutral" },
}

function ReviewForm({ refresh }) {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLoggedIn = !!localStorage.getItem("token")
  const charCount = text.trim().length

  const submitReview = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await API.post("/api/reviews", { text })
      setResult(response.data)
      setText("")
      refresh()
    } catch (err) {
      const msg = err.response?.data?.detail || "Erreur lors de l'analyse"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const cfg = result ? SENTIMENT_CONFIG[result.sentiment] : null

  return (
    <div className="card">
      <h2 className="card-title">
        <span>✍️</span> Soumettre un avis
      </h2>

      {!isLoggedIn && (
        <div className="info-banner">
          <Link to="/login">Connectez-vous</Link> pour soumettre un avis.
        </div>
      )}

      <form onSubmit={submitReview} className="review-form">
        <div className="textarea-wrapper">
          <textarea
            placeholder="Écrivez votre avis ici… (français ou anglais)"
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); setError(null) }}
            disabled={!isLoggedIn || loading}
            rows={4}
          />
          <span className={`char-count ${charCount < 3 ? "char-low" : ""}`}>
            {charCount} car.
          </span>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={!isLoggedIn || loading || charCount < 3}
        >
          {loading ? <span className="btn-spinner" /> : "Analyser le sentiment"}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {cfg && result && (
        <div className={`result ${cfg.className}`}>
          <div className="result-header">
            <span className="result-emoji">{cfg.emoji}</span>
            <div>
              <div className="result-label">Sentiment détecté</div>
              <div className="result-value">{cfg.label}</div>
            </div>
          </div>
          <div className="result-score">
            <span>Score de polarité</span>
            <span className="score-value">
              {result.score >= 0 ? "+" : ""}{result.score.toFixed(3)}
            </span>
          </div>
          <div className="score-bar-track">
            <div
              className={`score-bar-fill ${cfg.className}`}
              style={{ width: `${Math.abs(result.score) * 100}%`, marginLeft: result.score < 0 ? "auto" : 0 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewForm
