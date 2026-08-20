import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import "./EditProperty.css";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    city: "",
    subCity: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // LOAD PROPERTY
  // ==============================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/properties/${id}`
        );

        const property = response.data.property;

        setFormData({
          title: property.title || "",
          description: property.description || "",
          propertyType: property.propertyType || "",
          listingType: property.listingType || "",
          price: property.price || "",
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          area: property.area || "",
          city: property.location?.city || "",
          subCity: property.location?.subCity || "",
          address: property.location?.address || ""
        });

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


  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const propertyData = {
        title: formData.title,
        description: formData.description,

        propertyType:
          formData.propertyType,

        listingType:
          formData.listingType,

        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),

        location: {
          city: formData.city,
          subCity: formData.subCity,
          address: formData.address
        }
      };

      await api.put(
        `/properties/${id}`,
        propertyData
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update property."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="edit-property-page">
        <div className="edit-status">
          Loading property...
        </div>
      </main>
    );
  }


  // ==============================
  // ERROR
  // ==============================

  if (error && !formData.title) {
    return (
      <main className="edit-property-page">
        <div className="edit-status edit-error">
          {error}
        </div>
      </main>
    );
  }


  return (
    <main className="edit-property-page">

      <div className="edit-property-container">

        <div className="edit-property-header">

          <span>
            OWNER DASHBOARD
          </span>

          <h1>
            Edit Property
          </h1>

          <p>
            Update your property information.
          </p>

        </div>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        <form
          className="property-form"
          onSubmit={handleSubmit}
        >

          {/* ==========================
              PROPERTY INFORMATION
          ========================== */}

          <section className="form-section">

            <h2>
              Property Information
            </h2>

            <div className="form-grid">

              <div className="form-group full-width">

                <label>
                  Property Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Property Type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select type
                  </option>

                  <option value="house">
                    House
                  </option>

                  <option value="apartment">
                    Apartment
                  </option>

                  <option value="condominium">
                    Condominium
                  </option>

                  <option value="villa">
                    Villa
                  </option>

                  <option value="land">
                    Land
                  </option>

                  <option value="commercial">
                    Commercial
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Listing Type
                </label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select listing
                  </option>

                  <option value="sale">
                    For Sale
                  </option>

                  <option value="rent">
                    For Rent
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* ==========================
              DETAILS
          ========================== */}

          <section className="form-section">

            <h2>
              Property Details
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Area (m²)
                </label>

                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Bedrooms
                </label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Bathrooms
                </label>

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>

          </section>


          {/* ==========================
              LOCATION
          ========================== */}

          <section className="form-section">

            <h2>
              Location
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Sub-city
                </label>

                <input
                  type="text"
                  name="subCity"
                  value={formData.subCity}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group full-width">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* ==========================
              ACTIONS
          ========================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default EditProperty;