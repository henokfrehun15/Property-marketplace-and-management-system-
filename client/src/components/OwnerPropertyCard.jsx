import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

import "./OwnerPropertyCard.css";

function OwnerPropertyCard({ property, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const image =
    property.images?.length > 0
      ? property.images[0].url
      : "https://placehold.co/600x400?text=No+Image";

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/properties/${property._id}`
      );

      onDelete(property._id);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete property."
      );

    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="owner-property-card">

      <div className="owner-property-image">

        <img
          src={image}
          alt={property.title}
        />

        <span
          className={`status-badge ${property.status}`}
        >
          {property.status}
        </span>

      </div>


      <div className="owner-property-content">

        <div className="owner-property-price">
          {property.price?.toLocaleString()} ETB
        </div>

        <h3>
          {property.title}
        </h3>

        <p>
          📍 {property.location?.city},{" "}
          {property.location?.address}
        </p>


        <div className="owner-property-features">

          <span>
            🛏 {property.bedrooms}
          </span>

          <span>
            🛁 {property.bathrooms}
          </span>

          <span>
            📐 {property.area} m²
          </span>

        </div>


        <div className="owner-property-actions">

          <Link
            to={`/properties/${property._id}`}
            className="view-property-button"
          >
            View
          </Link>

          <Link
            to={`/properties/${property._id}/edit`}
            className="edit-property-button"
          >
            Edit
          </Link>

          <button
            type="button"
            className="delete-property-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default OwnerPropertyCard;