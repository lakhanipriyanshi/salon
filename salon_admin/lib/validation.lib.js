var Validator = require("validatorjs");
const { error_res, success_res } = require("./general.lib");

const valiadate_rules = {
   admin: {
      login: {
         password: "required",
         email: "required|email",
      },
      change_password: {
         new_password: "required|min:6",  
         old_password: "required",
      },
   },
};

/**
 * this function is validate the validation rlues
 */
const custom_validation = (data, rules, customMessages = {}) => {
   let validation = new Validator(data, get_rules(rules), customMessages);

   if (validation.fails()) {
      let error = "";
      for (let key in validation.errors.errors) {
         error = validation.errors.errors[key][0];
      }
      return error_res(error);
   }
   return success_res("Success");
};

const get_rules = (rules) => {
   let rule = rules.split(".");
   return valiadate_rules[rule[0]][rule[1]];
};

module.exports = {
   get_rules,
   custom_validation,
};
