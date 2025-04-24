import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Myticket.css';
import logo from './assets/ContinderLogo.png';

function Myticket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/users/${user._id}/likedTickets`);
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, navigate]);

  const removeTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${user._id}/likedTickets/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      console.error("Error removing ticket:", error);
      alert("Failed to remove ticket. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="myticket-container">
      <nav className="navbar">
        <div className="logo-container">
          <img className="img" src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-button">Home</Link>
          <Link to="/sellticket" className="nav-button">Sell</Link>
          <Link to="/tickets" className="nav-button">My Tickets</Link>
          <Link to="/profile" className="nav-button">Profile</Link>
          <Link to="/" className="nav-button">Logout</Link>
        </div>
      </nav>

      <div className="tickets-container">
        <h2>Liked Tickets</h2>
        {tickets.length === 0 ? (
          <p className="no-tickets">No tickets saved yet.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="ticket-card">
                <img src={ticket.event.images?.[0]?.url} alt={ticket.event.name} />
                <div className="ticket-info">
                  <h3>{ticket.event.name}</h3>
                  <p>Date: {ticket.event.dates?.start?.localDate}</p>
                  <p>Venue: {ticket.event._embedded?.venues?.[0]?.name}</p>
                  <p>Type: {ticket.type}</p>
                  <p>Price: ${ticket.price.amount} {ticket.price.currency}</p>
                  <div className="ticket-actions">
                    <button
                      className="remove-button"
                      onClick={() => removeTicket(ticket._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="buy-button"
                      onClick={() => navigate('/checkout', { state: { ticket } })}
                    >
                      Buy It
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Myticket;
