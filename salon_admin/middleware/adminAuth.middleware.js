const { log1 } = require("../utils/general.lib");
const { getAdmin } = require("../service/admin");
const { getSettings } = require("../models/settings.model");
const { generateAuthToken } = require("../service/adminToken");
const requestIP = require('request-ip');

/**
 * this api middleware is used to validate admin auth-token
 */
module.exports = async (req, res, next) => {
   //let settings = await getSettings();
   
   if (req.session.admin == undefined) {
      res.redirect("/admin/login");
      return;
   };
   let loginAdmin = await getAdmin(req.session.admin._id);
   let ua = req.get("User-Agent");     
   if (loginAdmin.flag !== 0) {
      let already_login = await generateAuthToken(loginAdmin.data._id);
      if (already_login.flag !== 1) {
         delete req.session.admin
         res.redirect("/admin/login");
         return;
      }
   }
   is_login = 1;
   loginAdmin = loginAdmin;
   if (!req.session) {
      return res.render("404", {
         header: { title: 404 },
         layout: "./layouts/common-layout",
      });
   }

   next();
};
