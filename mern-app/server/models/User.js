const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // basic Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // more profile Information
    profilePicture: { type: String }, // URL to stored image
    location: { type: String }, // User's location for event recommendations
    
    // preferences for events and such
    favoriteGenres: [{ type: String }], // arr of genres
    favoriteArtists: [{ type: String }], // arr of artists
    savedEvents: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event' // maybe make this into saved events
    }],
    
    // User's liked tickets (from dashboard)
    likedTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    
    // user's purchased tickets where u can buy from ur liked tickets
    boughtTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    
    // preferences for email notis and other stuff
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        eventReminders: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false },
        theme: { type: String, default: 'light', enum: ['light', 'dark'] }
    },
    
    // socials ?
    socialLinks: {
        twitter: String,
        instagram: String,
        facebook: String
    },
    
}, { 
    timestamps: true, // automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // include virtuals when converting to JSON
    toObject: { virtuals: true } // include virtuals when converting to object
});

// indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ location: 1 });
userSchema.index({ favoriteGenres: 1 });
userSchema.index({ favoriteArtists: 1 });
userSchema.index({ likedTickets: 1 });
userSchema.index({ boughtTickets: 1 });

// lowercase email before saving
userSchema.pre('save', function(next) {
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// method to compare password (to be implemented with bcrypt)
userSchema.methods.comparePassword = async function(candidatePassword) {
    return true; // Placeholder
};

const User = mongoose.model("User", userSchema);
module.exports = User;
