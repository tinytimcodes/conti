const express = require('express');
const SoldTicket = require('../models/SoldTicket');
const router = express.Router();

// list a ticket globally
router.post('/', async (req, res) => {
  try {
    const { ticketId, sellerId, askingPrice } = req.body;
    const sold = new SoldTicket({
      ticket: ticketId,
      seller: sellerId,
      askingPrice
    });
    await sold.save();
    res.status(201).json(sold);
  } catch (err) {
    console.error("Error creating sold ticket:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get all sold tickets
router.get('/', async (req, res) => {
  try {
    const all = await SoldTicket
      .find()
      .populate('ticket')
      .populate('seller', 'name email');
    res.json(all);
  } catch (err) {
    console.error("Error fetching sold tickets:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
