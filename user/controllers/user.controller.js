require("dotenv").config();
const ejs = require("ejs");
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const multer = require("multer");
var validator = require("email-validator");
var nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const { ObjectId } = require("mongodb");
const {log1,error_res,success_res,generateOtp,shownotifications } = require("../utils/general.lib");
const mailSender = require("../utils/sendmail");
const {custom_validation} = require("../utils/validation.lib");
const Constants = require("../config/constant");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const about = require("../model/about");
const service = require("../model/service");
const barbar = require("../model/barbar");
const gallery = require("../model/gallery");
const contact = require("../model/contact");
const otpmodel = require("../model/otpmodel");
const appoinmentbook = require("../model/appoinmentbook");
const notification = require("../model/notification");
const category = require("../model/category");

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
}).fields([{ name: 'user_images'}]); 

//GET

const getregister = (req, res) => {
  log1("getregister");
  try{
  res.render("user/Register", { 
    layout: "./layouts/auth-layout",
    header: { title: "Signup Page"},
    footer:{
      js:"register.js"
    },
  });
}catch(error){
  console.error("getregister---------------",error)
  return res.json(error_res("something wrong"));
}
};

const getotpverification = (req, res) => {
  log1("getotpverification");
  try{
  res.render("user/otpverfication", { 
    layout: "./layouts/auth-layout",
    header: { title: "Otpverification Page"},
    footer:{
      js:"otpverification.js"
    },
  });
  }catch(error){
    console.error("getotpverification---------------",error)
    return res.json(error_res("something wrong"));
  }
};

const getlogin = (req, res) => {
  try{
  log1("getlogin");
  return res.render("user/login", { 
    layout: "./layouts/auth-layout",
    header: { title: "Login Page"},
    footer:{
      js:"login.js"
    },
  });
  }catch(error){
    console.error("getlogin---------------",error)
    return res.json(error_res("something wrong"));
}
};

const getlogout =  (req, res) => {
  log1("getlogout");
  try{
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/home");
    } else {
      res.clearCookie("sid");
      res.redirect("/");
    }
  });
}catch(error){
  console.error("getlogout---------------",error)
  return res.json(error_res("something wrong"));
}
};

const gethome =  async (req, res) => {
  log1("gethome");
    try{
      let userId = req.userId;
      let userImage = req.user.img[0];

      const aboutList = await about.find({});
      const servicelist = await service.find({});
      const barbarlist = await barbar.find({});
      const users = await User.find({});
      const notificationDetails = await shownotifications(userId); 

      return res.render("user/home", {  
        layout: "./layouts/user-layout",
        header: {
          notification: notificationDetails,
          pagename:"home",
          userImage,
        },
        data: {
          about: aboutList[0],
          services: servicelist,
          barbars: barbarlist,
          user: users,
        },
        footer: {
          js:"contact.js"
        },
        user: req.session.email,
      });
    }catch(error){
      console.error("gethome---------------",error)
      return res.json(error_res("something wrong"));
  }
};

const getabout =  async (req, res) => {
  log1("getabout");
  try{
  let userId = req.userId;
  let userImage = req.user.img[0];
  const aboutList = await about.find({});  
  const notificationDetails = await shownotifications(userId); 
 
  return res.render("user/about",{  
    layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"about",
      userImage,
    },
    data: { 
      about: aboutList[0],
    },
    footer: {
      js: "about.js",
    },
    user: req.session.email,
  });
}catch(error){
  console.error("getabout---------------",error);
  return res.json(error_res("something wrong"));
}
};

const getservice = async (req, res) => {
  log1("getservice");
  try{
  let userId = req.userId;
  let userImage = req.user.img[0];
  const servicelist = await service.find({});  
  const notificationDetails = await shownotifications(userId); 

  return res.render("user/service", {  
  layout: "./layouts/user-layout",
  header: {
    notification: notificationDetails,
    pagename:"service",
    userImage,
  },
  data: { 
    services: servicelist,
  },
  footer: {
    js: "service.js",
  },
  user: req.session.email,
});
  }catch(error){
    console.error("getservice---------------",error);
    return res.json(error_res("something wrong"));
  }
};

const getprice = async (req, res) => {
  log1("getprice");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  
  const notificationDetails = await shownotifications(userId); 
  const servicelist = await service.find({});
  return res.render("user/price", {  
  layout: "./layouts/user-layout",
  header: {
    notification: notificationDetails,
    pagename:"price",
    userImage,
  },
  data: { 
    services: servicelist,
   },
  footer: {
    js: "price.js",
  },
  user: req.session.email,
});
}catch(error){
  console.error("getprice---------------",error)
  return res.json(error_res("something wrong"));
}
};

const getbarber = async (req, res) => {
  log1("getbarber");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const barbarlist = await barbar.find({});
 return res.render("user/barber", {  
  layout: "./layouts/user-layout",
  header: {
    notification: notificationDetails,
    pagename:"barber",
    userImage,
  },
  data: { 
    barbars: barbarlist,
  },
  footer: {
    js: "barber.js",
  },
  user: req.session.email,
});
}catch(error){
  console.error("getbarber---------------",error)
  return res.json(error_res("something wrong"));
}
};

const getcontact = async(req, res) => {
  log1("getcontact");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  return res.render("user/contact", {  
  layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"contact",
      userImage,
    },
    footer: {
      js: "contact.js",
    },
    user: req.session.email,
  });
}catch(error){
  console.error("getcontact---------------",error)
  return res.json(error_res("something wrong"));
}
};

const getblog = async(req, res) => {
  log1("getblog");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  return res.render("user/blog", {  
    layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"blog",
      userImage,
    },
    footer: {
      js: "blog.js",
    },
    user: req.session.email,
  });
  }catch(error){
    console.error("getblog---------------",error)
    return res.json(error_res("something wrong"));
  }
};

const getsingleservice = async (req, res) => {
  log1("getsingleservice");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const sId = req.params.sId;
  const notificationDetails = await shownotifications(userId); 
  let data1 = await service.findOne({ _id: new ObjectId(sId) });
  return res.render("user/singleservice", {  
    layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"service",
      userImage,
    },
    footer: {
      js: "singleservice.js",
    },
    user: req.session.email,
    data1,
  });
  
}catch(error){
  console.error("getsingleservice---------------",error)
  return res.json(error_res("something wrong"));
}
};

const getsinglebarber = async (req, res) => {
  log1("getsinglebarber");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const barbarId = req.params.barbarId;
  const notificationDetails = await shownotifications(userId); 
  const data1 = await barbar.findOne({ _id: new ObjectId(barbarId) });

  return res.render("user/singlebarber", {  
    layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"barber",
      userImage,
    },
    footer: {
      js: "singlebarber.js",
    },
    user: req.session.email,
    data1,
  }); 
  }catch(error){
    console.error("getsinglebarber---------------",error)
    return res.json(error_res("something wrong"));
}
};

const getsingle = async(req, res) => {
  log1("getsingle");
  try{
  let userImage = req.user.img[0];
  let userId = req.userId;
  const notificationDetails = await shownotifications(userId); 
  const data = {
    userImage: userImage,
    notification: notificationDetails,
  };
  return res.render("user/single", {  
    layout: "./layouts/user-layout",
    header: {
      notification: notificationDetails,
      pagename:"single",
      userImage,
    },
    footer: {
      js: "single.js",
    },
    user: req.session.email,
  });
  }catch(error){
  console.error("getsingle---------------",error)
  return res.json(error_res("something wrong"));
  }
};

const getprofile = async (req, res) => {
  log1("getprofile");
  let userImage = req.user.img[0];
  let userId = req.userId;
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.json(error_res("User not logged in"));
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.json(error_res("User not found"));
    }
    const notificationDetails = await shownotifications(userId); 
    return res.render("user/profile", {  
    layout: "./layouts/user-layout",
      header: {
        notification: notificationDetails,
        pagename:"price",
        userImage,
      },
      footer: {
        js: "profile.js",
      },
      data:{
        userImage
      },
      user: req.session.email,
      user
    });
  }catch(error){
    console.error("getprofile---------------",error)
    return res.json(error_res("something wrong"));
  }
};

const getbookappoinment = async (req, res) => {
  log1("getbookappoinment");
  try {
    let userImage = req.user.img[0];
    let userId = req.userId;
    let categorylist = await category.find({});
    let barbarlist = await barbar.find({});
    let servicelist = await service.find({});
    const notificationDetails = await shownotifications(userId); 
    return res.render("user/book-appoinment", {  
    layout: "./layouts/user-layout",
      header: {
        notification: notificationDetails,
        pagename:"price",
        userImage,
      },
      data: { 
        category: categorylist,
        services: servicelist,
        barbar: barbarlist,
      },
      footer: {
        js: "bookappoinment.js",
      },
      user: req.session.email,
    });
  }catch(error){
    console.error("getbookappoinment---------------",error)
    return res.json(error_res("something wrong"));
  }
};

const getgallery =  async (req, res) => {
  log1("getgallery");
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
    return res.render("user/gallery", {  
    layout: "./layouts/user-layout",
      header: {
        notification: notificationDetails,
        pagename:"gallery",
        userImage,
      },
      data: { 
        galleries,
      },
      footer: {
        js: "gallery.js",
      },
      user: req.session.email,
    });
  } catch (error) {
    console.error("getgallery---------->",error)
    return res.json(error_res("something wrong"));
  }
};

const getforgot =  async (req, res) => {
  log1(getforgot);
  try{
  res.render("user/forgot", { 
    layout: "./layouts/auth-layout",
    header: { title: "Forgot Password Page"},
    footer:{
      js:"forgot.js"
    },
  });
} catch (error) {
  console.error("getforgot---------->",error)
  return res.json(error_res("somethig wrong"));
}
};

//POST

const postgallery = async (req, res) => {
  log1("postgallery");
  try {
    let body = req.body;
    
    const validate = custom_validation(body, "user.profile");
    if (validate.flag != 1) {
      return res.json(validate);
    }

    const categoryId = body.categoryId;
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
    
    const html = await ejs.renderFile("views/user/galleryview.ejs", {
      data: { galleries },
    });

    return res.json({ html });
  } catch (error) {
    console.error("postgallery---------->",error)
    return res.json(error_res("Error fetch gallery" ));
  }
};

const postforgot = async (req, res) => {
  log1("postforgot");
  try {
    let body = req.body;
    const email = body.email;
    const newpassword = body.newpassword;
    const confirmpassword = body.confirmpassword;

    const validate = custom_validation(body, "user.forgot");
    if (validate.flag != 1) {
      return res.json(validate);
    }

    const user = await User.findOne({ email });
    

    if (!user) {
    
      return res.json(error_res(`email "${email}"not found.`));
    }
    if (newpassword !== confirmpassword) {
      return res.json(error_res(
      "new password and confirm password must match",
      ));
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashpassword;

    await user.save();

    return res.json(success_res( "Password has been reset successfully redirct login page"));
  } catch (error) {
    console.error("postforgot------------------>",error)
    return res.json(error_res( "Server error" ));
  }
};

const postregister = async (req, res) => {
  log1("postregister");
  try {
    let body = req.body;

    const validate = custom_validation(body, "user.register");
    if (validate.flag != 1) {
      return res.json(validate);
    }

    const username = body.username;
    const password = body.password;
    const email = body.email;
    const mobileno = body.mobileno;
    const gender = body.gender;

    const existingemail = await User.findOne({ email });
    if (existingemail) {
      return res.json(error_res( `The email "${email}" is already taken. Please choose a different one.` ));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
      mobileno: mobileno,
      gender: gender,
    });

    const otp = generateOtp();

    const otpgenerate = await otpmodel.create({
      userid: newUser._id,
      email: email,
      otp: otp,
    });

    var mailOptions = {
      from: '"SalonSync" <Salonsync6964@gmail.com>',
      to: email,
      subject: "Verify Otp",
      html: `<p>Your OTP is: ${otp}</p>`,
    };

    mailSender(mailOptions);

    return res.json(success_res("User created successfully" ));
  } catch (error) {
    console.error("postregister------>", error);
    return res.json(error_res("Internal server error" ));
  }
};

const postotpverfication = async (req, res) => {
  log1("postotpverfication");
  try {
    let body = req.body;

    const validate = custom_validation(body, "user.otpverification");
    if (validate.flag != 1) {
      return res.json(validate);
    }

    const email = body.email;
    const otp = body.otp;
    const existingemail = await otpmodel.findOne({ email: email });
    if (!existingemail) {
      return res.json(error_res("Email is not registered" ));}

    if (existingemail.otp !== otp) {
      
      return res.json(error_res("Incorrect OTP" ));
    }

    const userupdate = await User.findOneAndUpdate(
      { email: email },
      {
        isVery : Constants?.USER_STATUS?.SUCCESS
      },
      { new: true }
    );
    return res.json(success_res("otp verfication successfuly" ));
  } catch (error) {
    console.error("postotpverfication-------------->",error);
    return res.json(error_res("Internal server error" ));
  }
};

const postlogin =  async (req, res) => {
  log1("postlogin");
  try {
    let body = req.body;
    const validate = custom_validation(body, "user.login");
    if (validate.flag != 1) {
      return res.json(validate);
    }

    const user = await User.findOne({ email: body.email });
  
    if (!user) {
      return res.json(error_res("Invalid email or password",{isVery:0}));

    }
      if (user.isVery === Constants?.USER_STATUS?.PENDING) {
        return res.json(error_res("Please First Otp Verification process Complete",{isVery: Constants?.USER_STATUS?.PENDING }));
     
      }
      if (user.isVery === Constants?.USER_STATUS?.REJECTED) {
        return res.json(error_res("Login Rejected.Please contact admin.",{isVery: Constants?.USER_STATUS?.REJECTED }));

      }
      const isPasswordMatch = await bcrypt.compare(
        body.password,
        user.password
      );
        if(!isPasswordMatch){
          return res.json(error_res("Invalid email or password",{isVery:0}));
        }

      if (isPasswordMatch) {
        const payload = {
          email: user.email,
          _id: user._id,
        };

        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
        req.session.user = user;
        req.session.token = token;

        req.session.email = user.email;
        req.session.userId = user._id;
        return res.json(success_res("Login success.",{isVery: Constants?.USER_STATUS?.SUCCESS }));
     }     
  } catch (error) {
    console.error("postlogin---------->",error);
    return res.json(error_res("An internal server error occurred"));
 }
};

const postbookappoinment = async (req, res) => {
  log1("postbookappoinment");
  try {
    let body = req.body;
    const validate = custom_validation(body, "user.bookappoinment");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const userId = req.session.userId;
    const servicename = body.servicename;
    const barbername = body.barbername;
    const bookdate = body.bookdate;
    
    if(!bookdate){ 
    return res.json(error_res( "book date is required"));  
    }
  
    const bookAppointment = await appoinmentbook.create({
      userId,
      servicename,
      barbername,
      bookdate,
      status:Constants?.BOOKING_APPOINMENT?.PENDING
    });

      const user = await User.findById(userId); 

    const createnotification = await notification.create({
            userId,
            title: "Book Appointment",
            description: `This Request for appionmentment Booking by ${user.username}.`,
            notificationType :Constants?.NOTIFICATION_TYPE?.BOOK,
            is_admin:true,
          });
          
          return res.json(success_res("request to bookAppointment success"));  
   } catch (error) {
    console.error("postbookappoinment-------------->",error);
  return res.json(error_res( "server error"));  
  }
};

const postcontact = async (req, res) => {
  log1("postcontact");
  try {
    let body = req.body;
    const validate = custom_validation(body, "user.bookappoinment");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const { name, email, subject, message } = body;


    if (!validator.validate(email)) {
      return res.json(error_res("Invalid email address." )); 
    }
    const Contact = await contact.create({
      name,
      email,
      subject,
      message,
    });
    return res.json(success_res( "Data added successfully!" )); 
  } catch (err) {
    console.error("postcontact----------->",err);
    return res.json(error_res( "Failed to save the contact data. Please try again later." )); 
  }
};

const postprofile = async (req, res) => {
  log1("postprofile");
  upload(req, res, async function (err) {
    try {
      const userId = req.session.user._id;
      let body = req.body;

      const validate = custom_validation(body, "user.profile");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      const{ username, mobileno, gender } = body;
      
      if (!userId) {
      return res.json(error_res("User id is required" ));
      }
      let update_object = {};

      if (username) {
        update_object["username"] = username;
      }
      if (mobileno) {
        update_object["mobileno"] = mobileno;
      }
      if (gender) {
        update_object["gender"] = gender;
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
        return res.json(error_res("User not found" ));
      }
      return res.json(success_res("Profile updated successfully"));
    } catch (error) {
      console.error("postprofile------------------->",error);
      return res.json(error_res( error.message ));
    }
  });
};

const postsendmail = function (req, res) {
  log1("postsendmail");
  let body = req.body;
  
  const validate = custom_validation(body, "user.profile");
  if (validate.flag != 1) {
    return res.json(validate);
  }

  const email = body.email;

  if (!email) {
    return res.json(error_res("Email is required" ));
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
     return res.json(success_res( "Email sent successfully to " + email ));
    } catch (error) {
      console.error("postsendmail---------------->",error);
    return res.json(error_res( "Failed to send email. Please try again later." ));
    }
  }

  main();
};


module.exports={
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
  
};