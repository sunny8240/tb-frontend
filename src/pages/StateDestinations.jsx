import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { extractMapSrc } from "../utils/mapHelpers";
import IconSvg from '../component/IconSvg'

export default function StateDestinations() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStateAndDestinations = async () => {
      try {
        setLoading(true);
        const stateResponse = await apiClient.states.getBySlug(slug);
        const stateData = stateResponse.data || stateResponse;
        setState(stateData);

        const destResponse = await apiClient.destinations.getByState(stateData._id);
        const destArray = destResponse.data || destResponse || [];
        setDestinations(Array.isArray(destArray) ? destArray : []);
      } catch (err) {
        setError(err.message || "Failed to load state information");
      } finally {
        setLoading(false);
      }
    };

    fetchStateAndDestinations();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "20px", paddingBottom: "100px", paddingLeft: "20px" }}>
        <p>Loading state information...</p>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "20px", paddingBottom: "100px", paddingLeft: "20px" }}>
        {error ? (
          <LottiePlaceholder
            title="State Not Found"
            message={error || "The state you're looking for doesn't exist."}
          />
        ) : (
          <LottiePlaceholder
            title="State Not Found"
            message="The state you're looking for doesn't exist."
          />
        )}
        <button 
          onClick={() => navigate("/states")}
          style={{
            marginTop: "20px",
            background: "var(--accent)",
            color: "var(--paper)",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "var(--transition)"
          }}
          onMouseOver={(e) => e.target.style.background = "var(--dark)"}
          onMouseOut={(e) => e.target.style.background = "var(--accent)"}
        >
          Back to States
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>
      {/* Header */} 
      <section style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "60px 40px",
        textAlign: "center"
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            background: "rgba(255, 255, 255, 0.2)",
            color: "var(--paper)",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "var(--transition)"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
        >
          ← Back
        </button>
        
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "3rem",
          marginBottom: "16px"
        }}>
          {state.name}
        </h1>
        <p style={{
          fontSize: "1.1rem",
          opacity: 0.9
        }}>
          Discover {destinations.length} amazing destination{destinations.length !== 1 ? "s" : ""} in {state.name}
        </p>
      </section>

      {/* State Overview */}
      <section className="state-overview" style={{ padding: '28px 40px', maxWidth: '1100px', margin: '20px auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: 'var(--heading)', marginTop: 0 }}>{state.name}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{state.description}</p>
          {extractMapSrc(state.mapLink) && (
            <div style={{ marginTop: 16 }}>
              <div className="responsive-iframe">
                <iframe title="state-map" src={extractMapSrc(state.mapLink)} loading="lazy" />
              </div>
            </div>
          )}
          {state.attractions && state.attractions.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Top attractions:</strong>
              <ul style={{ margin: '8px 0 0 16px' }}>
                {state.attractions.slice(0, 5).map((a, i) => <li key={i} style={{ color: 'var(--muted)' }}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="state-vcard" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {state.images && state.images.slice(0, 2).map((img, i) => (
            <div key={i} style={{ height: 160, borderRadius: 12, overflow: 'hidden', background: '#f0f0f0' }}>
              <img 
                src={img} 
                alt={`${state.name} ${i}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => e.target.src = '/assets/fallback.jpg'} 
              />
            </div>
          ))}
          <div style={{ background: 'rgba(155,74,26,0.05)', padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 700 }}>Type:</div>
            <div style={{ color: 'var(--muted)' }}>{state.type}</div>
            {state.capital && (
              <>
                <div style={{ marginTop: 8, fontWeight: 700 }}>Capital:</div>
                <div style={{ color: 'var(--muted)' }}>{state.capital}</div>
              </>
            )}
            {state.area_km2 && (
              <>
                <div style={{ marginTop: 8, fontWeight: 700 }}>Area:</div>
                <div style={{ color: 'var(--muted)' }}>{state.area_km2.toLocaleString()} km²</div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{
        padding: "60px 40px",
        maxWidth: "1300px",
        margin: "0 auto"
      }}>
        {destinations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {destinations.map(destination => (
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
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '420px',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 24px 48px rgba(155, 74, 26, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{
                  position: 'relative',
                  height: '240px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)'
                }}>
                  {destination.images && destination.images.length > 0 ? (
                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onError={(e) => { e.target.src = '/assets/fallback.jpg'; }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.12) rotate(0.5deg)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0)'}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      <IconSvg name="pin" size={40} />
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                    pointerEvents: 'none'
                  }}></div>
                </div>

                <div style={{
                  padding: '24px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--heading)',
                      fontSize: '1.5rem',
                      color: 'var(--dark)',
                      margin: '0',
                      fontWeight: '700',
                      letterSpacing: '-0.5px'
                    }}>{destination.name}</h3>

                    <p style={{
                      fontSize: '0.95rem',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      margin: '12px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '48px'
                    }}>{destination.description || 'Explore this place'}</p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, var(--accent) 0%, rgba(155, 74, 26, 0.85) 100%)',
                      color: 'white',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: 'fit-content',
                      boxShadow: '0 4px 12px rgba(155, 74, 26, 0.25)'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.gap = '12px';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 74, 26, 0.35)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.gap = '8px';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(155, 74, 26, 0.25)';
                    }}>
                      <span>Discover</span>
                      <span style={{ fontSize: '1rem', fontWeight: '700' }}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)"
          }}>
            <h2 style={{
              fontFamily: "var(--heading)",
              fontSize: "1.8rem",
              marginBottom: "12px"
            }}>
              No destinations yet
            </h2>
            <p>No tourist places have been added yet for {state.name}.</p>
            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => navigate('/states')}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--dark)'}
                onMouseOut={(e) => e.target.style.background = 'var(--accent)'}
              >
                Back to States
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
