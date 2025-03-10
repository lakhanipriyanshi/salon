const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId:{
        type:mongoose.Schema.ObjectId,  
        ref: "User", 
    },
    notificationType:{
        type:Number,
        required:true,
    },
    is_user:{
        type:Boolean,
        default:false,
    },
    is_admin:{
        type:Boolean,
        default:false,
    },
    description:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    }
},{ timestamps: true });
const notification = mongoose.model("notification",notificationSchema);

module.exports = {
    notification,
}