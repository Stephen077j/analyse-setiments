import { useEffect, useState } from "react"
import API from "../services/api"
import Navbar from "../components/Navbar"
import ReviewForm from "../components/ReviewForm"
import ReviewList from "../components/ReviewList"
import Stats from "../components/Stats"

function Home() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await API.get("/api/reviews")
      setReviews(response.data)
    } catch {
      // silently fail — user still sees the form
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <p>Chargement…</p>
          </div>
        ) : (
          <>
            <ReviewForm refresh={fetchReviews} />
            <Stats reviews={reviews} />
            <ReviewList reviews={reviews} refresh={fetchReviews} />
          </>
        )}
      </div>
    </div>
  )
}

export default Home
