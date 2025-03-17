const { ObjectId } = require("mongodb");
const Constants = require("../config/constant");
const {
  log1,
  success_res,
  error_res,
  auth_error,   
} = require("../lib/general.lib");
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

    //result = await db(table).insert(data);
    const addAdmin = await adminToken.create({
        admin_id: admin_id,
        token: token,
    });

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
};

/*
// * this function is delete token of admin id

const deleteAuthToken = async (admin_id) => {
  try {   
    let result = await db(table).where({ admin_id }).delete();
    return success_res("Auth Token Delete");
  } catch (error) {
    return error_res("error.message");
  }
};


 // this function is used to logout admin by delete token/
const getAdminLogout = async (admin_id) => {
  try {
    let result = await db(table).where({ admin_id }).delete();
    return success_res("Logout successfully");
  } catch (error) {
    return error_res(error.message);
  }
};



// this funtion is used to verify auth token is exists or not

const verifyAuthToken = async (token) => {
   
   let result = await admin.findOne({ token });
   //let result = await db(table).where({ token });
  if (result.length > 0) {
    return success_res("Valid Token", result[0]);
  }
  return error_res("Invalid Token");
};


// this function is used to authenticate token is valid or not

const authenticateToken = async (adminId, ua) => {
   //let result = await admin.findOne({admin_id: adminId ,ua: ua});
  //let result = await db(table).where("admin_id", adminId).where("ua", ua);
  if (result.length > 0) {
    return success_res("Authorized", { admin_id: result[0].admin_id });
  }
  return auth_error();
};
*/
module.exports = {
  generateAuthToken,
  // deleteAuthToken,
  //verifyAuthToken,
  //getAdminLogout,
  //authenticateToken,
  generateRandomString,
};
