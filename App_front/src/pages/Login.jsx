import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await API.post("/api/login", { username, password })
      localStorage.setItem("token",    response.data.access_token)
      localStorage.setItem("username", response.data.username)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Identifiants incorrects")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">◉</div>
        <h2>Connexion</h2>
        <p className="auth-sub">Accédez à votre espace</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="field">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="votre_nom"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer">
          Pas encore de compte ?{" "}
          <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
