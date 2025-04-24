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
        navigate('/login');
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/users/${user._id}/boughtTickets`
        );
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user, navigate]);


  // list ticket globally in soldTickets collection
  const sellTicket = async (ticket) => {
    try {
      const price = prompt("Enter your asking price:");
      if (!price) return;
  
      const resp = await axios.post(
        "http://localhost:5001/api/soldTickets",
        {
          ticketId: ticket._id,
          sellerId: user._id,
          askingPrice: {
            amount: Number(price),
            currency: ticket.price.currency
          }
        }
      );
      console.log("SoldTicket response:", resp);
      alert("Ticket listed globally!");
    } catch (err) {
      // more detailed logging:
      console.error("Listing error:", err.response?.status, err.response?.data || err.message);
      alert(`Failed to list ticket: ${err.response?.data?.message || err.message}`);
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
          <Link to="/sellticket" className="nav-button">Marketplace</Link>
          <Link to="/myticket" className="nav-button">Liked Tickets</Link>
          <Link to="/" className="nav-button">Logout</Link>
        </div>
      </nav>

      <h1>My Tickets</h1>
      <div className="tickets-container">
        {tickets.length === 0 ? (
          <p className="empty">You haven't bought any tickets yet.</p>
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
                    className="sell-button"
                    onClick={() => sellTicket(ticket)}
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
