const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallery = new Schema({
  img: {
    type: Array,
    default:[],
  },
    
  categorytype: { 
    type: mongoose.Schema.ObjectId,
    ref: "category",
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model('gallery', gallery);


