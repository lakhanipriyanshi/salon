const mongoose = require('mongoose');
const Schema = mongoose.Schema


const barbar = new Schema(
    {
        img:{
            type:Array
        },
        name:{
            type:String
        },
        barbar_type:{
            type:String
        }
    });

    module.exports = mongoose.model('barbar',barbar);