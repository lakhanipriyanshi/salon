const {
    log1,
    success_res,
    error_res,
    auth_error,   
  } = require("../utils/general.lib");
  const { admin } = require("../models/admin.model");

const getAdmin = async (admin_id) => {
    try {
      if (!admin_id) {
        return error_res("Invalid Admin Id");
      };
      const adminDetails = await admin.findById(admin_id);
      if (!adminDetails) {
        return error_res("Invalid Admin Id");
      };
  
    return success_res("Success", adminDetails);
    } catch (error) {
      return error_res(error);
    }
  };

  module.exports = {
    getAdmin,
  };
