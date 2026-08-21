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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // ==========================================
  // LOAD PROPERTY
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/properties/${id}`);

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

        setExistingImages(property.images || []);
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

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ==========================================
  // ADD NEW IMAGES
  // ==========================================

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length +
      files.length;

    if (totalImages > 10) {
      setError("You can have a maximum of 10 images.");
      e.target.value = "";
      return;
    }

    setError("");

    setNewImages((previous) => [
      ...previous,
      ...files
    ]);

    e.target.value = "";
  };

  // ==========================================
  // REMOVE EXISTING IMAGE
  // ==========================================

  const removeExistingImage = (image) => {
    setExistingImages((previous) =>
      previous.filter(
        (item) => item.publicId !== image.publicId
      )
    );

    setRemovedImages((previous) => [
      ...previous,
      image
    ]);
  };

  // ==========================================
  // REMOVE NEW IMAGE
  // ==========================================

  const removeNewImage = (index) => {
    setNewImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = new FormData();

      // ========================================
      // PROPERTY INFORMATION
      // ========================================

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("propertyType", formData.propertyType);
      data.append("listingType", formData.listingType);

      // ========================================
      // NUMERIC VALUES
      // ========================================

      data.append("price", formData.price);
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("area", formData.area);

      // ========================================
      // LOCATION
      // ========================================

      data.append(
        "location",
        JSON.stringify({
          city: formData.city,
          subCity: formData.subCity,
          address: formData.address
        })
      );

      // ========================================
      // REMOVED IMAGES
      // ========================================

      data.append(
        "removedImages",
        JSON.stringify(removedImages)
      );

      // ========================================
      // NEW IMAGES
      // ========================================

      newImages.forEach((image) => {
        data.append("images", image);
      });

      // ========================================
      // UPDATE REQUEST
      // ========================================

      await api.put(
        `/properties/${id}`,
        data
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="edit-property-page">
        <div className="edit-status">
          Loading property...
        </div>
      </main>
    );
  }

  // ==========================================
  // INITIAL ERROR
  // ==========================================

  if (error && !formData.title) {
    return (
      <main className="edit-property-page">
        <div className="edit-status edit-error">
          {error}
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="edit-property-page">

      <div className="edit-property-container">

        {/* HEADER */}

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

        {/* ERROR */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          className="property-form"
          onSubmit={handleSubmit}
        >

          {/* =====================================
              PROPERTY INFORMATION
          ====================================== */}

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

          {/* =====================================
              PROPERTY DETAILS
          ====================================== */}

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

          {/* =====================================
              LOCATION
          ====================================== */}

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

          {/* =====================================
              EXISTING IMAGES
          ====================================== */}

          <section className="form-section">

            <h2>
              Existing Images
            </h2>

            {existingImages.length === 0 ? (

              <p className="no-images">
                No existing images.
              </p>

            ) : (

              <div className="edit-images-grid">

                {existingImages.map((image) => (

                  <div
                    className="edit-image-item"
                    key={image.publicId}
                  >

                    <img
                      src={image.url}
                      alt="Property"
                    />

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() =>
                        removeExistingImage(image)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =====================================
              ADD NEW IMAGES
          ====================================== */}

          <section className="form-section">

            <h2>
              Add New Images
            </h2>

            <div className="image-upload">

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImages}
              />

              <p>
                You can have a maximum of 10 images.
              </p>

              <p>
                Current images:{" "}
                {existingImages.length +
                  newImages.length}
                /10
              </p>

            </div>

            {newImages.length > 0 && (

              <div className="edit-images-grid">

                {newImages.map((image, index) => (

                  <div
                    className="edit-image-item"
                    key={`${image.name}-${index}`}
                  >

                    <img
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                    />

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =====================================
              ACTIONS
          ====================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/dashboard")
              }
              disabled={saving}
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