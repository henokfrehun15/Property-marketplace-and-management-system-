import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);

        setProperty(response.data.property);
      } catch (error) {
        console.error(error);
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="details-status">
        Loading property...
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-status error">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="details-status">
        Property not found.
      </div>
    );
  }

  const mainImage =
    property.images?.length > 0
      ? property.images[0].url
      : "https://placehold.co/1200x700?text=No+Image";

  return (
    <main className="property-details">

      <Link to="/properties" className="back-link">
        ← Back to properties
      </Link>

      <section className="details-gallery">
        <img
          src={mainImage}
          alt={property.title}
        />

        <div className="thumbnail-list">
          {property.images?.map((image, index) => (
            <img
              key={image.publicId || index}
              src={image.url}
              alt={`${property.title} ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="details-layout">

        <div className="details-main">

          <div className="details-heading">
            <div>
              <span className="listing-badge">
                {property.listingType}
              </span>

              <h1>{property.title}</h1>

              <p className="details-location">
                📍 {property.location?.city},{" "}
                {property.location?.address}
              </p>
            </div>

            <div className="details-price">
              {property.price?.toLocaleString()} ETB
            </div>
          </div>

          <div className="property-stats">
            <div>
              <strong>{property.bedrooms}</strong>
              <span>Bedrooms</span>
            </div>

            <div>
              <strong>{property.bathrooms}</strong>
              <span>Bathrooms</span>
            </div>

            <div>
              <strong>{property.area}</strong>
              <span>m² Area</span>
            </div>
          </div>

          <div className="details-section">
            <h2>Description</h2>

            <p>
              {property.description}
            </p>
          </div>

        </div>

        <aside className="contact-card">

          <h2>Interested in this property?</h2>

          <p>
            Contact the property owner to ask
            questions or arrange a viewing.
          </p>

          <button className="contact-button">
            Contact Owner
          </button>

          <button className="favorite-details-button">
            ♡ Add to Favorites
          </button>

        </aside>

      </section>

    </main>
  );
}

export default PropertyDetails;