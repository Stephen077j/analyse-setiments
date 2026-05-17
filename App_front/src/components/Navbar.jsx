import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const token = localStorage.getItem("token")
  const username = localStorage.getItem("username")
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-icon">◉</span>
        Analyse des Sentiments
      </Link>

      <div className="navbar-actions">
        {token ? (
          <>
            <span className="navbar-user">
              <span className="navbar-user-dot" />
              {username}
            </span>
            <button className="btn-logout" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Connexion
            </Link>
            <Link to="/register" className="btn-register">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
