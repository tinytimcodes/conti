const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    // ticketmaster api fields
    ticketmasterId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    images: [{
        url: String,
        width: Number,
        height: Number,
        ratio: String
    }],
    
    // event details
    date: { type: Date, required: true },
    time: { type: String },
    status: { type: String, enum: ['onsale', 'offsale', 'cancelled', 'postponed', 'rescheduled'] },
    
    // location information
    venue: {
        name: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        address: { type: String },
        postalCode: { type: String },
        location: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number] } // [longitude, latitude]
        }
    },
    
    // artist/performer information
    performers: [{
        name: { type: String, required: true },
        type: { type: String },
        url: { type: String }
    }],
    
    // classification
    classifications: [{
        genre: { type: String },
        subGenre: { type: String },
        segment: { type: String },
        type: { type: String }
    }],
    
    // pricing information
    priceRanges: [{
        type: { type: String },
        currency: { type: String },
        min: { type: Number },
        max: { type: Number }
    }],
    
    // additional fields
    promoter: { type: String },
    ageRestrictions: { type: String },
    ticketLimit: { type: Number },
    
    // system fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// index for geospatial queries
eventSchema.index({ 'venue.location': '2dsphere' });

// index for text search
eventSchema.index({ name: 'text', description: 'text' });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

