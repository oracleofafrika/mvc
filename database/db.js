const mongoose = require('mongoose');

// Connect to MongoDB

const DB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Eror connecting to MongoDB');     
    }
}
module.exports = DB;