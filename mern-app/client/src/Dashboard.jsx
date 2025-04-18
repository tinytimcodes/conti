import { useState, useRef, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useAuth } from './context/AuthContext';
import logo from './assets/ContinderLogo.png';

function Dashboard() {
  const [concerts, setConcerts] = useState([]);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [style, setStyle] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentConcert = concerts[index];

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async (searchTerm = "music") => {
    try {
      setIsSearching(true);
      const page = Math.floor(Math.random() * 5); 
      const res = await axios.get(`http://localhost:5001/api/ticketmaster/search?keyword=${searchTerm}&size=200&page=${page}`);

      const events = res.data._embedded?.events || [];

      const formatted = events.map(event => ({
        id: event.id,
        artist: event.name.split(' | ')[0],
        date: event.dates?.start?.localDate || "TBA",
        venue: event._embedded?.venues?.[0]?.name || "Unknown Venue",
        image: event.images?.find(img => img.width >= 600)?.url || "",
        eventData: event // Full event data
      }));
      
      const uniqueByArtist = Array.from(
        new Map(formatted.map(event => [event.artist, event])).values()
      );
      setConcerts(uniqueByArtist);
      setIndex(0);
      setIsSearching(false);
      
    } catch (error) {
      console.error("Error loading concert data:", error.message);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchConcerts(searchQuery.trim());
    }
  };

  const addToMyTickets = async (concert) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5001/api/users/${user._id}/tickets`, {
        ticketData: {
          event: concert.eventData,
          ticketmasterId: concert.id,
          type: "General Admission",
          price: {
            amount: concert.eventData.priceRanges?.[0]?.min || 50.00,
            currency: "USD"
          },
          seat: {
            section: "GA",
            generalAdmission: true
          },
          status: "available"
        }
      });

      if (response.data) {
        alert("Ticket added to My Tickets!");
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      alert("Failed to add ticket. Please try again.");
    }
  };

  const handleSwipe = (dir, concert) => {
    setStyle({
      transform: `translateX(${dir === 'left' ? '-1000px' : '1000px'}) rotate(${dir === 'left' ? '-30' : '30'}deg)`,
      opacity: 0,
      transition: 'transform 0.3s ease, opacity 0.3s ease'
    });
    setTimeout(() => {
      setStyle({});
      setIndex((prev) => (prev + 1) % concerts.length); 
    }, 300);
    if (dir === 'right' && concert) {
      addToMyTickets(concert);
    }
  };

  const handlePointerDown = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    startX.current = clientX;
    deltaX.current = 0;
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    deltaX.current = clientX - startX.current;
    setStyle({
      transform: `translateX(${deltaX.current}px) rotate(${deltaX.current / 12}deg)`,
      transition: 'none'
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
    if (Math.abs(deltaX.current) > 100) {
      handleSwipe(deltaX.current < 0 ? 'left' : 'right', currentConcert);
    } else {
      setStyle({
        transform: 'translateX(0px) rotate(0deg)',
        transition: 'transform 0.3s ease'
      });
      setTimeout(() => setStyle({}), 300);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo-container">
        <img className="img" src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <Link to="/sellticket" className="nav-button">Sell</Link>
          <Link to="/myticket" className="nav-button">My Tickets</Link>
          {user ? (
            <Link to="/profile" className="nav-button">Profile</Link>
          ) : (
            <Link to="/login" className="nav-button">Sign In/Sign Up</Link>
          )}
        </div>
      </nav>

      {/* <div className="laser-beams">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`beam beam-${i + 1}`} />
        ))}
      </div> */}

      {/* <div className="welcome">
        <h1>Welcome to Continder!</h1>
      </div> */}

      <div className="main-content">
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search by Artist, Event or Venue" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {isSearching ? (
          <div className="loading-container">
            <p style={{ color: 'white' }}>Searching for artists...</p>
          </div>
        ) : concerts.length > 0 ? (
          <div
            className="concert-card draggable"
            style={style}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            <img src={currentConcert.image} alt={currentConcert.artist} draggable="false" />
            <h3>{currentConcert.artist}</h3>
            <p>{currentConcert.date} - {currentConcert.venue}</p>
          </div>
        ) : (
          <div className="no-results">
            <p style={{ color: 'white' }}>No artists found. Try a different search term.</p>
          </div>
        )}

        {concerts.length > 0 && (
          <div className="swipe-buttons">
            <button onClick={() => handleSwipe('left', currentConcert)} className="dislike">Dislike</button>
            <button onClick={() => handleSwipe('right', currentConcert)} className="like">Like</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
