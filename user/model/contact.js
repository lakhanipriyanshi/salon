const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contact = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
},{ timestamps: true });
module.exports = mongoose.model('contact',contact);