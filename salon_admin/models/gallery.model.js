const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gallerySchema = new Schema({
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
const gallery = mongoose.model("gallery", gallerySchema);
module.exports = { gallery };

