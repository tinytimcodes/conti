const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes")
const ticketmasterRoutes = require("./routes/ticketmasterRoutes")
const ticketRoutes = require("./routes/ticketRoutes")


dotenv.config(); // load env variables here

const app = express();
const PORT = process.env.PORT;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // exits if it doesn't work
    }
};  

const corsOptions = {
    origin: "http://localhost:5173", // make this shit allow reqs from front end 
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}

connectDB();
// gathers routes and middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/users", userRoutes)
app.use("/api/ticketmaster", ticketmasterRoutes)
app.use("/api/tickets", ticketRoutes)

// testing route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));