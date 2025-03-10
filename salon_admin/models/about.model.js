const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aboutSchema = new Schema({
  img: {
    type: Array,
  },
  experince:{
    type: String,
  },
  description:{
    type: String,
  }
},{ timestamps: true });
const about = mongoose.model('about',aboutSchema);
module.exports ={
    about
};  