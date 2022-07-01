const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: Number
    },
    verifed : {
        type :Boolean
    }
},
{ timestamps: true })
const User = mongoose.model('User', userSchema)

module.exports = User