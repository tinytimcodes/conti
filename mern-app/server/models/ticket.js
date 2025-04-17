const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    // event data
    event: {
        type: Object,
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
    
    // purchase information
    purchase: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        purchaseDate: { type: Date },
        transactionId: { type: String }
    },
    
    // restrictions
    restrictions: {
        ageLimit: { type: Number },
        transferable: { type: Boolean, default: true },
        refundable: { type: Boolean, default: false }
    },
    
    // additional info
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
ticketSchema.index({ 'purchase.user': 1 });
ticketSchema.index({ ticketmasterId: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;