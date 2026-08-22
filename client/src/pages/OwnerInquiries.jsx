import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

import "./OwnerInquiries.css";

function OwnerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  // ==========================================
  // LOAD RECEIVED INQUIRIES
  // ==========================================

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/inquiries/received");
        console.log("Received inquiry response:", response.data);

        setInquiries(response.data.inquiries || []);
      } catch (error) {
        console.error("Failed to load inquiries:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load inquiries."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (inquiryId, status) => {
    try {
      setUpdatingId(inquiryId);
      setError("");

      const response = await api.patch(
        `/inquiries/${inquiryId}/status`,
        {
          status
        }
      );

      const updatedInquiry = response.data.inquiry;

      setInquiries((previous) =>
        previous.map((inquiry) =>
          inquiry._id === inquiryId
            ? {
                ...inquiry,
                status: updatedInquiry.status
              }
            : inquiry
        )
      );
    } catch (error) {


      setError(
        error.response?.data?.message ||
          "Failed to update inquiry."
      );
    } finally {
      setUpdatingId(null);
    }
  };
  const sendReply = async (inquiryId) => {
  const reply = replyDrafts[inquiryId]?.trim();

  if (!reply || reply.length < 5) {
    setError("Your reply must be at least 5 characters.");
    return;
  }

  try {
    setUpdatingId(inquiryId);
    setError("");

    const response = await api.patch(
      `/inquiries/${inquiryId}/reply`,
      { reply }
    );

    setInquiries((previous) =>
      previous.map((inquiry) =>
        inquiry._id === inquiryId
          ? { ...inquiry, ...response.data.inquiry }
          : inquiry
      )
    );

    setReplyDrafts((previous) => ({
      ...previous,
      [inquiryId]: ""
    }));
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Failed to send reply."
    );
  } finally {
    setUpdatingId(null);
  }
};
  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="owner-inquiries-page">
        <div className="inquiries-status">
          Loading inquiries...
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="owner-inquiries-page">
      <div className="owner-inquiries-container">

        {/* HEADER */}

        <div className="inquiries-header">
          <div>
            <span className="inquiries-label">
              OWNER DASHBOARD
            </span>

            <h1>Inquiries</h1>

            <p>
              Messages from people interested in
              your properties.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="back-dashboard-link"
          >
            ← Dashboard
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div className="inquiries-error">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {inquiries.length === 0 ? (
          <div className="empty-inquiries">
            <div className="empty-icon">
              💬
            </div>

            <h2>No inquiries yet</h2>

            <p>
              When someone contacts you about one
              of your properties, their message will
              appear here.
            </p>
          </div>
        ) : (
          <div className="inquiries-list">

            {inquiries.map((inquiry) => (
              <article
                className="inquiry-card"
                key={inquiry._id}
              >

                {/* CARD HEADER */}

                <div className="inquiry-card-header">

                  <div className="sender-info">
                    <div className="sender-avatar">
                      {inquiry.sender?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <h2>
                        {inquiry.sender?.name ||
                          "Unknown user"}
                      </h2>

                      <p>
                        {inquiry.sender?.email ||
                          "No email"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inquiry-status status-${inquiry.status}`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                {/* PROPERTY */}

                <div className="inquiry-property">

                  <div className="property-image">
                    {inquiry.property?.images?.length >
                    0 ? (
                      <img
                        src={
                          inquiry.property.images[0].url
                        }
                        alt={
                          inquiry.property.title ||
                          "Property"
                        }
                      />
                    ) : (
                      <div className="no-property-image">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="property-summary">

                    <span>
                      PROPERTY
                    </span>

                    <h3>
                      {inquiry.property?.title ||
                        "Property unavailable"}
                    </h3>

                    {inquiry.property?.price !==
                      undefined && (
                      <p>
                        {Number(
                          inquiry.property.price
                        ).toLocaleString()}{" "}
                        ETB
                      </p>
                    )}

                    {inquiry.property?._id && (
                      <Link
                        to={`/properties/${inquiry.property._id}`}
                        className="view-property-link"
                      >
                        View Property →
                      </Link>
                    )}

                  </div>
                </div>

                {/* MESSAGE */}

                <div className="inquiry-message">

                  <span>
                    MESSAGE
                  </span>

                  <p>
                    {inquiry.message}
                  </p>

                </div>

                {/* DATE */}

                <div className="inquiry-date">
                  Sent{" "}
                  {new Date(
                    inquiry.createdAt
                  ).toLocaleString()}
                </div>

                {/* ACTIONS */}

                <div className="inquiry-actions">

                 {!inquiry.reply && inquiry.status !== "closed" && (
                    <div className="reply-form">
                        <label htmlFor={`reply-${inquiry._id}`}>
                        Reply
                        </label>

                        <textarea
                        id={`reply-${inquiry._id}`}
                        value={replyDrafts[inquiry._id] || ""}
                        onChange={(event) =>
                            setReplyDrafts((previous) => ({
                            ...previous,
                            [inquiry._id]: event.target.value
                            }))
                        }
                        placeholder="Write your reply..."
                        maxLength="1000"
                        disabled={updatingId === inquiry._id}
                        />

                        <button
                        type="button"
                        className="status-button primary"
                        disabled={updatingId === inquiry._id}
                        onClick={() => sendReply(inquiry._id)}
                        >
                        {updatingId === inquiry._id
                            ? "Sending..."
                            : "Send Reply"}
                        </button>
                    </div>
                    )}

                  {inquiry.status === "read" && (
                    <button
                      type="button"
                      className="status-button primary"
                      disabled={
                        updatingId === inquiry._id
                      }
                      onClick={() =>
                        updateStatus(
                          inquiry._id,
                          "replied"
                        )
                      }
                    >
                      {updatingId === inquiry._id
                        ? "Updating..."
                        : "Mark as Replied"}
                    </button>
                  )}

                  {inquiry.status !== "closed" && (
                    <button
                      type="button"
                      className="close-inquiry-button"
                      disabled={
                        updatingId === inquiry._id
                      }
                      onClick={() =>
                        updateStatus(
                          inquiry._id,
                          "closed"
                        )
                      }
                    >
                      Close
                    </button>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default OwnerInquiries;
