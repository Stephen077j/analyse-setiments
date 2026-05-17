import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

function Register() {
  const navigate  = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await API.post("/api/register", { username, password })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">◎</div>
        <h2>Inscription</h2>
        <p className="auth-sub">Créez votre compte</p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Compte créé ! Redirection…</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="field">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="votre_nom (min. 3 car.)"
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
              placeholder="••••••••  (min. 6 car.)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || success}>
            {loading ? <span className="btn-spinner" /> : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
