const mongoose = require('mongoose');
const Schema = mongoose.Schema

var about = new Schema({
    img:{
        type: Array,
    },
    experince:{
        type: String
    },
    description:{
        type: String
    },
    expertname: {
        type: Array
    }

})
module.exports = mongoose.model('about',about)