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

  // Contact Owner
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");

  // ==========================================
  // LOAD PROPERTY
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/properties/${id}`);

        const propertyData = response.data.property;

        setProperty(propertyData);

        const firstImage =
          propertyData.images?.length > 0
            ? propertyData.images[0].url
            : "https://placehold.co/1200x700?text=No+Image";

        setMainImage(firstImage);
      } catch (error) {
        console.error("Failed to load property:", error);

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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="details-status">
        Loading property...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="details-status error">
        {error}
      </div>
    );
  }

  // ==========================================
  // PROPERTY NOT FOUND
  // ==========================================

  if (!property) {
    return (
      <div className="details-status">
        Property not found.
      </div>
    );
  }

  const favorited = isFavorite(property._id);

  // ==========================================
  // FAVORITE
  // ==========================================

  const handleFavorite = async () => {
    try {
      if (favorited) {
        await removeFavorite(property._id);
      } else {
        await addFavorite(property._id);
      }
    } catch (error) {
      console.error("Favorite error:", error);

      setError(
        error.response?.data?.message ||
          "Please log in to manage favorites."
      );
    }
  };

  // ==========================================
  // OPEN CONTACT FORM
  // ==========================================

  const handleOpenContact = () => {
    setShowContactForm(true);
    setInquirySuccess("");
    setInquiryError("");
  };

  // ==========================================
  // CLOSE CONTACT FORM
  // ==========================================

  const handleCloseContact = () => {
    if (sending) return;

    setShowContactForm(false);
    setMessage("");
    setInquiryError("");
    setInquirySuccess("");
  };

  // ==========================================
  // SEND INQUIRY
  // ==========================================

  const handleSendInquiry = async (e) => {
    e.preventDefault();

    setInquiryError("");
    setInquirySuccess("");

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setInquiryError("Please enter a message.");
      return;
    }

    if (trimmedMessage.length < 5) {
      setInquiryError(
        "Your message must be at least 5 characters."
      );
      return;
    }

    try {
      setSending(true);

      await api.post("/inquiries", {
        propertyId: property._id,
        message: trimmedMessage
      });

      setInquirySuccess(
        "Your message has been sent to the property owner."
      );

      setMessage("");
    } catch (error) {
      console.error("Inquiry error:", error);

      setInquiryError(
        error.response?.data?.message ||
          "Failed to send your message."
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="property-details">

      {/* BACK LINK */}

      <Link
        to="/properties"
        className="back-link"
      >
        ← Back to properties
      </Link>

      {/* ==========================================
          IMAGE GALLERY
      ========================================== */}

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

            {property.images.map((image, index) => (

              <button
                key={image.publicId || index}
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
                  alt={`${property.title} ${index + 1}`}
                />

              </button>

            ))}

          </div>
        )}

      </section>

      {/* ==========================================
          PROPERTY INFORMATION
      ========================================== */}

      <section className="details-layout">

        <div className="details-main">

          {/* HEADING */}

          <div className="details-heading">

            <div>

              <span className="listing-badge">
                {property.listingType === "sale"
                  ? "For Sale"
                  : "For Rent"}
              </span>

              <h1>
                {property.title}
              </h1>

              <p className="details-location">
                📍{" "}
                {property.location?.city}

                {property.location?.subCity && (
                  <>
                    , {property.location.subCity}
                  </>
                )}

                {property.location?.address && (
                  <>
                    , {property.location.address}
                  </>
                )}
              </p>

            </div>

            <div className="details-price">
              {Number(property.price || 0).toLocaleString()} ETB
            </div>

          </div>

          {/* ==========================================
              PROPERTY STATS
          ========================================== */}

          <div className="property-stats">

            <div>
              <strong>
                {property.bedrooms ?? 0}
              </strong>

              <span>
                Bedrooms
              </span>
            </div>

            <div>
              <strong>
                {property.bathrooms ?? 0}
              </strong>

              <span>
                Bathrooms
              </span>
            </div>

            <div>
              <strong>
                {property.area ?? 0}
              </strong>

              <span>
                m² Area
              </span>
            </div>

          </div>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <div className="details-section">

            <h2>
              Description
            </h2>

            <p>
              {property.description ||
                "No description provided."}
            </p>

          </div>

          {/* ==========================================
              PROPERTY TYPE
          ========================================== */}

          <div className="details-section">

            <h2>
              Property Information
            </h2>

            <div className="property-information">

              <div>
                <span>
                  Property Type
                </span>

                <strong>
                  {property.propertyType}
                </strong>
              </div>

              <div>
                <span>
                  Listing Type
                </span>

                <strong>
                  {property.listingType === "sale"
                    ? "For Sale"
                    : "For Rent"}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {property.status || "available"}
                </strong>
              </div>

            </div>

          </div>

          {/* ==========================================
              AMENITIES
          ========================================== */}

          {property.amenities?.length > 0 && (

            <div className="details-section">

              <h2>
                Amenities
              </h2>

              <div className="amenities-list">

                {property.amenities.map(
                  (amenity, index) => (

                    <span
                      key={index}
                      className="amenity-item"
                    >
                      ✓ {amenity}
                    </span>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* ==========================================
            CONTACT CARD
        ========================================== */}

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
            onClick={handleOpenContact}
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

          {/* ==========================================
              OWNER INFORMATION
          ========================================== */}

          {property.owner && (

            <div className="owner-info">

              <h3>
                Property Owner
              </h3>

              <p>
                {property.owner.name ||
                  "Property Owner"}
              </p>

              {property.owner.email && (
                <p>
                  {property.owner.email}
                </p>
              )}

            </div>

          )}

        </aside>

      </section>

      {/* ==========================================
          CONTACT MODAL
      ========================================== */}

      {showContactForm && (

        <div
          className="contact-modal-overlay"
          onClick={handleCloseContact}
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="contact-modal-close"
              onClick={handleCloseContact}
              disabled={sending}
              aria-label="Close contact form"
            >
              ×
            </button>

            <h2>
              Contact Owner
            </h2>

            <p className="contact-modal-property">
              {property.title}
            </p>

            {/* ==========================================
                SUCCESS
            ========================================== */}

            {inquirySuccess ? (

              <div className="inquiry-success">

                <div className="success-icon">
                  ✓
                </div>

                <h3>
                  Message Sent
                </h3>

                <p>
                  {inquirySuccess}
                </p>

                <button
                  type="button"
                  className="contact-button"
                  onClick={handleCloseContact}
                >
                  Done
                </button>

              </div>

            ) : (

              /* ==========================================
                  CONTACT FORM
              ========================================== */

              <form
                className="contact-form"
                onSubmit={handleSendInquiry}
              >

                <label htmlFor="inquiry-message">
                  Your Message
                </label>

                <textarea
                  id="inquiry-message"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="I'm interested in this property. Is it still available?"
                  rows="6"
                  maxLength="1000"
                  disabled={sending}
                  required
                />

                <div className="message-counter">
                  {message.length}/1000
                </div>

                {inquiryError && (

                  <div className="inquiry-error">
                    {inquiryError}
                  </div>

                )}

                <div className="contact-form-actions">

                  <button
                    type="button"
                    className="cancel-contact-button"
                    onClick={handleCloseContact}
                    disabled={sending}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="send-inquiry-button"
                    disabled={sending}
                  >
                    {sending
                      ? "Sending..."
                      : "Send Message"}
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      )}

    </main>
  );
}

export default PropertyDetails;