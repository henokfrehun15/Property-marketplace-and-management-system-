import { useEffect, useState } from "react";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

import "./Properties.css";

const DEFAULT_FILTERS = {
  search: "",
  propertyType: "",
  listingType: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  sort: "newest"
};

function Properties() {
  // Properties returned by the backend
  const [properties, setProperties] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // What the user is currently typing/selecting
  const [filters, setFilters] = useState(
    DEFAULT_FILTERS
  );

  // Filters that have actually been applied
  const [appliedFilters, setAppliedFilters] =
    useState(DEFAULT_FILTERS);

  // Current page
  const [page, setPage] = useState(1);

  // Pagination information from backend
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1
  });

  /*
   * Fetch properties whenever the page
   * or applied filters change.
   */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        Object.entries(appliedFilters).forEach(
          ([key, value]) => {
            if (value) {
              params.append(key, value);
            }
          }
        );

        params.append("page", page);
        params.append("limit", 12);

        const response = await api.get(
          `/properties?${params.toString()}`
        );

        setProperties(
          response.data.properties || []
        );

        setPagination({
          total: response.data.total || 0,
          totalPages:
            response.data.totalPages || 0,
          page: response.data.page || 1
        });

      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load properties."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [appliedFilters, page]);

  /*
   * Update the filter form.
   */
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  /*
   * Apply filters when Search is clicked.
   */
  const handleSearch = (e) => {
    e.preventDefault();

    // Go back to page 1
    setPage(1);

    // Apply current filters
    setAppliedFilters({
      ...filters
    });
  };

  /*
   * Clear all filters.
   */
  const clearFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS
    });

    setPage(1);

    setAppliedFilters({
      ...DEFAULT_FILTERS
    });
  };

  return (
    <main className="properties-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="properties-header">

        <div>

          <span className="eyebrow">
            PROPERTY MARKETPLACE
          </span>

          <h1>
            Find your perfect property
          </h1>

          <p>
            Browse homes, apartments and
            properties available in your area.
          </p>

        </div>

      </section>


      {/* =========================
          FILTERS
      ========================== */}

      <section className="filters-card">

        <form onSubmit={handleSearch}>

          {/* SEARCH */}

          <div className="search-row">

            <div className="filter-group search-group">

              <label>
                Search
              </label>

              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search properties..."
              />

            </div>

            <button
              type="submit"
              className="search-button"
            >
              Search
            </button>

          </div>


          {/* FILTER GRID */}

          <div className="filters-grid">

            {/* CITY */}

            <div className="filter-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="e.g. Addis Ababa"
              />

            </div>


            {/* PROPERTY TYPE */}

            <div className="filter-group">

                <label>
                  Property Type
                </label>

                <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
              >

                <option value="">
                  All types
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


            {/* LISTING TYPE */}

            <div className="filter-group">

              <label>
                Listing
              </label>

              <select
                name="listingType"
                value={filters.listingType}
                onChange={handleChange}
              >

                <option value="">
                  Sale & Rent
                </option>

                <option value="sale">
                  For Sale
                </option>

                <option value="rent">
                  For Rent
                </option>

              </select>

            </div>


            {/* BEDROOMS */}

            <div className="filter-group">

              <label>
                Bedrooms
              </label>

              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
              >

                <option value="">
                  Any
                </option>

                <option value="1">
                  1+ Bedrooms
                </option>

                <option value="2">
                  2+ Bedrooms
                </option>

                <option value="3">
                  3+ Bedrooms
                </option>

                <option value="4">
                  4+ Bedrooms
                </option>

                <option value="5">
                  5+ Bedrooms
                </option>

              </select>

            </div>


            {/* MIN PRICE */}

            <div className="filter-group">

              <label>
                Min Price
              </label>

              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Minimum"
                min="0"
              />

            </div>


            {/* MAX PRICE */}

            <div className="filter-group">

              <label>
                Max Price
              </label>

              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Maximum"
                min="0"
              />

            </div>


            {/* SORT */}

            <div className="filter-group">

              <label>
                Sort
              </label>

              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
              >

                <option value="newest">
                  Newest
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

              </select>

            </div>


            {/* CLEAR */}

            <div className="filter-group filter-clear">

              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          </div>

        </form>

      </section>


      {/* =========================
          RESULTS HEADER
      ========================== */}

      <section className="properties-results">

        <div className="results-header">

          <div>

            <h2>
              Properties
            </h2>

            <p>
              {pagination.total} properties found
            </p>

          </div>

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading && (

          <div className="properties-status">
            Loading properties...
          </div>

        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading && error && (

          <div className="properties-status error">
            {error}
          </div>

        )}


        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          !error &&
          properties.length === 0 && (

            <div className="properties-status">

              <h3>
                No properties found
              </h3>

              <p>
                Try changing your search
                filters.
              </p>

            </div>

          )}


        {/* =========================
            PROPERTY GRID
        ========================== */}

        {!loading &&
          !error &&
          properties.length > 0 && (

            <div className="properties-grid">

              {properties.map(
                (property) => (

                  <PropertyCard
                    key={property._id}
                    property={property}
                  />

                )
              )}

            </div>

          )}

      </section>


      {/* =========================
          PAGINATION
      ========================== */}

      {!loading &&
        !error &&
        pagination.totalPages > 1 && (

          <div className="pagination">

            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (previous) =>
                    previous - 1
                )
              }
            >
              ← Previous
            </button>


            <span>
              Page {page} of{" "}
              {pagination.totalPages}
            </span>


            <button
              type="button"
              disabled={
                page >=
                pagination.totalPages
              }
              onClick={() =>
                setPage(
                  (previous) =>
                    previous + 1
                )
              }
            >
              Next →
            </button>

          </div>

        )}

    </main>
  );
}

export default Properties;