const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categorytype: {
    type: String,
    default: "",
    required :true,
  },
  status:{
    type: Number,
    default: 1,   // 1 : Inactive, 2: Active,
    required:true,
  }
},{ timestamps: true });

module.exports = mongoose.model("category", categorySchema);
 