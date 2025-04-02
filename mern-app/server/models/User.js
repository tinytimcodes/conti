const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // basic Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // more rofile Information
    profilePicture: { type: String }, // URL to stored image
    location: { type: String }, // User's location for event recommendations
    
    // preferences for events and such
    favoriteGenres: [{ type: String }], // arr of genres
    favoriteArtists: [{ type: String }], // arr of artists
    savedEvents: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event' // Reference to Event model (you'll need to create this)
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
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true } // Include virtuals when converting to object
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ location: 1 });
userSchema.index({ favoriteGenres: 1 });
userSchema.index({ favoriteArtists: 1 });

// Pre-save middleware to handle any data transformations
userSchema.pre('save', function(next) {
    // Convert email to lowercase before saving
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// Method to compare password (you'll need to implement this with bcrypt)
userSchema.methods.comparePassword = async function(candidatePassword) {
    // This will be implemented when we add authentication
    return true; // Placeholder
};

const User = mongoose.model("User", userSchema);
module.exports = User;
