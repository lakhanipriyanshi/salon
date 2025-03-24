const express = require("express");
const userAuth = require("../middleware/userAuth.middleware");
const {
  getregister,
  getotpverification,
  getlogin,
  getlogout,
  gethome,
  getabout,
  getservice,
  getprice,
  getbarber,
  getcontact,
  getblog,
  getsingleservice,
  getsinglebarber,
  getsingle,
  getprofile,
  getbookappoinment,
  getgallery,
  getforgot,

  postgallery,
  postforgot,
  postregister,
  postotpverfication,
  postlogin,  
  postbookappoinment,
  postcontact,
  postprofile,
  postsendmail,
} = require("../controllers/user.controller");

const router = express.Router();

// GET
router.get("/register", getregister);
router.get("/otpverfication", getotpverification);
router.get("/login", getlogin);
router.get("/forgot", getforgot);

router.get("/home", userAuth, gethome);
router.get("/about", userAuth, getabout);
router.get("/service", userAuth, getservice);
router.get("/price", userAuth, getprice);
router.get("/barber", userAuth, getbarber);
router.get("/blog", userAuth, getblog);
router.get("/contact", userAuth, getcontact);
router.get("/singleservice/:sId", userAuth, getsingleservice);
router.get("/singlebarber/:barbarId", userAuth, getsinglebarber);
router.get("/single", userAuth, getsingle);
router.get("/profile", userAuth, getprofile);
router.get("/book-appoinment", userAuth, getbookappoinment);
router.get("/gallery", userAuth, getgallery);
router.get("/logout",userAuth, getlogout);

// POST
router.post("/register", postregister);
router.post("/otpverfication", postotpverfication);
router.post("/login", postlogin);
router.post("/forgot", postforgot);

router.post("/gallery/:categoryId",userAuth, postgallery);
router.post("/book-appoinment",userAuth, postbookappoinment);
router.post("/contact/save",userAuth, postcontact);
router.post("/profile",userAuth, postprofile);
router.post("/sendmail",userAuth, postsendmail);

module.exports = router;
