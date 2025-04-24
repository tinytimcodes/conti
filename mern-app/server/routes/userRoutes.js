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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });

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

// get user's liked tickets
router.get("/:userId/likedTickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('likedTickets');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.likedTickets);
    } catch (err) {
        console.error("Error fetching liked tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// get user's bought tickets
router.get("/:userId/boughtTickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('boughtTickets');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.boughtTickets);
    } catch (err) {
        console.error("Error fetching bought tickets:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add a ticket to user's liked tickets
router.post("/:userId/likedTickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const { ticketData } = req.body;

        console.log('Received ticket data:', JSON.stringify(ticketData, null, 2));

        if (!ticketData) {
            return res.status(400).json({ message: "No ticket data provided" });
        }

        // First, check if a ticket with this ticketmasterId already exists
        let ticket = await Ticket.findOne({ ticketmasterId: ticketData.ticketmasterId });
        
        if (!ticket) {
            // If ticket doesn't exist, create a new one
            ticket = new Ticket(ticketData);
            await ticket.save();
        }

        // Add ticket to user's likedTickets array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if ticket is already liked
        if (user.likedTickets.includes(ticket._id)) {
            return res.status(400).json({ message: "Ticket already liked" });
        }

        user.likedTickets.push(ticket._id);
        await user.save();

        res.status(201).json(ticket);
    } catch (err) {
        console.error("Error adding liked ticket:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Invalid ticket data", 
                errors: err.errors 
            });
        }
        res.status(500).json({ 
            message: "Server error",
            error: err.message 
        });
    }
});

// add a ticket to user's bought tickets
router.post("/:userId/boughtTickets", async (req, res) => {
    try {
        const { userId } = req.params;
        const { ticketId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check if it was boughgt
        if (user.boughtTickets.includes(ticketId)) {
            return res.status(400).json({ message: "Ticket already bought" });
        }

        user.boughtTickets.push(ticketId);
        await user.save();

        res.status(201).json(user.boughtTickets);
    } catch (err) {
        console.error("Error adding bought ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// remove a ticket from user's liked tickets
router.delete("/:userId/likedTickets/:ticketId", async (req, res) => {
    try {
        const { userId, ticketId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.likedTickets = user.likedTickets.filter(id => id.toString() !== ticketId);
        await user.save();

        res.json(user.likedTickets);
    } catch (err) {
        console.error("Error removing liked ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

