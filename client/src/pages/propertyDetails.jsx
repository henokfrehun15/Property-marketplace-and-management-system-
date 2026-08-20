import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useFavorites } from "../context/useFavorites";

import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();

  const {
    isFavorite,
    addFavorite,
    removeFavorite
  } = useFavorites();

  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/properties/${id}`
        );

        const propertyData =
          response.data.property;

        setProperty(propertyData);

        const firstImage =
          propertyData.images?.length > 0
            ? propertyData.images[0].url
            : "https://placehold.co/1200x700?text=No+Image";

        setMainImage(firstImage);

      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load property."
        );

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

  const favorited = isFavorite(property._id);

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
    <main className="property-details">

      <Link
        to="/properties"
        className="back-link"
      >
        ← Back to properties
      </Link>

      {/* IMAGE GALLERY */}

      <section className="details-gallery">

        <div className="main-image-wrapper">

          <img
            src={mainImage}
            alt={property.title}
            className="main-property-image"
          />

        </div>

        {property.images?.length > 1 && (

          <div className="thumbnail-list">

            {property.images.map(
              (image, index) => (

                <button
                  key={
                    image.publicId || index
                  }
                  type="button"
                  className={`thumbnail-button ${
                    mainImage === image.url
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setMainImage(image.url)
                  }
                >

                  <img
                    src={image.url}
                    alt={`${property.title} ${
                      index + 1
                    }`}
                  />

                </button>

              )
            )}

          </div>

        )}

      </section>

      {/* PROPERTY INFORMATION */}

      <section className="details-layout">

        <div className="details-main">

          <div className="details-heading">

            <div>

              <span className="listing-badge">
                {property.listingType}
              </span>

              <h1>
                {property.title}
              </h1>

              <p className="details-location">
                📍{" "}
                {property.location?.city},{" "}
                {property.location?.address}
              </p>

            </div>

            <div className="details-price">
              {property.price?.toLocaleString()} ETB
            </div>

          </div>

          {/* PROPERTY STATS */}

          <div className="property-stats">

            <div>
              <strong>
                {property.bedrooms}
              </strong>

              <span>
                Bedrooms
              </span>
            </div>

            <div>
              <strong>
                {property.bathrooms}
              </strong>

              <span>
                Bathrooms
              </span>
            </div>

            <div>
              <strong>
                {property.area}
              </strong>

              <span>
                m² Area
              </span>
            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="details-section">

            <h2>
              Description
            </h2>

            <p>
              {property.description ||
                "No description provided."}
            </p>

          </div>

        </div>

        {/* CONTACT CARD */}

        <aside className="contact-card">

          <h2>
            Interested in this property?
          </h2>

          <p>
            Contact the property owner to ask
            questions or arrange a viewing.
          </p>

          <button
            className="contact-button"
            type="button"
          >
            Contact Owner
          </button>

          <button
            className={`favorite-details-button ${
              favorited
                ? "favorited"
                : ""
            }`}
            type="button"
            onClick={handleFavorite}
          >
            {favorited
              ? "♥ Remove from Favorites"
              : "♡ Add to Favorites"}
          </button>

        </aside>

      </section>

    </main>
  );
}

export default PropertyDetails;