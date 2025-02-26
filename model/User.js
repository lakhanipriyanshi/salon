const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var User = new Schema({
  username: {
    type: String,
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
});
module.exports = mongoose.model("User", User);
