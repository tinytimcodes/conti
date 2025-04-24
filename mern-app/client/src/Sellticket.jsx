import { useState } from 'react';
import './Sellticket.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/ContinderLogo.png';
import { useAuth } from './context/AuthContext';

function SellTicket() {
  const { user } = useAuth();
  const [ticketData, setTicketData] = useState({
    artist: '',
    price: '',
    location: '',
    date: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ticket data:', ticketData);
    // Here you would later add code to send this data to MongoDB
    alert('Ticket listed successfully!');
    // Reset form
    setTicketData({
      artist: '',
      price: '',
      location: '',
      date: ''
    });
    navigate('/Dashboard');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo-container">
        <img className="img" src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-button">Home</Link>
          <Link to="/tickets" className="nav-button">My Tickets</Link>
          <Link to="/myticket" className="nav-button">Liked Tickets</Link>
          <Link to="/" className="nav-button">Logout</Link>
        </div>
      </nav>
      <div className="sellticket-container">
        <div className="sellticket-form-container">
          <h1>Sell Ticket</h1>
          <form onSubmit={handleSubmit} className="sellticket-form">
            <div className="sellticket-form-group">
              <label htmlFor="artist">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={ticketData.artist}
                onChange={handleChange}
                required
                placeholder="Enter artist name"
              />
            </div>
            
            <div className="sellticket-form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={ticketData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter ticket price"
              />
            </div>
            
            <div className="sellticket-form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={ticketData.location}
                onChange={handleChange}
                required
                placeholder="Enter venue location"
              />
            </div>
            
            <div className="sellticket-form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={ticketData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="sellticket-submit-btn">List Ticket</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellTicket;

