import { useEffect, useState } from "react";
import api from "../services/api";

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
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Properties</h1>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map((property) => (
          <div key={property._id}>
            <h2>{property.title}</h2>

            <p>
              {property.price} ETB
            </p>

            <p>
              {property.location?.city}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Properties;