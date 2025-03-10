const mongoose = require('mongoose');
const Schema =  mongoose.Schema

const serviceSchema = new Schema({
   img:{
  type: Array
  },    
    servicename:{
        type : String
    },
    description:{
        type: String
        },
    price:{
      type: Number
    }
},{ timestamps: true });
const service = mongoose.model("service", serviceSchema);

module.exports = {
    service
 };
 