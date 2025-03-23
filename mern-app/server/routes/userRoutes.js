const express = require("express");
const User = require("../models/User");

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


module.exports = router;

