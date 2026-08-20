import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import OwnerPropertyCard from "../components/OwnerPropertyCard";

import "./OwnerDashboard.css";

function OwnerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/properties/my-properties"
        );

        setProperties(
          response.data.properties || []
        );

      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load your properties."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

  if (loading) {
    return (
      <main className="owner-dashboard">
        <div className="dashboard-status">
          Loading your properties...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="owner-dashboard">
        <div className="dashboard-status dashboard-error">
          {error}
        </div>
      </main>
    );
  }
const handleDelete = (propertyId) => {
  setProperties((currentProperties) =>
    currentProperties.filter(
      (property) => property._id !== propertyId
    )
  );
};  

  return (
    <main className="owner-dashboard">

      {/* HEADER */}

      <section className="dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            OWNER DASHBOARD
          </span>

          <h1>
            My Properties
          </h1>

          <p>
            Manage the properties you have
            listed on PropertyHub.
          </p>
        </div>

        <Link
          to="/properties/create"
          className="add-property-button"
        >
          + Add Property
        </Link>

      </section>


      {/* STATISTICS */}

      <section className="dashboard-stats">

        <div className="stat-card">

          <span className="stat-label">
            Total Properties
          </span>

          <strong>
            {properties.length}
          </strong>

        </div>

        <div className="stat-card">

          <span className="stat-label">
            Available
          </span>

          <strong>
            {
              properties.filter(
                (property) =>
                  property.status === "available"
              ).length
            }
          </strong>

        </div>

        <div className="stat-card">

          <span className="stat-label">
            Sold / Rented
          </span>

          <strong>
            {
              properties.filter(
                (property) =>
                  property.status !== "available"
              ).length
            }
          </strong>

        </div>

      </section>


      {/* PROPERTIES */}

      <section className="dashboard-properties">

        <div className="dashboard-section-header">

          <div>
            <h2>
              Your Listings
            </h2>

            <p>
              Manage your current properties.
            </p>
          </div>

        </div>


        {properties.length === 0 ? (

          <div className="empty-dashboard">

            <div className="empty-icon">
              🏠
            </div>

            <h2>
              No properties yet
            </h2>

            <p>
              You haven't listed any properties.
            </p>

            <Link
              to="/properties/create"
              className="add-property-button"
            >
              Add Your First Property
            </Link>

          </div>

        ) : (

          <div className="properties-grid">

            {properties.map(
              (property) => (

                <OwnerPropertyCard
                  key={property._id}
                  property={property}
                  onDelete={handleDelete}
                />

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default OwnerDashboard;