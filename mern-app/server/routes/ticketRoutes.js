const express = require("express");
const Ticket = require("../models/ticket");
const User = require("../models/User");
const router = express.Router();

// return all tickets listed for sale
router.get("/marketplace", async (req, res) => {
    try {
        const tickets = await Ticket.find({
            isListed: true,
            saleStatus: 'active'
        }).populate('seller', 'name email');
        
        res.json(tickets);
    } catch (err) {
        console.error("Error fetching marketplace tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// list ticket
router.post("/:ticketId/list", async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { askingPrice } = req.body;
        const userId = req.body.userId; // This should come from auth middleware

        const ticket = await Ticket.findById(ticketId);
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // verify ticket ownership, but should we really do this.
        
        // update ticket statuses for listing
        ticket.isListed = true;
        ticket.listingDate = new Date();
        ticket.saleStatus = 'active';
        ticket.askingPrice = askingPrice;
        ticket.seller = userId;

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error("Error listing ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove a ticket from marketplace
router.put("/:ticketId/unlist", async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.body.userId; // This should come from auth middleware

        const ticket = await Ticket.findById(ticketId);
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Verify ticket ownership
        if (ticket.seller.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to unlist this ticket" });
        }

        // Update ticket
        ticket.isListed = false;
        ticket.saleStatus = 'cancelled';

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error("Error unlisting ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get tickets listed by a specific user
router.get("/seller/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const tickets = await Ticket.find({
            seller: userId,
            isListed: true
        }).populate('seller', 'name email');
        
        res.json(tickets);
    } catch (err) {
        console.error("Error fetching seller tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router; 