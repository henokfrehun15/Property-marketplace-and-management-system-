import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

// import "./AddProperty.css";

function AddProperty() {
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

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append(
        "propertyType",
        formData.propertyType
      );
      data.append(
        "listingType",
        formData.listingType
      );
      data.append("price", formData.price);
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("area", formData.area);

      data.append(
        "location",
        JSON.stringify({
          city: formData.city,
          subCity: formData.subCity,
          address: formData.address
        })
      );

      images.forEach((image) => {
        data.append("images", image);
      });

      await api.post("/properties", data);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to create property."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-property-page">

      <div className="add-property-container">

        <div className="add-property-header">

          <span>
            OWNER DASHBOARD
          </span>

          <h1>
            Add a Property
          </h1>

          <p>
            Create a new property listing
            on PropertyHub.
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

          {/* BASIC INFORMATION */}

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
                  placeholder="e.g. Modern 3 Bedroom House"
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
                  placeholder="Describe the property..."
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


          {/* PROPERTY DETAILS */}

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
                  placeholder="5000000"
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
                  placeholder="250"
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


          {/* LOCATION */}

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
                  placeholder="Addis Ababa"
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
                  placeholder="Bole"
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
                  placeholder="Bole Road, near..."
                  required
                />

              </div>

            </div>

          </section>


          {/* IMAGES */}

          <section className="form-section">

            <h2>
              Property Images
            </h2>

            <div className="image-upload">

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
              />

              <p>
                Select up to 10 images.
              </p>

              {images.length > 0 && (
                <p>
                  {images.length} image
                  {images.length > 1 ? "s" : ""}
                  selected
                </p>
              )}

            </div>

          </section>


          {/* SUBMIT */}

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
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Property"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default AddProperty;