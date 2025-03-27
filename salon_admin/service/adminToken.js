const { ObjectId } = require("mongodb");
const Constants = require("../config/constant");
const {
  log1,
  success_res,
  error_res,
} = require("../utils/general.lib");
const { admin } = require("../models/admin.model");
const { adminToken } = require("../models/adminToken.model");

// this function generate auth token ans store it

const generateAuthToken = async (admin_id) => {
  try {
    if (!admin_id) {
      return error_res("Invalid Admin Id");
    }

    const adminAlb = await adminToken.findOne(
      { _id: new ObjectId(admin_id) },
      { _id: 1 }
    );
    if (adminAlb) {
      await admin.findByIdAndDelete({ _id: new ObjectId(admin_id) });
    }

    const token = await generateRandomString(Constants.AUTH_TOKEN_LENGTH);

    const addAdmin = await adminToken.findOneAndUpdate(
       {admin_id: new ObjectId(admin_id)},
       {$set:{ token: token}},
       {upsert:true}
    );

    if (addAdmin) {
      return success_res("Success", { auth_token: token });
    } else {
      return error_res("Error in auth token generation");
    }
  } catch (error) {
    return error_res(error);
  }
};


//* this function is generate random sting of length pass in params
 // if string is exist than generate new string
 
 const generateRandomString = async (length) => {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  var str = "";
  for (var i = 0; i < length; i++) {
    str += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  let result = await adminToken.findOne({ token: str });
  //let result = await db(table).where({ token: str });
  if (result) {
    return await generateRandomString(length);
  }
  return str;
};module.exports = {
  generateAuthToken,
  generateRandomString,
};
