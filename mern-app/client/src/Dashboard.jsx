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
  const [error, setError] = useState("");
  const startX = useRef(0);
  const deltaX = useRef(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentConcert = concerts[index];

  useEffect(() => {
    fetchConcerts("music");
  }, []);

  const fetchConcerts = async (searchTerm) => {
    try {
      setIsSearching(true);
      setError("");
      
      // Ensure we have a valid search term
      const term = searchTerm || "music";
      
      // Use a fixed page for more consistent results
      const page = 0; 
      console.log(`Searching for: ${term}, page: ${page}`);
      
      const res = await axios.get(`http://localhost:5001/api/ticketmaster/search?keyword=${encodeURIComponent(term)}&size=50&page=${page}`);

      const events = res.data._embedded?.events || [];

      const formatted = events.map(event => ({
        id: event.id,
        artist: event.name.split(' | ')[0],
        date: event.dates?.start?.localDate || "TBA",
        venue: event._embedded?.venues?.[0]?.name || "Unknown Venue",
        image: event.images?.find(img => img.width >= 600)?.url || "",
        eventData: event
      }));
      
      const uniqueByArtist = Array.from(
        new Map(formatted.map(event => [event.artist, event])).values()
      );
      
      console.log(`Found ${uniqueByArtist.length} unique artists`);
      
      if (uniqueByArtist.length === 0) {
        setError("No artists found. Please try a different search term.");
        setConcerts([]);
        setIsSearching(false);
        return;
      }
      
      const shuffled = uniqueByArtist.sort(() => 0.5 - Math.random());
      setConcerts(shuffled);
      setIndex(0);
      setIsSearching(false);
      
    } catch (error) {
      console.error("Error loading concert data:", error);
      setError("Failed to search. Please try again.");
      setConcerts([]);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      console.log(`Searching for: ${query}`);
      fetchConcerts(query);
    } else {
      setError("Please enter a search term");
    }
  };

  const addToMyTickets = async (concert) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Format the event data to match what we need
      const formattedEvent = {
        name: concert.artist,
        date: concert.date,
        venue: concert.venue,
        images: [{ url: concert.image }],
        id: concert.id,
        dates: {
          start: {
            localDate: concert.date
          }
        },
        _embedded: {
          venues: [{
            name: concert.venue
          }]
        }
      };

      const ticketPrice = concert.eventData.priceRanges?.[0]?.min || 50.00;

      const ticketData = {
        event: formattedEvent,
        ticketmasterId: concert.id,
        type: "General Admission",
        price: {
          amount: ticketPrice,
          currency: "USD",
          fees: ticketPrice * 0.1,
          total: ticketPrice * 1.1
        },
        seat: {
          section: "GA",
          generalAdmission: true
        },
        status: "available",
        isListed: false,
        saleStatus: "active"
      };

      console.log('Sending ticket data:', JSON.stringify(ticketData, null, 2));

      // Add to liked tickets
      await axios.post(`http://localhost:5001/api/users/${user._id}/likedTickets`, {
        ticketData
      });

      alert("Ticket added to liked tickets!");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      if (error.response?.status === 404) {
        alert("User not found. Please try logging in again.");
      } else if (error.response?.status === 400) {
        alert("You've already liked this ticket.");
      } else {
        alert("Failed to add ticket to liked tickets. Please try again.");
      }
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
      if (dir === 'right' && concert) {
        addToMyTickets(concert);
      }
      setIndex(i => (i + 1) % concerts.length);
    }, 300);
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
          <Link to="/sellticket" className="nav-button">Marketplace</Link>
          <Link to="/tickets" className="nav-button">My Tickets</Link>
          <Link to="/myticket" className="nav-button">Liked Tickets</Link>
          <Link to="/login" className="nav-button">Logout</Link>
        </div>
      </nav>
      <div className="main-content">
        {user && (
            <h2 className="welcome-message">
              Welcome, {user.name || user.username || user.email}!
            </h2>
          )}
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

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

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
        ) : !isSearching && !error ? (
          <div className="no-results">
            <p style={{ color: 'white' }}>No artists found. Try a different search term.</p>
          </div>
        ) : null}

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
