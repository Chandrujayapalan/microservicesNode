const mongoose = require('mongoose')
const Schema = mongoose.Schema
const  orderSchema = new Schema({
    items: {
        type: Array,
        trim: true,
        ref : "Products"
    }, 
    date :{
        type: Date
     
    }, 
    total: {
        type: Number,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},
{ timestamps: true })
const Orders = mongoose.model('Orders', orderSchema)
module.exports = Orders