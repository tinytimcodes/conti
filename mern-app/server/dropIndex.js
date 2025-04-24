const mongoose = require('mongoose');

// removing the indedx from the database. FINALLY

async function dropTicketmasterIdIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        console.log('Connected to MongoDB');

        // Drop the index
        await mongoose.connection.collection('tickets').dropIndex('ticketmasterId_1');
        console.log('Successfully dropped ticketmasterId index');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

dropTicketmasterIdIndex(); 