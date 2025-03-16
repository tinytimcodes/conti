const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: "Error creating user" });
    }
});

router.post("/login", (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({user: user})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json("successful login")
            } else {
                res.json("incorrect password")
            }
        } else {
            res.json("No record existed")
        }
    })
})


module.exports = router;

