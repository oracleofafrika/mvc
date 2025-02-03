const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilepic: {
        type: String,
        required: true,
        
    },
    role: {
        type: String,
        required: true,
        default : 'user'
    }
})
const User = mongoose.model('User', Schema);


module.exports = User;