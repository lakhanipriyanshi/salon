const { log1, error_res, success_res } = require("../lib/general.lib");
const { db } = require("../utils/db.helper");
const { admin } = require("./admin.model");
const table = "tbl_settings";

const getSettings = async () => {
   let settings = [];
   try {
      let results = await admin.findOne({autoload: 1})
      if (results.length > 0) {
         results.forEach((row) => {
            settings[row.name] = row.val;
         });
      };
   } catch (error) {
      log1(error.message);
   };
   return settings;
}; 

const saveSettings = async (name, val) => {
   try {
      await db(table).where({ name }).update({ val });
      return success_res("Update Successfully");
   } catch (error) {
      return error_res(error.message);
   };
};

module.exports = {
   getSettings,
   saveSettings,
};
