const { default: axios } = require("axios");
const {notification} = require("../models/notification.model");
const {User} = require("../models/user.model");
const{appoinmentbook}= require("../models/appoinmentbook.model")
const error_res = (msg = "", data = {}) => {
  var res = { status: 400, flag: 0 };
  res.msg = msg.length == 0 ? "Error" : msg;
  res.data = data;
  return res;
};

const success_res = (msg = "", data = {}) => {
  var res = { status: 200, flag: 1 };
  res.msg = msg.length == 0 ? "Success" : msg;
  res.data = data;
  return res;
};

const validation_res = (msg = "", data = {}) => {
  var res = { flag: 2 };
  res.msg = msg.length == 0 ? "Validation Error" : msg;
  res.data = data;
  return res;
};

const info_res = (msg = "", data = {}) => {
  var res = { flag: 3 };
  res.msg = msg.length == 0 ? "Info" : msg;
  res.data = data;
  return res;
};

const in_valid_res = (msg = "", data = {}) => {
  var res = { status: 404, flag: 4 };
  res.msg = msg.length == 0 ? "In Valid Error" : msg;
  res.data = data;
  return res;
};

const auth_error = (msg = "", data = {}) => {
  var res = { flag: 8 };
  res.msg = msg.length == 0 ? "Unauthorized Token" : msg;
  res.data = data;
  return res;
};

const maintenance_error = (msg = "") => {
  var res = { flag: 9 };
  res.msg = msg.length == 0 ? "Service unavailable due to maintenance" : msg;
  return res;
};

const log1 = (msg) => {
  const d = new Date();
  console.log("[" + d.toLocaleString() + " " + d.getMilliseconds() + "] :", msg);
};



//bookdate Format function  
const formatDateTime = function(date){
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth()+1).padStart(2,'0');
  const day = String(date.getUTCDate()).padStart(2,'0');
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2,'0');
  const ampm  =  hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12||12;
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}


const formatDate = function(date){
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth()+1).padStart(2,'0');
  const day = String(date.getUTCDate()).padStart(2,'0');
  return `${day}/${month}/${year}`;
}


//shownotification 
const shownotifications =  async function(){
  const shownotification = await notification.aggregate([
    {
      $match:{
        is_admin: true,
      },
    },
    {
      $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"userInformation"
      },
    },
    {
      $unwind: {
        path: "$userInformation",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        img:"$userInformation.img",
        title:1,
        description:1, 
        createdAt: 1, 
      
      },
    },
    {
      $sort:{
        _id:-1,
      }
    }
]);
  shownotification.forEach(notification=>{
    notification.createdAt = formatDate(notification.createdAt);
  });
  return shownotification; 
}


const ip2location = async (ip) => {
  let data = {
     country_name: 'Not Found',
  };
  let res;

  if (process.env.APP_ENV == 'local') {
     res = error_res("", data);
     return res;
  }
  try {
     let url = `http://www.geoplugin.net/json.gp?ip=${ip}`;
     let response = await axios.get(url, { headers: { Accept: 'application/json' } });

     let location = response.data;

     data.country_name = location.geoplugin_countryName;
     data.country_code = location.geoplugin_countryCode;
     data.city = location.geoplugin_city;
     data.region = location.geoplugin_region;
     data.lat = location.geoplugin_latitude;
     data.long = location.geoplugin_longitude;

     res = success_res("", data);
  } catch (error) {
     console.error(error, 'error');
     res = error_res("", data);
  }

  return res;
};

module.exports = {
  error_res,
  success_res,
  validation_res,
  info_res,
  in_valid_res,
  auth_error,
  maintenance_error,
  log1,
  ip2location,
  formatDateTime,
  shownotifications,
};