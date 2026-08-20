import { Link } from "react-router-dom";

import PropertyCard from "../components/PropertyCard";

import { useFavorites } from "../context/useFavorites";

import "./Favorites.css";

function Favorites() {
  const {
    favorites,
    loading
  } = useFavorites();

  if (loading) {
    return (
      <main className="favorites-page">

        <div className="favorites-container">

          <p>
            Loading favorites...
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

            <h1>
              My Favorites
            </h1>

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