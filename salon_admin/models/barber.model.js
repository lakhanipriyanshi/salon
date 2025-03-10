const mongoose = require('mongoose');
const Schema = mongoose.Schema


const barbarSchema = new Schema(
    {
        img:{
            type:Array
        },
        name:{
            type:String
        },
        barbar_type:{
            type:String
        },
        },{ timestamps: true });
const barber = mongoose.model('barbar',barbarSchema);

    module.exports = {
        barber
    };