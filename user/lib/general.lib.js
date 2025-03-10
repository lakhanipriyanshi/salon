
const jwt = require("jsonwebtoken");
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const User = require("../model/User");
const notification = require("../model/notification");
//verify Token

const verifyToken = function(req, res, next) {
  // console.log("Request headers:", req.headers);
  const token = req.session.token || req.headers["authorization"];

  //  console.log("Token ------------------:", token);

  if (!token) {
    console.log("No token provided");
    return res.redirect("/client/login");
  }

  jwt.verify(token, jwtSecretKey, async (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(401).json({ error: "Invalid token" });
    }

    //  console.log("Decoded token:", decoded);
    //console.log("Decoded id:", decoded?._id);

    let userDetails = await User.findById(decoded?._id);
    //console.log("userDetails id:", userDetails);

    req.userId = userDetails?._id;
    req.user = userDetails;
    next();
  });
}


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
    verifyToken,
    generateOtp,
    shownotifications,
}