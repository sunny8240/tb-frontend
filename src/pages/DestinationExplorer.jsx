import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { LocationIcon } from "../component/Icons";

export default function DestinationExplorer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  const categories = [
    { value: "Heritage", label: "Heritage" },
    { value: "Nature", label: "Nature" },
    { value: "Religious", label: "Religious" },
    { value: "Adventure", label: "Adventure" },
    { value: "Beach", label: "Beach" },
    { value: "Hill Station", label: "Hill Station" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [destRes, stateRes] = await Promise.all([
          apiClient.destinations.getAll({ limit: 100 }),
          apiClient.states.getAll()
        ]);
        setDestinations(destRes.data);
        setStates(stateRes.data);
        setFilteredDestinations(destRes.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  // Filter destinations based on search and filters
  useEffect(() => {
    let filtered = destinations;

    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(dest => dest.state === selectedState || dest.state?._id === selectedState);
    }

    if (selectedCategory) {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  }, [searchQuery, selectedState, selectedCategory, destinations]);

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>
      {/* Header */}
      <section style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "60px 40px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "3rem",
          marginBottom: "16px"
        }}>
          Explore Destinations
        </h1>
        <p style={{
          fontSize: "1.1rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          Discover amazing tourist places across India. Search, filter, and find your next adventure!
        </p>
      </section>

      {/* Search Section */}
      <section style={{
        padding: "40px",
        maxWidth: "1300px",
        margin: "0 auto"
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Search by destination name, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "1rem",
              border: "2px solid var(--accent)",
              borderRadius: "8px",
              fontFamily: "var(--body)",
              transition: "var(--transition)"
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(155, 74, 26, 0.1)"}
            onBlur={(e) => e.target.style.boxShadow = "none"}
          />
        </div>

        {/* Filter Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          {/* Category Filter */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "10px",
              color: "var(--dark)"
            }}>
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid var(--accent)",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "1rem",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "10px",
              color: "var(--dark)"
            }}>
              Filter by State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid var(--accent)",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "1rem",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("");
                setSelectedCategory("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--muted)",
                color: "var(--paper)",
                border: "none",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "var(--transition)"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--dark)"}
              onMouseOut={(e) => e.target.style.background = "var(--muted)"}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{
          marginBottom: "30px",
          padding: "16px",
          background: "rgba(155, 74, 26, 0.1)",
          borderRadius: "8px",
          color: "var(--dark)",
          fontWeight: "600"
        }}>
          Found {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading destinations...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            <iframe
              src="https://lottie.host/embed/f9ebd175-d47d-4f53-bcb5-9cc100bdfe13/a6aMlzIDaZ.lottie"
              title="No data animation"
              style={{ border: 'none', width: '100%', maxWidth: '480px', height: '360px', margin: '0 auto' }}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Destinations Grid */}
        {!loading && !error && filteredDestinations.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {filteredDestinations.map(destination => (
              <div
                key={destination._id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/destination/${destination.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/destination/${destination.slug}`);
                  }
                }}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "var(--transition)",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(155, 74, 26, 0.25)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}>
                  {/* Image */}
                  <div style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0"
                  }}>
                    <img 
                      src={destination.images?.[0] || '/assets/fallback.jpg'}
                      alt={destination.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "var(--transition)"
                      }}
                      onError={(e) => { e.target.src = '/assets/fallback.jpg'; }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <h3 style={{
                        fontFamily: "var(--heading)",
                        fontSize: "1.3rem",
                        color: "var(--dark)",
                        margin: "0 0 8px 0"
                      }}>
                        {destination.name}
                      </h3>
                      <p style={{
                        fontSize: "0.9rem",
                        color: "var(--muted)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <LocationIcon size={16} color="var(--accent)" />
                        {destination.state?.name || destination.city}
                      </p>
                    </div>

                    <p style={{
                      fontSize: "0.95rem",
                      color: "var(--muted)",
                      lineHeight: "1.6",
                      flex: 1,
                      margin: "12px 0"
                    }}>
                      {destination.description?.substring(0, 100)}...
                    </p>

                    {/* Category Badge */}
                    <div style={{
                      display: "inline-block",
                      background: "rgba(155, 74, 26, 0.1)",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      color: "var(--accent)",
                      fontWeight: "600",
                      marginTop: "12px"
                    }}>
                      {destination.category}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        ) : !loading && !error && (
          <LottiePlaceholder
            title="No Destinations Found"
            message="Try adjusting your search or filters"
          />
        )}
      </section>
    </div>
  );
}
