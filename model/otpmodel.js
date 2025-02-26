const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpmodel = new Schema({
  userid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },

  expiretime: { type: Date, expires: "5m", default: Date.now },
});


module.exports = mongoose.model("otpmodel", otpmodel);
