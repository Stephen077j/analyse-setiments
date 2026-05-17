import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from "recharts"

function Stats({ reviews }) {
  const total = reviews.length
  const positive = reviews.filter(r => r.sentiment === "positif").length
  const negative = reviews.filter(r => r.sentiment === "négatif").length
  const neutral = reviews.filter(r => r.sentiment === "neutre").length

  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0

  // Données pour le pie chart
  const sentimentData = [
    { name: "Positifs", value: positive, fill: "#10b981" },
    { name: "Négatifs", value: negative, fill: "#ef4444" },
    { name: "Neutres", value: neutral, fill: "#6b7280" },
  ]

  // Données pour le bar chart
  const barData = [
    { name: "Positifs", count: positive, percentage: pct(positive), fill: "#10b981" },
    { name: "Négatifs", count: negative, percentage: pct(negative), fill: "#ef4444" },
    { name: "Neutres", count: neutral, percentage: pct(neutral), fill: "#6b7280" },
  ]

  const stats = [
    { emoji: "😊", label: "Positifs", count: positive, color: "stat-positive" },
    { emoji: "😠", label: "Négatifs", count: negative, color: "stat-negative" },
    { emoji: "😐", label: "Neutres", count: neutral, color: "stat-neutral" },
  ]

  return (
    <div className="stats-container">
      <div className="card">
        <h2 className="card-title">
          <span>📊</span> Vue d'ensemble
          <span className="card-badge">{total} avis</span>
        </h2>

        {total === 0 ? (
          <div className="empty-state">
            <p>Aucun avis pour le moment. Commencez à en ajouter!</p>
          </div>
        ) : (
          <div className="charts-grid">
            {/* Indicateurs rapides */}
            <div className="quick-stats">
              {stats.map((stat) => (
                <div key={stat.label} className={`quick-stat ${stat.color}`}>
                  <div className="quick-stat-emoji">{stat.emoji}</div>
                  <div className="quick-stat-info">
                    <div className="quick-stat-label">{stat.label}</div>
                    <div className="quick-stat-value">{stat.count}</div>
                    <div className="quick-stat-pct">{pct(stat.count)}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie Chart */}
            <div className="chart-box">
              <h3>Distribution des sentiments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} avis`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-box">
              <h3>Comparaison des sentiments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Statistiques détaillées */}
            <div className="detailed-stats">
              <h3>Statistiques détaillées</h3>
              <div className="stat-details-grid">
                {barData.map((item) => (
                  <div key={item.name} className="stat-detail-item">
                    <div className="stat-detail-bar-container">
                      <div
                        className="stat-detail-bar"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.fill
                        }}
                      />
                    </div>
                    <div className="stat-detail-label">{item.name}</div>
                    <div className="stat-detail-value">
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats
