const mongoose = require('mongoose');
const Schema =  mongoose.Schema

const service = new Schema({
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
});
module.exports = mongoose.model('service',service);

