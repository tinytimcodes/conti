import './Myticket.css';
import { useEffect, useState } from 'react';

function Myticket() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myTickets')) || [];
    setTickets(saved);
  }, []);

  const removeTicket = (id) => {
    const updated = tickets.filter(ticket => ticket.id !== id);
    setTickets(updated);
    localStorage.setItem('myTickets', JSON.stringify(updated));
  };

  return (
    <div className="myticket-container">
      <h1>My Tickets</h1>
      {tickets.length === 0 ? (
        <p>You haven’t added any concerts yet.</p>
      ) : (
        <div className="ticket-grid">
          {tickets.map((concert) => (
            <div key={concert.id} className="ticket-card">
            <img src={concert.image} alt={concert.artist} />
            <h3>{concert.artist}</h3>
            <p>{concert.date} - {concert.venue}</p>
            
            <div className="button-group">
              <button className="remove-button" onClick={() => removeTicket(concert.id)}>Remove</button>
              <button className="buy-button" onClick={() => window.location.href = `/buyticket/${concert.id}`}>Buy It</button>
              </div>
          </div>
          
          ))}
        </div>
      )}
    </div>
  );
}

export default Myticket;
