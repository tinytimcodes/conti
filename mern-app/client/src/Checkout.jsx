import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import logo from './assets/ContinderLogo.png';
import './Checkout.css';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticket = location.state?.ticket;

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [showAddCard, setShowAddCard] = useState(false);

    if (!ticket) {
    return (
      <div className="checkout-page">
        <p>No ticket selected. Please go back and pick one.</p>
        <button onClick={() => navigate('/myticket')}>My Tickets</button>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // add the ticket to the user's bought ticket
      await axios.post(`http://localhost:5001/api/users/${user._id}/boughtTickets`, {
        ticketId: ticket._id
      });

      // remove the same ticket from the liked tickets
      await axios.delete(`http://localhost:5001/api/users/${user._id}/likedTickets/${ticket._id}`);

      alert("Purchase successful! Ticket added to your collection.");
      navigate('/tickets');
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      if (error.response?.status === 404) {
        alert("Ticket not found. It may have been already purchased.");
      } else if (error.response?.status === 400) {
        alert("You've already purchased this ticket.");
      } else {
        alert("Failed to complete purchase. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo-container">
                <img className="img" src={logo} alt="Logo" />
                </div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-button">Home</Link>
          <Link to="/sellticket" className="nav-button">Marketplace</Link>
          <Link to="/tickets" className="nav-button">My Tickets</Link>
          <Link to="/myticket" className="nav-button">Liked Tickets</Link>
          <Link to="/" className="nav-button">Logout</Link>
        </div>
      </nav>

      <div className="laser-beams">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`beam beam-${i + 1}`} />
        ))}
      </div>

      <div className="checkout-page">
        <div className="checkout-box">
          <h2>Checkout</h2>

          <div className="ticket-details">
            <img src={ticket.event.images?.[0]?.url} alt={ticket.event.name} />
            <div>
              <h3>{ticket.event.name}</h3>
              <p><strong>Date:</strong> {ticket.event.dates?.start?.localDate}</p>
              <p><strong>Venue:</strong> {ticket.event._embedded?.venues?.[0]?.name}</p>
              <p><strong>Type:</strong> {ticket.type}</p>
            </div>
          </div>

          <div className="price-section">
            <p>Ticket Price: ${ticket.price.amount}</p>
            <p>Service Fee: $5.00</p>
            <p><strong>Total: ${ticket.price.amount + 5}</strong></p>
          </div>

          <div className="payment-options">
            <h4>Payment Method</h4>
            <label>
              <input
                type="radio"
                name="payment"
                value="credit-card"
                checked={paymentMethod === 'credit-card'}
                onChange={() => setPaymentMethod('credit-card')}
              />
              Credit Card
              {!showAddCard && (
                <button
                  className="add-card-button"
                  onClick={() => setShowAddCard(true)}
                  title="Add Card"
                >
                ＋
                </button>
              )}
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="paypal"
                onChange={() => setPaymentMethod('paypal')}
              />
              PayPal
            </label>
          </div>

          {paymentMethod === 'credit-card' && showAddCard && (
            <div className="card-form">
              <button className="back-button" onClick={() => setShowAddCard(false)}>
                ← Back to Stored Cards
              </button>
              <input type="text" placeholder="Name on Card" />
              <input type="text" placeholder="Card Number" />
              <div className="card-row">
                <input type="text" placeholder="Expiration Date (MM/YY)" />
                <input type="text" placeholder="Security Code (CVV)" />
              </div>
              <input type="text" placeholder="Country" />
              <input type="text" placeholder="Address Line 1" />
              <input type="text" placeholder="Address Line 2 (Optional)" />
              <div className="card-row">
                <input type="text" placeholder="City" />
                <input type="text" placeholder="State" />
              </div>
              <div className="card-row">
                <input type="text" placeholder="Postal Code" />
                <input type="text" placeholder="Phone Number" />
              </div>

              <div className="card-options">
                <label className="save-card">
                  <input type="checkbox" />
                  Save this card for future purchases
                </label>
                <div className="card-buttons">
                  <button className="cancel-button" onClick={() => setShowAddCard(false)}>Cancel</button>
                  <button className="add-card-button-submit">Add New Card</button>

                </div>
              </div>
            </div>
          )}

          <button className="confirm-button" onClick={handlePurchase}>Confirm Purchase</button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
