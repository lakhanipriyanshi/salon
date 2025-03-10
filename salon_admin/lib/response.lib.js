const Constants = require("../config/constant");
const { success_res, error_res } = require("./general.lib");

const response_rules = {
  admin: {
    get_rating_details: {
      id: "id",
      user_id: "user_id",
      attorney_id: "attorney_id",
      rating: "rating",
      description: "description",
    },
  },
};

const createResponse = (type, msg = "", data = {}, rules_key) => {
  if(type === undefined) return error_res("Please enter response type");

  let result;
  if(rules_key) {
    let rule = rules_key.split(".");  
    const rules = response_rules[rule[0]][rule[1]];

    if(Array.isArray(data) && data.length > 0) {
      let arrayList = data.map(item => {
        const newObject = {};
        for (const key in rules) {
          newObject[key] = item[rules[key]];
        }
        return newObject;
      });
      result = arrayList;
    } else {
      let rule_result = {};
      for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
          const dataKey = rules[key];
          rule_result[key] = data[dataKey];
        }
      }
      result = rule_result;
    }
  } else {
    result = data;
  }  

  let response = success_res(msg, result);
  if(type == Constants.RESPONSE_TYPE.ERROR){
      response = error_res(msg, result);
  };

  return response;
}

const createFilterResponse = (data = [], rules_key) => {
  if(data.length === 0 || Object.keys(data).length === 0){
    return data;
  };

  let result;
  if(rules_key) {
    let rule = rules_key.split(".");  
    const rules = response_rules[rule[0]][rule[1]];

    if(Array.isArray(data) && data.length > 0) {
      let arrayList = data.map(item => {
        const newObject = {};
        for (const key in rules) {
          newObject[key] = item[rules[key]];
        }
        return newObject;
      });
      result = arrayList;
    } else {
      let rule_result = {};
      for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
          const dataKey = rules[key];
          rule_result[key] = data[dataKey];
        }
      }
      result = rule_result;
    }
  } else {
    result = data;
  }

  return result;
}

module.exports = {
    createResponse,
    createFilterResponse,
 };