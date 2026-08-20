import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PropertyCard.css";
import api from "../services/api";

function PropertyCard({ property }) {
  const [favorited, setFavorited] = useState(false);

  const image =
    property.images?.length > 0
      ? property.images[0].url
      : "https://placehold.co/600x400?text=No+Image";

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await api.get("/favorites");

        const favorites = response.data.favorites || [];

        const isFavorite = favorites.some((favorite) => {
          const favoriteProperty =
            favorite.property?._id || favorite.property;

          return favoriteProperty === property._id;
        });

        setFavorited(isFavorite);
      } catch (error) {
        console.error(
          "Failed to check favorite:",
          error
        );
      }
    };

    checkFavorite();
  }, [property._id]);

  const handleFavorite = async () => {
    try {
      if (!favorited) {
        await api.post(`/favorites/${property._id}`);

        setFavorited(true);
      } else {
        await api.delete(`/favorites/${property._id}`);

        setFavorited(false);
      }
    } catch (error) {
      console.error(
        "Favorite error:",
        error
      );
    }
  };

  return (
    <article className="property-card">

      <div className="property-image-container">

        <img
          src={image}
          alt={property.title}
          className="property-image"
        />

        <button
          className={`favorite-button ${
            favorited ? "favorited" : ""
          }`}
          onClick={handleFavorite}
          type="button"
        >
          {favorited ? "♥" : "♡"}
        </button>

        <span className="property-type">
          {property.listingType}
        </span>

      </div>

      <div className="property-content">

        <div className="property-price">
          {property.price?.toLocaleString()} ETB
        </div>

        <h2 className="property-title">
          {property.title}
        </h2>

        <p className="property-location">
          📍 {property.location?.city},{" "}
          {property.location?.address}
        </p>

        <div className="property-features">
          <span>
            🛏 {property.bedrooms} Beds
          </span>

          <span>
            🛁 {property.bathrooms} Baths
          </span>

          <span>
            📐 {property.area} m²
          </span>
        </div>

        <Link
          to={`/properties/${property._id}`}
          className="details-button"
        >
          View Property
        </Link>

      </div>

    </article>
  );
}

export default PropertyCard;