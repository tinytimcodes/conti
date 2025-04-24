const mongoose = require('mongoose');

const soldTicketSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  askingPrice: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  soldAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SoldTicket', soldTicketSchema);
