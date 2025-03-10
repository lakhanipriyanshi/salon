const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appoinmentbookSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    //servicename
    servicename: {
      type: mongoose.Schema.ObjectId, 
      ref: "service",
      required: true,
    },
    // barbername
    barbername: {
      type: mongoose.Schema.ObjectId,
      ref: "barbar",
      required: true,
    },
    bookdate: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      default: 1, //pending:1,Success:2 reject:3
      required: true,
    },
  },
  { timestamps: true }
);

const appoinmentbook = mongoose.model("appoinmentbook", appoinmentbookSchema);

module.exports = { appoinmentbook };
