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
    },{ timestamps: true });

module.exports = mongoose.model('barbar',barbar);