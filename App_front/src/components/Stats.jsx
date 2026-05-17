function Stats({ reviews }) {
  const total = reviews.length
  const positive = reviews.filter(r => r.sentiment === "positif").length
  const negative = reviews.filter(r => r.sentiment === "négatif").length
  const neutral  = reviews.filter(r => r.sentiment === "neutre").length

  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0

  const items = [
    { key: "positive", emoji: "😊", label: "Positifs", count: positive, className: "stat-positive" },
    { key: "negative", emoji: "😠", label: "Négatifs", count: negative, className: "stat-negative" },
    { key: "neutral",  emoji: "😐", label: "Neutres",  count: neutral,  className: "stat-neutral" },
  ]

  return (
    <div className="card">
      <h2 className="card-title">
        <span>📊</span> Statistiques
        <span className="card-badge">{total} avis</span>
      </h2>

      <div className="stats-grid">
        {items.map(({ key, emoji, label, count, className }) => (
          <div key={key} className={`stat-item ${className}`}>
            <div className="stat-emoji">{emoji}</div>
            <div className="stat-count">{count}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{ width: `${pct(count)}%` }}
              />
            </div>
            <div className="stat-pct">{pct(count)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
