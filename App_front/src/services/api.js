import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8001",  // Backend API endpoint
  timeout: 10000,
})

// Injecte le token JWT dans chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gestion globale des erreurs 401 (token expiré)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default API
