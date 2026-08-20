import { Link } from "react-router-dom";

import "./PropertyCard.css";

import { useFavorites } from "../context/useFavorites";

function PropertyCard({ property }) {
  const {
    isFavorite,
    addFavorite,
    removeFavorite
  } = useFavorites();

  const favorited = isFavorite(property._id);

  const image =
    property.images?.length > 0
      ? property.images[0].url
      : "https://placehold.co/600x400?text=No+Image";

  const handleFavorite = async () => {
    try {
      if (favorited) {
        await removeFavorite(property._id);
      } else {
        await addFavorite(property._id);
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