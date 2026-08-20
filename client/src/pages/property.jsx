import { useEffect, useState } from "react";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";
import "./Properties.css";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");

        setProperties(response.data.properties);
      } catch (error) {
        console.error(error);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <main className="properties-page">

      <section className="properties-header">
        <div>
          <p className="eyebrow">
            PROPERTY MARKETPLACE
          </p>

          <h1>
            Find your perfect property
          </h1>

          <p>
            Explore homes, apartments and properties
            available in your area.
          </p>
        </div>

        <span>
          {properties.length} Properties
        </span>
      </section>

      {loading && (
        <div className="status-message">
          Loading properties...
        </div>
      )}

      {error && (
        <div className="status-message error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="property-grid">
          {properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))
          )}
        </section>
      )}

    </main>
  );
}

export default Properties;