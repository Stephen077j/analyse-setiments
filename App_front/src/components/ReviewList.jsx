import { useState } from "react"
import API from "../services/api"

const SENTIMENT_CONFIG = {
  positif: { emoji: "😊", className: "badge-positive" },
  négatif: { emoji: "😠", className: "badge-negative" },
  neutre:  { emoji: "😐", className: "badge-neutral" },
}

function ReviewList({ reviews, refresh }) {
  const currentUser = localStorage.getItem("username")
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet avis ?")) return
    setDeletingId(id)
    try {
      await API.delete(`/api/reviews/${id}`)
      refresh()
    } catch {
      alert("Erreur lors de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <span>💬</span> Liste des avis
        <span className="card-badge">{reviews.length}</span>
      </h2>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗒️</div>
          <p>Aucun avis pour l'instant.</p>
          <p className="empty-sub">Soyez le premier à soumettre un avis !</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => {
            const cfg = SENTIMENT_CONFIG[review.sentiment] || SENTIMENT_CONFIG.neutre
            return (
              <div key={review.id} className={`review-item review-${review.sentiment}`}>
                <div className="review-body">
                  <p className="review-text">{review.text}</p>
                  <div className="review-meta">
                    <span className={`badge ${cfg.className}`}>
                      {cfg.emoji} {review.sentiment}
                    </span>
                    {review.author && (
                      <span className="review-author">par {review.author}</span>
                    )}
                    <span className="review-score">
                      score : {review.score >= 0 ? "+" : ""}{review.score?.toFixed(3)}
                    </span>
                  </div>
                </div>
                {currentUser && review.author === currentUser && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    title="Supprimer"
                  >
                    {deletingId === review.id ? "…" : "✕"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ReviewList
