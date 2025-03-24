var Validator = require("validatorjs");
const { error_res, success_res } = require("./general.lib");

const valiadate_rules = {
   admin: {
      login: {
         password: "required",
         email: "required|email",
      },
      forgot_password: {
         new_password: "required|min:6",  
         old_password: "required",
      },
      add_service:{
         servicename: "required",
         description: "required",
         price:"required",
      },
      update_service:{
         servicename:"string",
         description:"string",
         price:"string",
         img:"array",
      },
      add_barber:{
         name: "required",
         barbar_type: "required",
      },
      update_barber:{
         name:"string",
         barbar_type:"string",
         img:"array"
      },
      add_user:{
         username:"required",
         password:"required",
         email:"required",
         mobileno:"required",
         gender:"required",
      },
      update_user:{
         username:"string",
         mobileno:"numeric",
         gender:"string",
         img:"array",
      },
      update_user_status:{
         status:"required|numeric"
      },
      add_category:{
         categorytype:"required",
         status:"required",
      },
      update_category_status:{
         status: "numeric",
      },
      update_bookstatus:{
        status:"numeric",
      }
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
