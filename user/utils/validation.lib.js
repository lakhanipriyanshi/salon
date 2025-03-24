var Validator = require("validatorjs");
const { error_res, success_res } = require("./general.lib");

const valiadate_rules = {
   user: {
      register:{
         username:"required",
         password:"required",
         gender:"required",
         mobileno:"required",
         email:"required|email",
         
      },
      login: {
         password: "required",
         email: "required|email",
      },
      otpverification:{
         email:"required|email",
         otp:"required",
      },
      forgot:{
         email:"required|email",
         newpassword:"required",
         confirmpassword:"required",
      },
      bookappoinment:{
         servicename:"required",
         barbername:"required",
         bookdate:"required",
      },
      contact:{
         name:"required",
         email:"required|email",
         subject:"required",
         message:"required",
      },
      profile:{
         username:"string",
         mobileno:"numeric",
         gender:"string",
         img:"array",
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
