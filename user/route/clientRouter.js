const express = require("express");
const User = require("../model/User");
const about = require("../model/about");
const service = require("../model/service");
const barbar = require("../model/barbar");
const gallery = require("../model/gallery");
const contact = require("../model/contact");
const otpmodel = require("../model/otpmodel");
const appoinmentbook = require("../model/appoinmentbook");
const notification = require("../model/notification");
const router = express.Router();
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const { request } = require("http");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
const session = require("express-session");
var validator = require("email-validator");
var nodemailer = require("nodemailer");
const { category } = require("../model/category");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/sendmail");
const ejs = require("ejs");
const Constants = require("../config/constant");
const { verifyToken,generateOtp,shownotifications } = require("../lib/general.lib");
require("dotenv").config();
let jwtSecretKey = process.env.JWT_SECRET_KEY;
//image upload

let index = 1;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'user_images') {
      cb(null, 'public/uploads/user_images');
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + index + "-test.jpg");
    index++;
  },
});



//Define maximum fileupload size(1 mb)
const maxSize = 1 * 1000 * 1000;
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).fields([{ name: 'user_images'}]); // Adjust maxCount as necessary

// GET
// Register Page
router.get("/register", (req, res) => {
  res.render("Register");
});

// otp verification
router.get("/otpverfication", (req, res) => {
  res.render("otpverfication");
});

// login
router.get("/login", (req, res) => {
  res.render("Login", {
    header: { title: "Login Page" },
    //footer: { js: "main.js" },
  });
});

//logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/home");
    } else {
      res.clearCookie("sid");
      res.redirect("/");
    }
  });
});

//home page verify token
router.get("/home", verifyToken, async (req, res) => {
  // console.log("req.user------->", req.user);
  let userId = req.userId;
  let userImage = req.user.img[0];
  //  console.log("userImage------->", userImage);

  const aboutList = await about.find({});
  const servicelist = await service.find({});
  const barbarlist = await barbar.find({});
  const users = await User.find({});
  const notificationDetails = await shownotifications(userId); 

  const data = {
    about: aboutList[0],
    services: servicelist,
    barbars: barbarlist,
    user: users,
    userImage: userImage,
    notification: notificationDetails
  };

  res.render("Home", {
    data: data,
    user: req.session.email,
  });
});

router.get("/about", verifyToken, async (req, res) => {
  let userId = req.userId;
  let userImage = req.user.img[0];
  const aboutList = await about.find({});  
  const notificationDetails = await shownotifications(userId); 
  const data = {
    about: aboutList[0],
    userImage: userImage,
    notification: notificationDetails
  };
  res.render("about", { data: data });
});

router.get("/service", verifyToken, async (req, res) => {
  let userId = req.userId;
  let userImage = req.user.img[0];
  const servicelist = await service.find({});  
  const notificationDetails = await shownotifications(userId); 
  const data = {
    services: servicelist,
    userImage: userImage,
    notification: notificationDetails
  };
  res.render("service", { data: data, user: req.session.email });
});

router.get("/price", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  
  const notificationDetails = await shownotifications(userId); 
  const servicelist = await service.find({});
  const data = {
    services: servicelist,
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("price", { data: data });
});

router.get("/barber", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const barbarlist = await barbar.find({});
  const data = {
    barbars: barbarlist,
    userImage: userImage,    
    notification: notificationDetails,
  };
  res.render("barber", { data: data });
});

router.get("/contact", verifyToken, async(req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("contact", { data: data });
});

router.get("/blog", verifyToken,async(req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("blog", { data: data });
});

router.get("/singleservice/:sId", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const sId = req.params.sId;
  const notificationDetails = await shownotifications(userId); 
  let data1 = await service.findOne({ _id: new ObjectId(sId) });
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("singleservice", { data1: data1, data: data });
});

router.get("/singlebarber/:barbarId", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const barbarId = req.params.barbarId;
  const notificationDetails = await shownotifications(userId); 
  const data1 = await barbar.findOne({ _id: new ObjectId(barbarId) });
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("singlebarber", { data1: data1, data: data });
});

router.get("/single", verifyToken, async(req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  res.render("single", { data: data });
});

router.get("/profile", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const notificationDetails = await shownotifications(userId); 
    const data = {
      userImage: userImage,
      notification: notificationDetails,
    };
    res.render("profile", { user, data: data });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Server error");
  }
});

router.get("/book-appoinment", verifyToken, async (req, res) => {
  let userImage = req.user.img[0];
  let userId = req.userId;
  try {
    let categorylist = await category.find({});
    let barbarlist = await barbar.find({});
    let servicelist = await service.find({});
    const notificationDetails = await shownotifications(userId); 
    const data = {
      category: categorylist,
      services: servicelist,
      barbar: barbarlist,
      userImage:userImage,
      notification: notificationDetails,
    };
    return res.render("book-appoinment", { data: data });
  } catch (error) {
    return res.status(500).send("server error", error);
  }
});

router.get("/gallery", verifyToken, async (req, res) => {
  const categoryId = req.params.categoryId;
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  let userImage = req.user.img[0];
  let filter = {};
  if (categoryId) {
    filter["categorytype"] = categoryId;
  }

  try {
    const galleries = await gallery.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categorytype",
          foreignField: "_id",
          as: "gallerydocument",
          pipeline: [
            {
              $match: {
                status: Constants?.CATEGORY_STATUS?.ACTIVE,
              },
            },
            {
              $project: {
                img: 1,
                categorytype: 1,
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$gallerydocument",
          preserveNullAndEmptyArrays: false,
        },
      },
    ]);
    return res.render("gallery", { data: { galleries,userImage: userImage ,  notification: notificationDetails, }});
  } catch (error) {
    console.error("Error fetching gallery:", error.message);
    return res.status(500).json({ message: "Error fetching gallery" });
  }
});


router.get("/forgot", async (req, res) => {
  console.log("getgforgot--------------------------------------0");
  res.render("forgot");
});

router.post("/gallery/:categoryId", async (req, res) => {
  console.log("categoryId----------", req.body);
  try {
    const categoryId = req.body.categoryId;
    let filter = {};

    if (categoryId) {
      filter["categorytype"] = new ObjectId(categoryId);
    }

    const galleries = await gallery.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categorytype",
          foreignField: "_id",
          pipeline: [
            { $match: { $expr: { $eq: ["$status", Constants?.CATEGORY_STATUS?.ACTIVE] } } },
            {
              $project: {
                img: 1,
                categorytype: 1,
                _id: 1,
              },
            },
          ],
          as: "gallerydocument",
        },
      },
      {
        $unwind: {
          path: "$gallerydocument",
          preserveNullAndEmptyArrays: false,
        },
      },
    ]);
    const html = await ejs.renderFile("views/galleryview.ejs", {
      data: { galleries },
    });
    return res.json({ html });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Error fetch gallery" });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const email = req.body.email;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        isSuccess: false,
        message: `email "${email}"not found.`,
      });
    }
    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        isSuccess: false,
        message: "new password and confirm password must match",
      });
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashpassword;

    // user.password = newpassword;
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully redirct login page",
    });
  } catch (error) {
    console.error("Error  forgot password", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/image_upload", function (req, res, next) {
  let imageArray;
  upload(req, res, function (err) {
    if (err) {
      // Handle upload errors
      return res.status(400).send({ error: err.message });
    } else {
      // Success response
      imageArray = req.files;
      return res.send("Success: Image uploaded!");
    }
  });
});
// POST


//register
router.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const gender = req.body.gender;

    const existingemail = await User.findOne({ email });
    if (existingemail) {
      return res.status(400).json({
        isSuccess: false,
        message: `The email "${email}" is already taken. Please choose a different one.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
      mobileno: mobileno,
      gender: gender,
    });

    console.log("user created------------", newUser);

    const otp = generateOtp();

    const otpgenerate = await otpmodel.create({
      userid: newUser._id,
      email: email,
      otp: otp,
    });

    console.log("otp created successfully----------------------------------",otpgenerate);

    var mailOptions = {
      from: '"SalonSync" <Salonsync6964@gmail.com>',
      to: email,
      subject: "Verify Otp",
      html: `<p>Your OTP is: ${otp}</p>`,
    };

    const mailinfo = await mailSender(mailOptions);
    console.log("Email sent successfully------", mailinfo);

    return res
      .status(201)
      .json({ isSuccess: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error user:", error);
    res.status(500).json({ isSuccess: false, error: "Internal server error" });
  }
});

router.post("/otpverfication", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const existingemail = await otpmodel.findOne({ email: email });
    if (!existingemail) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Email is not registered" });
    }

    console.log("email----------------------------", existingemail);

    if (existingemail.otp !== otp) {
      return res
        .status(200)
        .json({ isSuccess: false, message: "Incorrect OTP" });
    }

    console.log("email otp----------------------------", existingemail.otp);
    //isVery updated
    const userupdate = await User.findOneAndUpdate(
      { email: email },
      {
        isVery : Constants?.USER_STATUS?.SUCCESS
      },
      { new: true }
    );
    console.log("user update", userupdate);
    return res
      .status(200)
      .json({ isSuccess: true, message: "otp verfication successful" });
  } catch (error) {
    console.error("Error otpverfication:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (user.isVery === Constants?.USER_STATUS?.PENDING) {
        return res.status(200).json({
          message: "Please First Otp Verification process Complete",
          isVery: Constants?.USER_STATUS?.PENDING,
          isSuccess: false,
        });
      } else if (user.isVery === Constants?.USER_STATUS?.REJECTED) {
        return res.status(400).json({
          message: "Login Rejected.Please contact admin.",
          isVery: Constants?.USER_STATUS?.REJECTED,
          isSuccess: false,
        });
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isPasswordMatch) {
        const payload = {
          email: user.email,
          _id: user._id,
        };

        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
        console.log(" Genratedtoken------------------", token);
        req.session.user = user;
        req.session.token = token;

        req.session.email = user.email;
        req.session.userId = user._id;

        return res
          .status(200)
          .json({ message: "Login successful", isVery: Constants?.USER_STATUS?.SUCCESS, isSuccess: true });
      } else {
        return res
          .status(400)
          .json({ isSuccess: false, isVery: 0, message: "Incorrect password" });
      }
    } else {
      return res.status(400).json({
        message: "Invalid email or password",
        isSuccess: false,
        isVery: 0,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ isSuccess: false, error: "An internal server error occurred" });
  }
});


//about
router.post("/about/save", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: err.message });
    } else {
      let bodyData = req.body;
      let imageArray = [];
      if (req.files.length > 0) {
        req.files.forEach((element) => {
          let filePath = element.destination + "/" + element.originalname;
          imageArray.push(filePath);
        });
      }

      const About = await about.create({
        img: imageArray,
        experince: req.body.experince,
        description: req.body.description,
        expertname: req.body.expertname,
      });
      return res.status(200).json({ message: "about sucessfully" });
    }
  });
});
router.post("/book-appoinment", async (req, res) => {
  try {
    const userId = req.session.userId;
    const servicename = req.body.servicename;
    const barbername = req.body.barbername;
    const bookdate = req.body.bookdate;
  
    if(!bookdate){
    return res.status(400).json({ message: "book date is required" });
    }
    // console.log('requestbody---------------------------------------------',req.body);
    // console.log("Bookdate------------------------:", bookdate);
    // console.log("userId------------------------:", userId);
 
    const bookAppointment = await appoinmentbook.create({
      userId,
      servicename,
      barbername,
      bookdate,
      status:Constants?.BOOKING_APPOINMENT?.PENDING
    });

    // console.log('bookappoinment---------------------------------------------',bookAppointment);
    const user = await User.findById(userId); 

    const createnotification = await notification.create({
            userId,
            title: "Book Appointment",
            description: `This Request for appionmentment Booking by ${user.username}.`,
            notificationType :Constants?.NOTIFICATION_TYPE?.BOOK,
            is_admin:true,
          });
          // console.log('createnotification---------------------------------------------',createnotification);

    return res
      .status(200)
      .json({ message: "request to bookAppointment success",success: true });
 } catch (error) {
    console.error('server error',error);
    return res.status(500).json({ message: "server error" });
  }
});

router.post("/about/list", async (req, res) => {
  try {
    const aboutList = await about.find({});
    return res
      .status(200)
      .json({ message: "List sucessfully", data: aboutList });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/about/update", async (req, res) => {
  upload(req, res, async function (err) {
    try {
      const aboutId = req.body.aboutId;
      if (!aboutId) {
        return res.status(400).json({ message: "ID is required" });
      }
      let imageArray = [];
      if (req.files.length > 0) {
        req.files.forEach((element) => {
          let filePath = element.destination + "/" + element.originalname;
          imageArray.push(filePath);
        });
      }
      const aboutupdate = await about.findOneAndUpdate(
        {
          _id: aboutId,
        },
        {
          $set: {
            img: imageArray,
            experince: req.body.experince,
            description: req.body.description,
            expertname: req.body.expertname,
          },
        },
        {
          returnDocument: "after",
        }
      );

      return res
        .status(200)
        .json({ message: " about Updated", updateData: aboutupdate });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
});

router.post("/about/delete", async (req, res) => {
  try {
    const aboutId = req.body.aboutId;

    let checkData = await about.findOne(
      { _id: new ObjectId(aboutId) },
      { _id: 1 }
    );
    if (!checkData) {
      return res.status(400).json({ message: "Invalid About Id" });
    }

    const aboutdelete = await about.findByIdAndDelete({
      _id: new ObjectId(aboutId),
    });
    return res.status(200).json({ message: "Data deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/about/singleData", async (req, res) => {
  try {
    const Id = req.body.Id;
    let data = await about.findOne({ _id: new ObjectId(Id) });
    if (data) {
      return res.status(200).json({ message: "Success", data });
    } else {
      return res.status(400).json({ message: "Inavlid Id" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/service/save", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    //let bodyDatas = req.body;
    let imageArray = [];
    if (req.files.length > 0) {
      req.files.forEach((element) => {
        let filePath = element.destination + "/" + element.originalname;
        imageArray.push(filePath);
      });
    }
    const Service = await service.create({
      img: imageArray,
      servicename: req.body.servicename,
      description: req.body.description,
      price: req.body.price,
    });

    return res.status(200).json({ message: "service sucessfully" });
  });
});

router.post("/service/list", async (req, res) => {
  try {
    const servicelist = await service.find({});
    res.status(200).json({ message: "service", data: servicelist });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/service/update", async (req, res) => {
  upload(req, res, async function (err) {
    try {
      const serviceId = req.body.serviceId;
      if (!serviceId) {
        return res.status(400).json({ message: "Service ID is required" });
      }
      let imageArray = [];
      if (req.files.length > 0) {
        req.files.forEach((element) => {
          let filePath = element.destination + "/" + element.originalname;
          imageArray.push(filePath);
        });
      }
      const serviceupdate = await service.findOneAndUpdate(
        {
          _id: serviceId,
        },
        {
          $set: {
            img: imageArray,
            servicename: req.body.servicename,
            description: req.body.description,
            price: req.body.price,
          },
        },

        {
          returnDocument: "after",
        }
      );
      return res
        .status(200)
        .json({ message: "service Updated", updateData: serviceupdate });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
});

router.post("/service/delete", async (req, res) => {
  try {
    const serviceId = req.body.serviceId;
    let checkDatas = await service.findOne(
      {
        _id: new ObjectId(serviceId),
      },
      { _id: 1 }
    );
    if (!checkDatas) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    const servicedelete = await service.findByIdAndDelete({
      _id: new ObjectId(serviceId),
    });
    return res.status(200).json({ message: "service deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/singleservice/singleData", async (req, res) => {
  try {
    const sId = req.body.sId;
    let sData = await service.findOne({ _id: new ObjectId(sId) });
    if (sData) {
      return res.status(200).json({ message: "sucess", sData });
    } else {
      return res.status(400).json({ message: "Invalid ID " });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/barbar/save", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    let imageArray = [];
    if (req.files.length > 0) {
      req.files.forEach((file) => {
        imageArray.push(file.path);
      });
    }

    const Barbar = await barbar.create({
      img: imageArray,
      name: req.body.name,
      barbar_type: req.body.barbar_type,
    });
    return res.status(200).json({ message: "barbar added successfully" });
  });
});

router.post("/barbar/list", async (req, res) => {
  try {
    const barbarlist = await barbar.find({});
    res.status(200).json({ message: "barbar", data: barbarlist });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/barbar/update", async (req, res) => {
  upload(req, res, async function (err) {
    try {
      const barbarId = req.body.barbarId;
      if (!barbarId) {
        return res.status(400).json({ message: "barbar id required" });
      }
      let imageArray = [];
      if (req.files.length > 0) {
        req.files.forEach((file) => {
          imageArray.push(file.path);
        });
      }
      const barbarupdate = await barbar.findByIdAndUpdate(
        {
          _id: barbarId,
        },
        {
          $set: {
            img: imageArray,
            name: req.body.name,
            barbar_type: req.body.barbar_type,
          },
        },
        {
          returnDocument: "after",
        }
      );
      return res
        .status(200)
        .json({ message: "barbar updated successfully", barbarupdate });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  });
});

router.post("/barbar/delete", async (req, res) => {
  try {
    const barbarId = req.body.barbarId;
    let checkData = await barbar.findOne(
      {
        _id: new ObjectId(barbarId),
      },
      {
        _id: 1,
      }
    );
    if (!checkData) {
      return res.status(400).json({ message: "Invalid barbarId" });
    }
    const deleteData = await barbar.findByIdAndDelete({
      _id: new ObjectId(barbarId),
    });
    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/barbar/singleData", async (req, res) => {
  try {
    const barbarId = req.body.barbarId;
    const bdata = await barbar.findOne({ _id: new ObjectId(barbarId) });
    if (bdata) {
      return res
        .status(200)
        .json({ message: "data successfully display", bdata });
    } else {
      return res.status(400).json({ message: "Invalid id" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/gallery/save", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      let imageArray = [];
      if (req.files.length > 0) {
        req.files.forEach((file) => {
          imageArray.push(file.path);
        });
      }
      const Gallery = await gallery.create({
        img: imageArray,
        type: req.body.type,
      });
      return res.status(200).json({ message: "Data Added successfully" });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/gallery/list", async (req, res) => {
  try {
    const list = await gallery.find({});
    return res.status(200).json({ message: "gallery", list });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/contact/save", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    const Contact = await contact.create({
      name,
      email,
      subject,
      message,
    });
    res.status(200).json({ message: "Data added successfully!" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to save the contact data. Please try again later.",
    });
  }
});

router.post("/profile", async (req, res) => {
  console.log("profile----------");
  upload(req, res, async function (err) {
    try {
      const userId = req.session.user._id;
      if (!userId) {
        return res.status(404).json({ message: "User id is required" });
      }
      let update_object = {};

      if (req.body.username) {
        update_object["username"] = req.body.username;
      }
      if (req.body.mobileno) {
        update_object["mobileno"] = req.body.mobileno;
      }
      if (req.body.gender) {
        update_object["gender"] = req.body.gender;
      }
      
      let imageArray = [];      
      if(req.files.user_images){
        req.files.user_images.forEach((file) => {
          imageArray.push(`http://localhost:3002/uploads/user_images/${file.filename}`);
        });
      }
      if (imageArray.length > 0) {
        update_object["img"] = imageArray;
      }

      const userupdate = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        { $set: update_object },
        { new: true }
      );
      if (!userupdate) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
});

router.post("/sendmail", function (req, res) {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  async function main() {
    try {
      const info = await transporter.sendMail({
        from: '"Barber Shop" <fofije6963@suggets.com>',
        to: email,
        subject: "Welcome",
        text: "Thank you for visiting our website.",
        html: "<b>Hello, Thank You!</b>",
      });
      res.json({ message: "Email sent successfully to " + email });
    } catch (error) {
      console.error("Error:", error.message || error);
      res
        .status(500)
        .json({ message: "Failed to send email. Please try again later." });
    }
  }

  main();
});



// router.post("/shownotification") , async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const username = req.body.username;
//     const notificationType = req.body.notificationType;
//     const description = req.body.description;
//     const title = req.body.title;

//     const user = await User.find(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "userId not found", isSuccess: false });
//     }

//     console.log("requesting body--------------------", req.body);

//     const createnotification = await notification.create({
//       title: "Book Appointment",
//       description: `"This Request for appionmentment Booking by" ${username}.`,
//       notificationType :Constants?.NOTIFICATION_TYPE?.BOOK,
//       userId,
//       is_admin: true,
//     });

//     console.log("created notification------------------------",createnotification);
//     return res
//       .status(200)
//       .json({
//         message: "success notification created",
//         isSuccess: true,
//         createnotification,
//       });
//   } catch (error) {
//     return res.status(500).json({ message: "server error", isSuccess: false });
//   }
// };

module.exports = router;
