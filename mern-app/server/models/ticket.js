const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    // event ref 
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    
    // specific ticket details
    ticketmasterId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['available', 'reserved', 'sold', 'cancelled'],
        default: 'available'
    },
    
    // pricing and currency
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
        fees: { type: Number },
        total: { type: Number }
    },
    
    // seat details
    seat: {
        section: { type: String },
        row: { type: String },
        number: { type: String },
        generalAdmission: { type: Boolean, default: false }
    },
    
    // purchase information; do we need this?
    purchase: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        purchaseDate: { type: Date },
        transactionId: { type: String }
    },
    
    // little bit extra info, not sure if we need this
    restrictions: {
        ageLimit: { type: Number },
        transferable: { type: Boolean, default: true },
        refundable: { type: Boolean, default: false }
    },
    
    // honestly this would be nice to have, but don't exactly need it
    barcode: { type: String },
    qrCode: { type: String },
    notes: { type: String },
    
    // timestamps and active status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// index
ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ 'purchase.user': 1 });
ticketSchema.index({ ticketmasterId: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;