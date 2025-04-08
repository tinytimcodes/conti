const { MongoServerClosedError } = require("mongodb");
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventID: { type: String, required: true}, 
    eventName: {type: String, required: true}, 
    eventDate: {type: Date, required: true},
    eventLocation: {type: String, required: true}, 
    eventArtist: {type: String, required: true},
    eventTime: {type: String, required: true},
    eventGenre: {type: String, required:true},
})

const event = mongoose.model("event", eventSchema);
module.exports = event;

