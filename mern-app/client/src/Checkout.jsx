import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './Checkout.css';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticket = location.state?.ticket;

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [showAddCard, setShowAddCard] = useState(false);

  const handleConfirm = () => {
    alert('Purchase complete!');
    navigate('/dashboard');
  };

  if (!ticket) return <div className="checkout-page">No ticket selected.</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">Continder</div>
        <div className="nav-links">
          <Link to="/sellticket" className="nav-button">Sell</Link>
          <Link to="/myticket" className="nav-button">My Ticket</Link>
          {user ? (
            <Link to="/profile" className="nav-button">Profile</Link>
          ) : (
            <Link to="/login" className="nav-button">Sign In/Sign Up</Link>
          )}
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

          <button className="confirm-button" onClick={handleConfirm}>Confirm Purchase</button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
