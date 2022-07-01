const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userVerifySchema = new Schema({
    userId: {
        type: String,
        
    },
    uniqueString: {
        type: String,
       
    },
    createdAt: {
        type: Date,
        
    },
    expriesAt: {
        type: Date,
    
    }
},
{ timestamps: true })
const userVerify = mongoose.model('UserVerify', userVerifySchema)

module.exports = userVerify