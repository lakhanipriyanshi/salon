const express = require("express");
const adminAuth = require("../middleware/adminAuth.middleware");

const {
  getLogin,
  getDashboard,
  getUser,
  getUpdateUser,
  getabout,
  getservice,
  getBarber,
  getbookappoinment,
  getaddservice,
  getaddbarber,
 
  getsetting,
  getcategory,
  getaddcategory,
  getupdateservice,
  getgallery,
  getaddgallery,
  getupdatebarber,
  getupdateabout,
  getlogout,
  getadduser, 
  getupdateuserstatus,
  postLogin,
  postupdateabout,
  postaddservice,
  postaddbarber,  
  postdeleteservice,
  postdeletebarber,
  postdeletecategory,
  postupdateservice,
  postupdatebarber,
  postaddcategory,
  postupdatestatus,
  postaddgallery,
  postsetting,
  postupdateuser,
  postdeleteuser,
  postadduser,
  postupdateuserstatus,
  postbookappoinmentupdatestatus,
} = require("../controllers/admin.controller");
const { generateAuthToken } = require("../service/adminToken");

const router = express.Router();

// GET
router.get("/login", getLogin);
router.get("/dashboard", adminAuth, getDashboard);
router.get("/user", adminAuth, getUser);
router.get("/updateuser/:id", adminAuth, getUpdateUser);
router.get("/updateuserstatus/:id", adminAuth, getupdateuserstatus);
router.get("/adduser",adminAuth, getadduser);
router.get("/service", adminAuth, getservice);
router.get("/addservice", adminAuth, getaddservice);
router.get("/updateservice/:id", adminAuth, getupdateservice);
router.get("/barber", adminAuth, getBarber);
router.get("/addbarber", adminAuth, getaddbarber);
router.get("/updatebarber/:id", adminAuth, getupdatebarber);
router.get("/about", adminAuth, getabout);
router.get("/updateabout/:id", adminAuth, getupdateabout);
router.get("/category", adminAuth, getcategory);
router.get("/addcategory", adminAuth, getaddcategory);
router.get("/gallery", adminAuth, getgallery);
router.get("/addgallery", adminAuth, getaddgallery);
router.get("/setting", adminAuth, getsetting);
router.get("/book-appoinment",adminAuth,getbookappoinment);
router.get("/logout", getlogout);

//POST
router.post("/login", postLogin);

router.post("/adduser", adminAuth, postadduser);
router.post("/updateuser/:id", adminAuth, postupdateuser);
router.post("/updateuserstatus/:id", adminAuth, postupdateuserstatus);
router.post("/deleteuser/:id",adminAuth, postdeleteuser);

router.post("/addservice", adminAuth, postaddservice);
router.post("/deleteservice/:id", adminAuth, postdeleteservice);
router.post("/updateservice/:id", adminAuth, postupdateservice);

router.post("/addbarber", adminAuth, postaddbarber);
router.post("/updatebarber/:id", adminAuth, postupdatebarber);
router.post("/deletebarber/:id", adminAuth, postdeletebarber);

router.post("/updateabout/:id", adminAuth, postupdateabout);

router.post("/addcategory", adminAuth, postaddcategory);
router.post("/deletecategory/:id",adminAuth, postdeletecategory);
router.post("/updatestatus", adminAuth, postupdatestatus);

router.post("/addgallery", adminAuth, postaddgallery);
router.post("/setting/:id", adminAuth, postsetting);
router.post("/updatebookstatus/:id",adminAuth,postbookappoinmentupdatestatus);

module.exports = router;
