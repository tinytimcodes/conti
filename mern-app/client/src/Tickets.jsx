import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import './Tickets.css';
import logo from './assets/ContinderLogo.png';

export default function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        navigate(`/checkout/${ticket._id}`);
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/users/${user._id}/tickets`
        );
        // only keep tickets that were actually bought:
        setTickets(data.filter(t => t.status === 'purchased'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user, navigate]);

  const removeTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${user._id}/tickets/${ticketId}`);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
    } catch (err) {
      console.error(err);
      alert('Failed to remove ticket.');
    }
  };

  if (loading) {
    return (
      <div className="myticket-container">
        <p>Loading tickets…</p>
      </div>
    );
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
          <Link to="/myticket" className="nav-button">Liked Tickets</Link>
          <Link to="/profile" className="nav-button">Profile</Link>
          <Link to="/" className="nav-button">Logout</Link>
          </div>
      </nav>

      <h1>My Tickets</h1>

      <div className="tickets-container">
        {tickets.length === 0 ? (
          <p className="empty">You haven’t bought any tickets yet.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map(ticket => (
              <div key={ticket._id} className="ticket-card">
                <img
                  src={ticket.event.images?.[0]?.url}
                  alt={ticket.event.name}
                />
                <div className="ticket-info">
                  <h3>{ticket.event.name}</h3>
                  <p>Date: {ticket.event.dates?.start?.localDate}</p>
                  <p>Venue: {ticket.event._embedded?.venues?.[0]?.name}</p>
                  <p>Type: {ticket.type}</p>
                  <p>Price: ${ticket.price.amount} {ticket.price.currency}</p>
                </div>
                <div className="ticket-actions">
                  <button
                    className="remove-button"
                    onClick={() => removeTicket(ticket._id)}
                  >
                    Sell Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
