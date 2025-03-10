
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const adminSchema = new Schema({
   email: { type: String},
   password:{ type: String}
},{timestamps:true});

const admin = mongoose.model("admin", adminSchema);


module.exports = {
   admin,  
};


//const { error_res, success_res, log1 } = require("../lib/general.lib");
//const { decryption, encryption } = require("../lib/mycrypt.lib");
//const { db } = require("../utils/db.helper");
//const { deleteAuthToken } = require("./adminToken.model");
//const table = "tbl_admin";

/*const checkLogin = async (email, password) => {
   try {
      const result = await admin.findOne({ email });
    //  let result = await db(table).where(table + ".email", email);

      
      if (result.length == 0) return error_res("Invalid credentials. Please try again.");

      let decrypt = await decryption(password, result[0].password);
      if (!decrypt) return error_res("Invalid credentials. Please try again.");

      delete result[0].password;
      return success_res("Login successful! Welcome to your Salon Admin Panel.", result[0]);
   } catch (error) {
      return error_res(error.message);
   }
};*/
/*
const getAdmin = async (id) => {
   let result = await admin.findById(id);
   //let result = await db(table).where({ id });
   if (result.length > 0) {
      return result[0];
   }
   return null;
};

const updateAdminPassword = async (id, password) => {
   password = await encryption(password);
   try {
      await db(table)
         .where({ id })
         .update({ password });
      await deleteAuthToken(id);
      return success_res("Password Updated Successfully! You'll be logged out.");
   } catch (error) {
      return error_res(error.message);
   }
};

const updateAdmin = async (admin_id, data) => {
   try {
      await db(table).where({ id: admin_id }).update(data);
      return success_res("Success");
   } catch (error) {
      return error_res(error.message);
   }
};
*/
 //getAdmin,
   //updateAdminPassword,
   //updateAdmin,