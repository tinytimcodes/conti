const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes")


dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit process with failure
    }
};  

connectDB();
// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes)

// Test Route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));