const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    ticketID: { type: String, required: true },
    ticketType: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    ticketSeat: { type: String, required: true },
})

const ticket = mongoose.model("ticket", ticketSchema);
module.exports = ticket;