import React, { useState, useEffect } from 'react';
import { Link, useNavigate }             from 'react-router-dom';
import axios                             from 'axios';
import { useAuth }                       from './context/AuthContext';
import './Sellticket.css';
import logo                              from './assets/ContinderLogo.png';

export default function SellTicket() {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [soldTickets, setSoldTickets] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/soldTickets')
      .then(res => setSoldTickets(res.data))
      .catch(err => console.error('Error fetching sold tickets:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading marketplace…</div>;

  return (
    <div className="sellticket-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="img" />
        </div>
        <div className="nav-links">
          <Link to="/dashboard"    className="nav-button">Home</Link>
          <Link to="/sellticket"   className="nav-button">Sell</Link>
          <Link to="/myTicket"     className="nav-button">My Tickets</Link>
          <Link to="/likedTickets" className="nav-button">Liked Tickets</Link>
          <Link to="/"             className="nav-button">Logout</Link>
        </div>
      </nav>

      <h2>Sold Tickets</h2>
      {soldTickets.length === 0 ? (
        <p className="no-tickets">No sold tickets yet.</p>
      ) : (
        <div className="tickets-grid">
          {soldTickets.map(({ _id, ticket, seller, askingPrice, soldAt }) => {
            // `ticket` is populated Ticket doc
            const ev   = ticket.event || {};
            const price = askingPrice?.amount != null
              ? `$${askingPrice.amount.toFixed(2)} ${askingPrice.currency}`
              : 'Not set';
            return (
              <div key={_id} className="ticket-card">
                <img
                  src={ev.images?.[0]?.url || 'placeholder.jpg'}
                  alt={ev.name || 'Event'}
                />
                <div className="ticket-info">
                  <h3>{ev.name || 'Unnamed Event'}</h3>
                  <p>Date: {ev.dates?.start?.localDate || 'Unknown'}</p>
                  <p>Venue: {ev._embedded?.venues?.[0]?.name || 'Unknown'}</p>
                  <p>Type: {ticket.type}</p>
                  <p>Price: {price}</p>
                  <p>Seller: {seller.name || seller.email}</p>
                  <p>Sold At: {new Date(soldAt).toLocaleString()}</p>
                </div>
                <div className="ticket-actions">
                  <button
                    className="buy-button"
                    onClick={() => {
                      if (!user) return navigate('/login');
                      navigate(`/checkout/${ticket._id}`, { state: { ticket } });
                    }}
                  >
                    Buy It
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
;