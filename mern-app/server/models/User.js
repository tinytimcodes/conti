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
    
    // User's tickets
    tickets: [{
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
    toJSON: { virtuals: true }, // include virtuals when converting to JSON (ngl dont need this)
    toObject: { virtuals: true } // include virtuals when converting to object ( this too)
});

// for better query performance? need to test this
userSchema.index({ email: 1 });
userSchema.index({ location: 1 });
userSchema.index({ favoriteGenres: 1 });
userSchema.index({ favoriteArtists: 1 });
userSchema.index({ tickets: 1 }); // Add index for tickets

// honeslty not completely sure if we need this but nice to have
userSchema.pre('save', function(next) {
    // lowercase email before saving
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// method to compare password (have to implement this with bcrypt but are we using this?)
userSchema.methods.comparePassword = async function(candidatePassword) {
    // This will be implemented when we add authentication
    return true; // Placeholder
};

const User = mongoose.model("User", userSchema);
module.exports = User;
