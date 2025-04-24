const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    // event data
    event: {
        type: Object,
        required: true
    },
    
    // specific ticket details
    ticketmasterId: { type: String, required: true },
    type: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['available', 'reserved', 'sold', 'cancelled'],
        default: 'available'
    },
    
    // selling related fields
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    listingDate: { type: Date },
    isListed: { type: Boolean, default: false },
    saleStatus: {
        type: String,
        enum: ['active', 'pending', 'sold', 'cancelled'],
        default: 'active'
    },
    // askingPrice: {
    //     amount: { type: Number },
    //     currency: { type: String, default: 'USD' }
    // },
    
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

// indexes
ticketSchema.index({ 'purchase.user': 1 });
ticketSchema.index({ seller: 1 });
ticketSchema.index({ isListed: 1, saleStatus: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;