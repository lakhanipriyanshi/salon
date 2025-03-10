const mongoose = require('mongoose');
const Schema = mongoose.Schema

const adminTokenSchema = new Schema({
   token:{
      type: String
   },
   admin_id:{
        type: String 
   }
},{ timestamps: true });
const adminToken = mongoose.model('adminToken', adminTokenSchema);

module.exports={ adminToken };