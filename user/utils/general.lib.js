const { default: axios } = require("axios");
const notification = require("../model/notification");

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

const log1 = (msg) => {
  const d = new Date();
  console.log("[" + d.toLocaleString() + " " + d.getMilliseconds() + "] :", msg);
};


const generateOtp = function(length = 4) {
  let otp = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}


const formatDate = function(date){
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth()+1).padStart(2,'0');
  const day = String(date.getUTCDate()).padStart(2,'0');
  return `${day}/${month}/${year}`;
}


//shownotification 
const shownotifications =  async function(userId){
  const shownotification = await notification.aggregate([
    {
      $match:{  
        userId:userId,
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
        createdAt:1,
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


module.exports = {
  error_res,
  success_res,
  log1,
  generateOtp,
  shownotifications,
};