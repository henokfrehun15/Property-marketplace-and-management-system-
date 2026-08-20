import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/favorites");

        setFavorites(response.data.favorites || []);

      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load favorites"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <main className="favorites-page">
        <div className="favorites-container">
          <p>Loading favorites...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="favorites-page">
        <div className="favorites-container">
          <p className="favorites-error">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-page">

      <div className="favorites-container">

        <div className="favorites-header">
          <div>
            <h1>My Favorites</h1>

            <p>
              Properties you've saved
            </p>
          </div>

          <span className="favorites-count">
            {favorites.length} saved
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">

            <div className="empty-heart">
              ♡
            </div>

            <h2>
              No favorites yet
            </h2>

            <p>
              Save properties you love and
              they'll appear here.
            </p>

            <Link
              to="/properties"
              className="browse-properties-button"
            >
              Browse Properties
            </Link>

          </div>
        ) : (
          <div className="properties-grid">

            {favorites.map((favorite) => (
              <PropertyCard
                key={favorite._id}
                property={favorite.property}
              />
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Favorites;