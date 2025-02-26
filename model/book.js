const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const book = new Schema({
   
    // barbername
    name:{
        type:mongoose.Schema.ObjectId,
        ref:"barbar",
        required:true,
    },  
    servicename:{
        type : mongoose.Schema.ObjectId,
        ref:"service",
        required:true,
    },  
    categorytype: { 
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: true,
    },

});

module.exports = mongoose.model('book',book);