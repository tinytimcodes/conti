const express = require("express");
const User = require("../models/User");
const Ticket = require("../models/ticket");

const router = express.Router();

// returns all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// creates new user in /register
router.post("/register", async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error creating user:", err); 
        res.status(400).json({ message: "Error creating user" });
    }
});

// used for logging in on /register page
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // this req the  fields

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        // ngl im just using text to text matching im a bum

        if (!user) {
            console.log("Can't find this user bruh");
            return res.status(400).json({ message: "User not found" });
        }
        if (user.password !== password) {
            console.log("Can't find this user's password bruh")
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.status(200).json({ message: "Successful login", user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get user's tickets
router.get("/:userId/tickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('tickets');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.tickets);
    } catch (err) {
        console.error("Error fetching user tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add a ticket to user's collection
router.post("/:userId/tickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const { ticketData } = req.body;

        // Create new ticket
        const newTicket = new Ticket({
            ...ticketData,
            purchase: {
                user: userId,
                purchaseDate: new Date()
            }
        });

        await newTicket.save();

        // Add ticket to user's tickets array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tickets.push(newTicket._id);
        await user.save();

        res.status(201).json(newTicket);
    } catch (err) {
        console.error("Error adding ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update ticket status
router.put("/:userId/tickets/:ticketId", async (req, res) => {
    try {
        const { userId, ticketId } = req.params;
        const { status } = req.body;

        // Verify ticket belongs to user
        const ticket = await Ticket.findOne({
            _id: ticketId,
            'purchase.user': userId
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found or not owned by user" });
        }

        // Update ticket status
        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        console.error("Error updating ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a ticket from user's collection
router.delete("/:userId/tickets/:ticketId", async (req, res) => {
    try {
        const { userId, ticketId } = req.params;

        // Verify ticket belongs to user
        const ticket = await Ticket.findOne({
            _id: ticketId,
            'purchase.user': userId
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found or not owned by user" });
        }

        // Remove ticket from user's tickets array
        const user = await User.findById(userId);
        user.tickets = user.tickets.filter(ticket => ticket.toString() !== ticketId);
        await user.save();

        // Delete the ticket
        await Ticket.findByIdAndDelete(ticketId);

        res.json({ message: "Ticket deleted successfully" });
    } catch (err) {
        console.error("Error deleting ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

