import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import "./SentInquiries.css";

function SentInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSentInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/inquiries/sent");

        setInquiries(response.data.inquiries || []);
      } catch (error) {
        console.error("Failed to load sent inquiries:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load your inquiries."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSentInquiries();
  }, []);

  if (loading) {
    return (
      <main className="sent-inquiries-page">
        <div className="sent-inquiries-status">
          Loading your inquiries...
        </div>
      </main>
    );
  }

  return (
    <main className="sent-inquiries-page">
      <div className="sent-inquiries-container">
        <div className="sent-inquiries-header">
          <div>
            <span className="sent-inquiries-label">
              MY ACCOUNT
            </span>

            <h1>My Inquiries</h1>

            <p>
              Messages you have sent to property owners.
            </p>
          </div>

          <Link
            to="/properties"
            className="sent-back-link"
          >
            ← Properties
          </Link>
        </div>

        {error && (
          <div className="sent-inquiries-error">
            {error}
          </div>
        )}

        {inquiries.length === 0 ? (
          <div className="sent-empty-state">
            <div className="sent-empty-icon">💬</div>

            <h2>No inquiries sent yet</h2>

            <p>
              Contact a property owner and your
              messages will appear here.
            </p>

            <Link
              to="/properties"
              className="sent-browse-button"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="sent-inquiries-list">
            {inquiries.map((inquiry) => (
              <article
                className="sent-inquiry-card"
                key={inquiry._id}
              >
                <div className="sent-card-header">
                  <div className="sent-owner-info">
                    <div className="sent-owner-avatar">
                      {inquiry.receiver?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "O"}
                    </div>

                    <div>
                      <span>PROPERTY OWNER</span>

                      <h2>
                        {inquiry.receiver?.name ||
                          "Property Owner"}
                      </h2>

                      <p>
                        {inquiry.receiver?.email ||
                          "No email available"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`sent-status sent-status-${inquiry.status}`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                <div className="sent-property">
                  <div className="sent-property-image">
                    {inquiry.property?.images?.length > 0 ? (
                      <img
                        src={inquiry.property.images[0].url}
                        alt={
                          inquiry.property.title ||
                          "Property"
                        }
                      />
                    ) : (
                      <div className="sent-no-image">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="sent-property-details">
                    <span>PROPERTY</span>

                    <h3>
                      {inquiry.property?.title ||
                        "Property unavailable"}
                    </h3>

                    {inquiry.property?.price !== undefined && (
                      <p>
                        {Number(
                          inquiry.property.price
                        ).toLocaleString()} ETB
                      </p>
                    )}

                    {inquiry.property?._id && (
                      <Link
                        to={`/properties/${inquiry.property._id}`}
                        className="sent-view-property"
                      >
                        View Property →
                      </Link>
                    )}
                  </div>
                </div>

                <div className="sent-message">
                  <span>YOUR MESSAGE</span>

                  <p>{inquiry.message}</p>
                </div>

                {inquiry.reply && (
                  <div className="sent-reply">
                    <span>OWNER REPLY</span>

                    <p>{inquiry.reply}</p>

                    {inquiry.repliedAt && (
                      <small>
                        Replied{" "}
                        {new Date(
                          inquiry.repliedAt
                        ).toLocaleString()}
                      </small>
                    )}
                  </div>
                )}

                <div className="sent-date">
                  Sent{" "}
                  {new Date(
                    inquiry.createdAt
                  ).toLocaleString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SentInquiries;