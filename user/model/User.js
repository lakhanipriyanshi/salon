const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var User = new Schema({
  username: {
    type: String,
    required:true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  mobileno: {
    type: Number,
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: Array,
  },
  // for otp verification process
  isVery: {
    type: Number,
    default: 1, // 1:pending 2:Success 3:rejected
  },
},{ timestamps: true });
module.exports = mongoose.model("User", User);
