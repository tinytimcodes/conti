import { useState, useRef, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [concerts, setConcerts] = useState([]);

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [style, setStyle] = useState({});
  const startX = useRef(0);
  const deltaX = useRef(0);

  const currentConcert = concerts[index];

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const page = Math.floor(Math.random() * 5); 
        const res = await axios.get(`/api/ticketmaster/search?keyword=music&size=200&page=${page}`);

        const events = res.data._embedded?.events || [];
  
        const formatted = events.map(event => ({
          id: event.id,
          artist: event.name.split(' | ')[0],
          date: event.dates?.start?.localDate || "TBA",
          venue: event._embedded?.venues?.[0]?.name || "Unknown Venue",
          image: event.images?.find(img => img.width >= 600)?.url || ""
        }));
        
        const uniqueByArtist = Array.from(
          new Map(formatted.map(event => [event.artist, event])).values()
        );
        setConcerts(uniqueByArtist);
        
      } catch (error) {
        console.error("load concert data wrong：", error.message);
      }
    };
  
    fetchConcerts();
  }, []);
  

  const handleSwipe = (dir) => {
    setStyle({
      transform: `translateX(${dir === 'left' ? '-1000px' : '1000px'}) rotate(${dir === 'left' ? '-30' : '30'}deg)`,
      opacity: 0,
      transition: 'transform 0.3s ease, opacity 0.3s ease'
    });
    setTimeout(() => {
      setStyle({});
      setIndex((prev) => (prev + 1) % concerts.length); 
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
      handleSwipe(deltaX.current < 0 ? 'left' : 'right');
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
        <div className="logo">Continder</div>
        <div className="nav-links">
          <Link to="/sellticket" className="nav-button">Sell</Link>
          <Link to="/myticket" className="nav-button">My Ticket</Link>
          <Link to="/login" className="nav-button">Sign In/Sign Up</Link>
        </div>
      </nav>

      <div className="laser-beams">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`beam beam-${i + 1}`} />
        ))}
      </div>

      <div className="welcome">
        <h1>Welcome to Continder!</h1>
      </div>

      <div className="main-content">
        <div className="search-bar">
          <input type="text" placeholder="Search by Artist, Event or Venue" />
          <button className="search-button">Search</button>
        </div>

        {currentConcert ? (
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
            <button
              className="add-button"
              onClick={() => {
                const existing = JSON.parse(localStorage.getItem('myTickets')) || [];
                const alreadyExists = existing.find(ticket => ticket.id === currentConcert.id);
                if (!alreadyExists) {
                  localStorage.setItem('myTickets', JSON.stringify([...existing, currentConcert]));
                  alert("Ticket added to My Tickets!");
                } else {
                  alert("This ticket is already in My Tickets.");
                }
              }}
            >
              Add to My Tickets
            </button>
          </div>
        ) : (
          <p style={{ color: 'white' }}>Loading concerts...</p>
        )}

        <div className="swipe-buttons">
          <button onClick={() => handleSwipe('left')} className="dislike">Dislike</button>
          <button onClick={() => handleSwipe('right')} className="like">Like</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

