
const jwt = require("jsonwebtoken");
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const User = require("../model/User");
const {error_res}=require("../utils/general.lib")

module.exports = function(req, res, next) {
  
  const token = req.session.token || req.headers["authorization"];

  if (!token) {
    console.log("No token provided");
    return res.redirect("/client/login");
  }

  jwt.verify(token, jwtSecretKey, async (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.redirect("/client/login");
    }

    let userDetails = await User.findById(decoded?._id);

    req.userId = userDetails?._id;
    req.user = userDetails;
    next();
  });
}

