require("dotenv").config();
const ejs = require("ejs");
const multer = require("multer");
const bcrypt = require("bcrypt");

const Constants = require("../config/constant");
const { encryption, decryption } = require("../utils/mycrypt.lib");
const { log1, success_res, formatDateTime, shownotifications, error_res} = require("../utils/general.lib");
const { custom_validation } = require("../utils/validation.lib");
const { generateAuthToken } = require("../service/adminToken");
const { getAdmin } = require("../service/admin");

const { admin } = require("../models/admin.model");
const { service } = require("../models/service.model");
const { barber } = require("../models/barber.model");
const { about } = require("../models/about.model");
const { User } = require("../models/user.model");
const { gallery } = require("../models/gallery.model");
const { category } = require("../models/category.model");
const { appoinmentbook } = require("../models/appoinmentbook.model");
const { notification } = require("../models/notification.model");


//multer disk storage setup
let index = 1;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "user_images") {
      cb(null, "public/uploads/user_images");
    } else if (file.fieldname === "service_images") {
      cb(null, "public/uploads/service_images");
    } else if (file.fieldname === "barber_images") {
      cb(null, "public/uploads/barber_images");
    } else if (file.fieldname === "category_images") {
      cb(null, "public/uploads/category_images");
    } else {
      cb(new Error("Invalid field name"), null);
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
}).fields([
  { name: "user_images" },
  { name: "service_images" },
  { name: "barber_images" },
  { name: "category_images" },
]);

// GET
const getLogin = async (req, res) => {
  log1("getLogin");
  try{
    if (req.session.admin) {
      return res.redirect("/admin/dashboard");
    }
    return res.render("admin/login", {
      layout: "./layouts/auth-layout",
      header: { 
        title: "Login",
      },
      footer: {
        js: "login.js",
      },
    });
  }catch(error){
    console.error("getLogin--------->",error);
    return res.json(error_res("Something Wrong"));
  };
};

const getDashboard = async (req, res) => {
  log1("getDashboard");
    try{
      const users = await User.countDocuments({});
      const servicecount = await service.countDocuments({});
      const barbercount = await barber.countDocuments({});
      const Category = await category.countDocuments({});
      const booking = await appoinmentbook.countDocuments({});

      const notificationDetails = await shownotifications();

      return res.render("admin/dashboard", {
        layout: "./layouts/admin-layout",
        header: {
          title: "Dashboard",
          name: "Admin",
          notification: notificationDetails,
        },
        data: {
          label: "Dashboard",
          id: "dashboard",
        },
        footer: {
          js: "dashboard.js",
        },
        users,
        service: servicecount,
        barber: barbercount,
        Category,
        booking,
      });
    }catch(error){
      console.error("getDashboard--------->",error);
      return res.json(error_res("Something Wrong"));
    }
};

const getUser = async (req, res) => {
  log1("getUser");
  try {
  const userId = req.body.userId;
  var page = Number(req.query.page) || 1;
  var perpage = 5;
 
    const users = await User.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * perpage)
      .limit(perpage);

    const notificationDetails = await shownotifications(userId);
    const count = await User.countDocuments();
    const pages = Math.ceil(count / perpage);

    return res.render("admin/user", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Users",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Users",
        id: "users",
      },
      footer: {
        js: "user.js",
      },
      users,
      current: page,
      pages,
    });
  } catch (error) {
    console.error("getUser------------->",error);
    return res.json(error_res("Error fetching services"));
  }
};

const getadduser = async (req, res) => {
  log1("getadduser");
  try {
  const notificationDetails = await shownotifications();
    return res.render("admin/adduser", {
      layout: "./layouts/admin-layout",
      header: {
        title: "User",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "adduser",
        id: "adduser",
      },
      footer: {
        js: "user.js",
      },
    });
  } catch (error) {
    console.error("getadduser------------->",error);
    return res.json(error_res("server error"));
  }
};

const getUpdateUser = async (req, res) => {
  log1("getUpdateUser");
  const id = req.params.id;
  try {
    const notificationDetails = await shownotifications();
    const users = await User.findById(id);
    if (!users) {
      return res.json(error_res("users not found"));
    }
    return res.render("admin/updateuser", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Users",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Users",
        id: "users",
      },
      footer: {
        js: "user.js",
      },
      users,
    });
  } catch (error) {
    console.error("getUpdateUser-------->",error);
    return res.json(error_res("server error"));
  }
};

const getupdateuserstatus = async (req, res) => {
  log1("getupdateuserstatus");
  try {
    const id = req.params.id;
    const notificationDetails = await shownotifications();
    const users = await User.findById(id);
    if (!users) {
      return res.json(error_res("users not found"));
    }
    return res.render("admin/updateuser", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Users",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Users",
        id: "users",
      },
      footer: {
        js: "user.js",
      },
      users,
    });
  } catch (error) {
    console.error("getupdateuserstatus-------->",error);
    return res.json(error_res("server error"));
  }
};

const getservice = async (req, res) => {
  log1("getservice");
  try {
    const page = Number(req.query.page) || 1;
    const perpage = 10;
    const notificationDetails = await shownotifications();
    const services = await service
      .find({})
      .sort({ _id: -1 })
      .skip((page - 1) * perpage)
      .limit(perpage);

    const count = await service.countDocuments();
    const pages = Math.ceil(count / perpage);
    return res.render("admin/service", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Services",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Services",
        id: "Service",
      },
      footer: {
        js: "service.js",
      },
      services,
      current: page,
      pages,
    });
  } catch (error) {
    console.error("getservice-------->",error);
    return res.json(error_res("error fetching service"));
  }
};

const getbookappoinment = async (req, res) => {
  log1("getbookappoinment");
  try {
    const page = Number(req.query.page) || 1;
    const perpage = 10;
    const notificationDetails = await shownotifications();
    const book = await appoinmentbook
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInformation",
          },
        },
        {
          $unwind: {
            path: "$userInformation",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "barbars",
            localField: "barbername",
            foreignField: "_id",
            as: "barbarInformation",
          },
        },
        {
          $unwind: {
            path: "$barbarInformation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "servicename",
            foreignField: "_id",
            as: "serviceInformation",
          },
        },
        {
          $unwind: {
            path: "$serviceInformation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $set: {
            barbername: {
              $cond: {
                if: { $not: ["$barbarInformation._id"] },
                then: "barber not exist",
                else: "$barbarInformation.name",
              },
            },
            servicename: {
              $cond: {
                if: { $not: ["$serviceInformation._id"] },
                then: "service not exist",
                else: "$serviceInformation.servicename",
              },
            },
            status: {
              $cond: {
                if: {
                  $or: [
                    { $not: ["$barbarInformation._id"] },
                    { $not: ["$serviceInformation._id"] },
                  ],
                },
                then: Constants?.BOOKING_APPOINMENT?.REJECT, //Reject get from the constant.js
                else: "$status",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            img: "$userInformation.img",
            username: "$userInformation.username",
            email: "$userInformation.email",
            mobileno: "$userInformation.mobileno",
            servicename: 1,
            barbername: 1,
            bookdate: "$bookdate",
            status: "$status",
            userId: "$userInformation._id",
          },
        },
      ])
      .sort({ _id: -1 })
      .skip((page - 1) * perpage)
      .limit(perpage);

    const count = await appoinmentbook.countDocuments();
    const pages = Math.ceil(count / perpage);

    book.forEach((item) => {
      item.bookdate = formatDateTime(item.bookdate);
    });

    return res.render("admin/book-appoinment", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Book Appointments",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Book Appointments",
        id: "book-appointment",
        book: book,
      },
      current: page,
      pages,
      footer: {
        js: "book-appoinment.js",
      },
    });
  } catch (error) {
    console.error("getbookappoinment-------->",error);
    return res.json(error_res("server error"));
  }
};

const getaddservice = async (req, res) => {
  log1("getaddservice");
  try {
  const notificationDetails = await shownotifications();
  return res.render("admin/addservice", {
    layout: "./layouts/admin-layout",
    header: {
      title: "Add Service",
      name: "Admin",
      notification: notificationDetails,
    },
    data: {
      label: "Add Service",
      id: "addservice",
    },
    footer: {
      js: "addservice.js",
    },
  });
}catch(error){
  console.error("getaddservice-------------->",error);
}
};

const getupdateservice = async (req, res) => {
  log1("getupdateservice");
  const id = req.params.id;
  try {
    const notificationDetails = await shownotifications();
    const services = await service.findById(id);
    if (!services) {
      return res.json(error_res("service not found"));
    }
    return res.render("admin/updateservice", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Update Service",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Update Service",
        id: "updateservice",
      },
      footer: {
        js: "service.js",
      },
      service: services,
    });
  } catch (error) {
    console.error("getupdateservice----------------->",error);
    return res.json(error_res("server error"));
  }
};

const getupdatebarber = async (req, res) => {
  log1("getupdatebarber");
  const id = req.params.id;
  try {
    const barbers = await barber.findById(id);
    const notificationDetails = await shownotifications();

    if (!barbers) {
      return res.json(error_res("barber not found"));
    }
    return res.render("admin/updatebarber", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Update barber",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Update barber",
        id: "Updatebarber",
      },
      footer: {
        js: "barber.js",
      },
      barber: barbers, // Send service data to the view
    });
  } catch (error) {
    console.error("getupdatebarber----------------->",error);
    return res.json(error_res("server error"));
  }
};

const getupdateabout = async (req, res) => {
  log1("getupdateabout");
  const id = req.params.id;
  try {
    const abouts = await about.findById(id);
    const notificationDetails = await shownotifications();
    if (!abouts) {
      return res.json(error_res("about not found"));
    }

    return res.render("admin/updateabout", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Update About",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "Update About",
        id: "UpdateAbout",
      },
      footer: {
        js: "about.js",
      },
      about: abouts,
    });
  } catch (error) {
    console.error("getupdateabout------------->",error);
    return res.json(error_res("server error"));
  }
};

const getabout = async (req, res) => {
  log1("getAbout");
  try {
    const abouts = await about.find();
    const notificationDetails = await shownotifications();
  
    return res.render("admin/about", {
      layout: "./layouts/admin-layout",
      header: {
        title: "About Us",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "About Us",
        id: "about",
      },
      footer: {
        js: "about.js",
      },
      abouts,
    });
  } catch (error) {
    console.error("getAbout--------->",error);
    return res.json(error_res("error fetching about"));
  }
};

const getBarber = async (req, res) => {
  log1("getBarber");
  try {
    const perpage = 10;
    const page = Number(req.query.page) || 1;
    const barbers = await barber
      .find()
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ _id: -1 });

    const notificationDetails = await shownotifications();
    const count = await barber.countDocuments();
    const pages = Math.ceil(count / perpage);

    return res.render("admin/barber", {
      layout: "./layouts/admin-layout",
      header: {
        title: "barber",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "barber",
        id: "barber",
      },
      footer: {
        js: "barber.js",
      },
      barbers,
      current: page,
      pages,
    });
  } catch (error) {
    console.error("getBarber------->",error);
    return res.json(error_res("error fetching barber"));
  }
};

const getaddbarber = async (req, res) => {
  log1("getaddbarber");
  try{
    const notificationDetails = await shownotifications();
    return res.render("admin/addbarber", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Add Barber",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "AddBaber",
        id: "AddBaber",
      },
      footer: {
        js: "addbarber.js",
      },
    });
  }catch(error){
    console.error("getaddbarber------->",error);
  }
};


const getcategory = async (req, res) => {
  log1("getcategory");
  var perpage = 10;
  var page = Number(req.query.page) || 1;

  try {
    const notificationDetails = await shownotifications();
    const categories = await category
      .find({})
      .sort({ _id: -1 })
      .skip((page - 1) * perpage)
      .limit(perpage);

    const count = await category.countDocuments();
    const pages = Math.ceil(count / perpage);
    return res.render("admin/category", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Category",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "categroy",
        id: "categroy",
      },
      categories,
      pages,
      current: page,
      footer: {
        js: "category.js",
      },
    });
  } catch (error) {
    console.error("getcategory----------->",error);
    return res.json(error_res("server error"));
  }
};

const getaddcategory = async (req, res) => {
  log1("getaddcategory");
  try {
    const notificationDetails = await shownotifications();
    return res.render("admin/addcategory", {
      layout: "./layouts/admin-layout",
      header: {
        title: "Category",
        name: "Admin",

        notification: notificationDetails,
      },
      data: {
        label: "categroy",
        id: "categroy",
      },
      footer: {
        js: "category.js",
      },
    });
  } catch (error) {
    console.error("getaddcategory---------->",error);
    return res.json(error_res("server error"));
  }
};

const getgallery = async (req, res) => {
  log1("getgallery");
  const page = Number(req.query.page) || 1;
  const perpage = 10;
  try {
    const notificationDetails = await shownotifications();
    const galleries = await gallery
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categorytype",
            foreignField: "_id",
            as: "gallerydocument",
          },
        },
        {
          $unwind: {
            path: "$gallerydocument",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            "gallerydocument.status": Constants?.CATEGORY_STATUS?.ACTIVE,
          },
        },
      ])
      .sort({ _id: -1 })
      .skip((page - 1) * perpage)
      .limit(perpage);

    const count = await gallery.countDocuments();
    const pages = Math.ceil(count / perpage);

    return res.render("admin/gallery", {
      layout: "./layouts/admin-layout",
      header: {
        title: "gallery",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "gallery",
        id: "gallery",
        galleries: galleries,
      },
      galleries,
      pages,
      current: page,
      footer: {
        js: "gallery.js",
      },
    });
  } catch (error) {
    console.error("getgallery------------>",error);
    return res.json(error_res("server error"));
  }
};

const getsetting = async (req, res) => {
  log1("getsetting");
  try {
    const adminId = req.session.admin._id;

    const notificationDetails = await shownotifications();
    const adminDetails = getAdmin(adminId);
    res.render("admin/setting", {
      layout: "./layouts/admin-layout",

      header: {
        title: "Setting",
        name: "Admin",

        notification: notificationDetails,
      },
      data: {
        label: "Setting",
        id: "setting",
        adminId: adminId,
        adminDetails: adminDetails,
      },
      footer: {
        js: "setting.js",
      },
    });
  } catch (error) {
    console.error("getsetting--------->",error);
    return res.json(error_res("server error"));
  }
};

const getaddgallery = async (req, res) => {
  log1("getaddgallery");
  try {
    const notificationDetails = await shownotifications();
    let categorylist = await category.find({
      status: Constants?.CATEGORY_STATUS?.ACTIVE,
    });
    return res.render("admin/addgallery", {
      layout: "./layouts/admin-layout",
      header: {
        title: "gallery",
        name: "Admin",
        notification: notificationDetails,
      },
      data: {
        label: "gallery",
        id: "gallery",
        categorylist: categorylist,
      },
      footer: {
        js: "gallery.js",
      },
    });
  } catch (error) {
    console.error("getaddgallery------------->",error);
    return res.json(error_res("server error"));
  }
};

const getlogout = (req, res) => {
  log1("logout");
  req.session.destroy((err) => {
    if (err) {
      return res.json(error_res("failed to log out"));
    } else {
      res.redirect("/admin/login");
    }
  });
};

// POST
const postLogin = async (req, res) => {
  log1("postLogin");

  try {
    let param = req.body;
    const validate = custom_validation(param, "admin.login");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const result = await admin.findOne({ email: param.email });

    if (!result) {
      return res.json(error_res("Invalid credentials. Please try again."));
    }
    let decrypt = await decryption(param.password, result.password);
    if (!decrypt) {
      return res.json(error_res("Invalid credentials. Please try again."));
    }
    delete result.password;
    req.session.admin = result;
    await generateAuthToken(result._id, req);

    return res.json(
      success_res("Login successful! Welcome to your Salon Admin Panel.", result)
    );
  }catch(error){
    console.error("postLogin-------->",error);
    return res.json(error_res("server error"));
  }
};

const postaddservice = (req, res) => {
  log1("postaddservice");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try{
      let body = req.body;

      const validate = custom_validation( body ,"admin.add_service");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      const servicename = body.servicename;
      const description = body.description;
      const price = body.price;      
    
      let imageArray = [];
      if (req.files.service_images) {
        req.files.service_images.map((file) => {
          imageArray.push(
            `http://localhost:3000/uploads/service_images/${file.filename}`
          );
        });
      }

        const newService = await service.create({
          servicename,
          description,
          price,
          img: imageArray,
        });    
        return res.json(success_res("Service added successfully!", newService));

      } catch (error) {
        console.error("postaddservice------->",error);
        return res.json(error_res("Failed to add service"));
      }
  });
};

const postaddbarber = (req, res) => {
  log1("postaddbarber");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
        let body = req.body; 
        
        const validate = custom_validation(body, "admin.add_barber");
        if (validate.flag != 1) {
          return res.json(validate);
        }
        let imageArray = [];
        if (req.files.barber_images) {
          req.files.barber_images.map((file) => {
            imageArray.push(`/uploads/barber_images/${file.filename}`);
          });
        }

        const newbarber = await barber.create({
          name: body.name,
          barbar_type: body.barbar_type,
          img: imageArray,
        });
        return res.json(success_res("barber added successfully!", newbarber));
    } catch (error) {
      console.error("postaddbarber---------->",error);
      return res.json(error_res("Failed to add barber"));
    }
  });
};

const postadduser = async (req, res) => {
  log1("postadduser");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;
      const validate = custom_validation(body, "admin.add_user");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      let imageArray = [];
      if (req.files.user_images) {
        req.files.user_images.map((file) => {
          imageArray.push(
            `http://localhost:3000/uploads/user_images/${file.filename}`
          );
        });
      }
      const username = body.username;
      const password = body.password;
      const email = body.email;
      const mobileno = body.mobileno;
      const gender = body.gender;

      const existingemail = await User.findOne({ email });
      if (existingemail) {
        return res.json(
          error_res(
            `The username "${email}" is already taken. Please choose a different one.`
          )
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create( {
          username: username,
          password: hashedPassword,
          email: email,
          mobileno: mobileno,
          gender: gender,
          img: imageArray,
        });
        return res.json(success_res("User added successfully!", user));
      } catch (error) {
        console.error("postadduser---------->",error);
        return res.json(error_res("Failed to add user"));
      }
  });
};

const postaddgallery = async (req, res) => {
  log1("postaddgallery");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;   
      const { category: categoryId } = body;
      
      if (!categoryId) {
        return res.json(error_res("Category is required."));
      }

      const categoryExists = await category.findById(categoryId);
      if (!categoryExists) {
        return res.json(error_res("Invalid Category id"));
      }

      let imageArray = [];
      if (req.files.category_images) {
        req.files.category_images.map((file) => {
          imageArray.push(`/uploads/category_images/${file.filename}`);
        });
      }
      
      const existingGallery = await gallery.findOne({
        categorytype: categoryId,
      });

      if (existingGallery) {
        const updategallery = await gallery.findByIdAndUpdate(
          existingGallery._id,
          { $push: { img: { $each: imageArray } } },
          { new: true }
        );
        return res.json(success_res("Gallery updated successfully!"));
      } 
      else {

        const Gallery = await gallery.create({
          categorytype: categoryId,
          img: imageArray,
        });
     
        return res.json(success_res("Gallery added successfully!", Gallery));
      }
    } catch (error) {
      console.error("postaddgallery------------------->",error);
      return res.json(error_res("Failed to add gallery"));
    }
  });
};

const postaddcategory = async (req, res) => {
  log1("postaddcategory");
  try {
    let body = req.body;
    const validate = custom_validation(body, "admin.add_category");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const categorytype = body.categorytype;
    const status = body.status;
    if (!categorytype) {
      return res.json(error_res("Categorytype required"));
    }

    const existingCategory = await category.findOne({ categorytype });

    if (existingCategory) {
      return res.json(error_res(`Category "${categorytype}" already exists`));
    }

    const Category = await category.create({
      categorytype,
      status: parseInt(status),
    });
    return res.json(success_res("category added successfully!", Category));
  } catch (error) {
    console.error("postaddcategory------------------->",error);
    return res.json(error_res("Failed to add category"));
  }
};

// const postaddabout = (req, res) => {
//   log1("postaddabout");
//   upload(req, res, async function (err) {
//     if (err) {
//       return res.json(error_res(err.message));
//     }
//     try {
//     let imageArray = [];
//     if (req.files.service_images) {
//       req.files.service_images.map((file) => {
//         imageArray.push(`/uploads/service_images/${file.filename}`);
//       });
//     }   
//       const newabout = await about.create({
//         experince: req.body.experince,
//         description: req.body.description,
//         img: imageArray,
//       });
//       return res.json(success_res("about added successfully!", newabout));
//     } catch (error) {
//       console.error("postaddabout----------------->", error);
//       return res.json(error_res("Failed to add about"));
//     }
//   });
// };


const postupdatestatus = async (req, res) => {
  log1("postupdatestatus");
  try {
    let body = req.body;
    const validate = custom_validation(body, "admin.update_category_status");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const categoryId = body.categoryId;
    const Category = await category.findById(categoryId);
    const updateStatus =
      Category.status === Constants?.CATEGORY_STATUS?.INACTIVE
        ? Constants?.CATEGORY_STATUS?.ACTIVE
        : Constants?.CATEGORY_STATUS?.INACTIVE;
    const updatecategory = await category.findByIdAndUpdate(
      categoryId,
      { status: updateStatus },
      { new: true }
    );

    return res.json(success_res("Category status updated successfully"));
  } catch (error) {
    console.error("postupdatestatus-------------->",error);
    return res.json(error_res("Internal server error"));
  }
};

const postdeleteservice = async (req, res) => {
  log1(postdeleteservice);
  try {
    const id = req.params.id;
    if (!id) {
      return res.json(error_res("Invalid service ID"));
    }
    const deleteservice = await service.findByIdAndDelete(id);
    return res.json(success_res("service deleted successfully"));
  } catch (error) {
    console.error("postdeleteservice---------------->", error);
    return res.json(error_res("failed to delete service"));
  }
};

const postdeletebarber = async (req, res) => {
  log1("postdeletebarber");
  try {
    const id = req.params.id;
    if (!id) {
      return res.json(error_res("Invalid barber ID"));
    }
    const deletebarber = await barber.findByIdAndDelete(id);
    return res.json(success_res("barber deleted successfully", deletebarber));
  } catch (error) {
    console.error("postdeletebarber-------------->",error);
    return res.json(error_res("failed to delete barber"));
  }
};

const postdeleteuser = async (req, res) => {
  log1("postdeleteuser");
  try {
    const id = req.params.id;
    if (!id) {
      return res.json(error_res("invalid user id"));
    }
    const users = await User.findByIdAndDelete(id);
    return res.json(success_res("user deleted successfully"));
  } catch (error) {
    console.error("postdeleteuser------------->",error);
    return res.json(error_res(error.message));
  }
};

const postdeletecategory = async (req, res) => {
  log1("postdeletecategory");
  try {
    const id = req.params.id;
    if (!id) {
      return res.json(error_res("invalid id"));
    }
    const delcategory = await category.findByIdAndDelete(id);
    return res.json(success_res("delete category successfully"));
  } catch (error) {
    console.error("postdeletecategory-------->",error);
    return res.json(error_res("Server error"));
  }
};

const postupdatebarber = async (req, res) => {
  log1("postupdatebarber");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;
      const validate = custom_validation(body, "admin.update_barber");
      if (validate.flag != 1) {
        return res.json(validate);
      }

      const { barberId, name, barbar_type } = body;
      if (!barberId) {
        return res.json(error_res("barbar id required"));
      }
   
      let updateObj = {};
      if (name) {
        updateObj["name"] = name;
      }
      if (barbar_type) {
        updateObj["barbar_type"] = barbar_type;
      }

      let imageArray = [];
      if (req.files.barber_images) {
        req.files.barber_images.forEach((file) => {
          imageArray.push(`/uploads/barber_images/${file.filename}`);
        });
      }

      if (imageArray.length > 0) {
        updateObj["img"] = imageArray;
      }
      const barbarupdate = await barber.findByIdAndUpdate(
        {
          _id: barberId,
        },
        {
          $set: updateObj,
        },
        {
          new: true,
        }
      );

      return res.json(success_res("barbar updated successfully", barbarupdate));
    } catch (err) {
      console.error("postupdatebarber-------------->", err);
      return res.json(error_res(err.message));
    }
  });
};

const postupdateabout = (req, res) => {
  log1("postupdateabout");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;
      const validate = custom_validation(body, "admin.update_user");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      const aboutId = body.aboutId;
      if (!aboutId) {
        return res.json(error_res("about id is required"));
      }
      let updateObj = {};
      if (body.description) {
        updateObj["description"] = body.description;
      }
      if (body.experince) {
        updateObj["experince"] = body.experince;
      }

      let imageArray = [];
      if (req.files.service_images) {
        req.files.service_images.forEach((file) => {
          imageArray.push(`/uploads/service_images/${file.filename}`);
        });
      }

      if (imageArray.length > 0) {
        updateObj["img"] = imageArray;
      }

      const aboutupdate = await about.findByIdAndUpdate(
        {
          _id: aboutId,
        },
        {
          $set: updateObj,
        },
        { upsert: true }
      );

      return res.json(success_res("about updated successfully", aboutupdate));
    } catch (error) {
      console.error("postupdateabout--------------->",error);
      return res.json(error_res(error.message));
    }
  });
};

const postupdateuser = async (req, res) => {
  log1("postupdateuser");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;
      const validate = custom_validation(body, "admin.update_user");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      const { userId, username, mobileno, gender } = body;
      if (!userId) {
        return res.json(error_res("User id is required"));
      }
      let update_object = {};
      if (username) {
        update_object["username"] = username;
      }
      if (mobileno) {
        update_object["mobileno"] = Number(mobileno);
      }
      if (gender) {
        update_object["gender"] = gender;
      }
      let imageArray = [];
      if (req.files.user_images) {
        req.files.user_images.forEach((file) => {
          imageArray.push(
            `http://localhost:3000/uploads/user_images/${file.filename}`
          );
        });
      }
      if (imageArray.length > 0) {
        update_object["img"] = imageArray;
      }
      const userupdate = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: update_object,
        },
        { new: true }
      );
      return res.json(success_res("User updated successfully", userupdate));
    } catch (err) {
      console.error("postupdateuser---------------->",err);
      return res.json(error_res(err.message));
    }
  });
};

const postupdateuserstatus = async (req, res) => {
  log1("postupdateuserstatus");
  
  let body = req.body;
  const validate = custom_validation(body, "admin.update_user_status");
  if (validate.flag != 1) {
    return res.json(validate);
  }
  const userId = req.params.id;
  const status = body.status;
  if (!userId) {
    return res.json(error_res("User id is required"));
  }
  try {
    const userstatus = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isVery: status,
        },
      },
      { new: true }
    );
    if (!userstatus) {
      return res.json(error_res("User not found"));
    }
    return res.json(
      success_res("User status updated successfully", userstatus)
    );
  } catch (error) {
    console.error("postupdateuserstatus------------>",error);
    return res.json(error_res("server error"));
  }
};

const postbookappoinmentupdatestatus = async (req, res) => {
  log1("postbookappoinmentupdatestatus");
  try { 
  let body = req.body;
  const validate = custom_validation(body, "admin.update_bookstatus");
  if (validate.flag != 1) {
    return res.json(validate);
  }
  const booksid = req.params.id;
  const status = body.status;
  const userId = body.userId;
    if (!userId) {
    return res.json(error_res("User id is required"));
  }

    const bookstatus = await appoinmentbook.findByIdAndUpdate(
      booksid,
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );
    if (!bookstatus) {
      return res.json(error_res("bookstatus not found"));
    }

    let description;
    if (status == Constants?.BOOKING_APPOINMENT?.ACCEPT) {
      description = "your Booking Appointment Accepted ";
    } else {
      description = "your Booking Appointment Rejected ";
    }
    
    const user = await User.findById(userId);

    const createnotification = await notification.create({
      userId,
      title: "Book Appointment",
      description: `${user.username}  ${description}.`,
      notificationType: Constants?.NOTIFICATION_TYPE?.BOOk,
      is_user: true,
    });
    return res.json(success_res("status updated successfully", bookstatus));
  } catch (error) {
    console.error("postbookappoinmentupdatestatus---------->",error);
    return res.json(error_res("Server error"));
  }
};

const postupdateservice = async (req, res) => {
  log1("postupdateservice");
  upload(req, res, async function (err) {
    if (err) {
      return res.json(error_res(err.message));
    }
    try {
      let body = req.body;
      const validate = custom_validation(body, "admin.update_service");
      if (validate.flag != 1) {
        return res.json(validate);
      }
      const { serviceId, servicename, description, price } = body;
      if (!serviceId) {
        return res.json(error_res("service id is required"));
      }
      
      let update_obj = {};

      if (servicename) {
        update_obj["servicename"] = servicename;
      }

      if (description) {
        update_obj["description"] = description;
      }

      if (price) {
        update_obj["price"] = price;
      }
      let imageArray = [];

      if (req.files.service_images) {
        req.files.service_images.forEach((file) => {
          imageArray.push(`/uploads/service_images/${file.filename}`);
        });
      }
      if (imageArray.length > 0) {
        update_obj["img"] = imageArray;
      }
      let serviceupdate = {};

      serviceupdate = await service.findByIdAndUpdate(
        {
          _id: serviceId,
        },
        {
          $set: update_obj,
        },
        { new: true }
      );

      return res.json(success_res("service Updated", serviceupdate));
    } catch (error) {
      console.error("postupdateservice---------->",error);
      return res.json(error_res(error.message));
    }
  });
};

const postsetting = async (req, res) => {
  log1("postsetting");
  try {
    
    let body = req.body;
    const validate = custom_validation(body, "admin.forgot_password");
    if (validate.flag != 1) {
      return res.json(validate);
    }
    const adminId = req.params.adminId || req.params.id;
    if (!adminId) {
      return res.json(error_res("Admin id is required"));
    }
    const { old_password, new_password, confirm_password } = body;

    if (!old_password || !new_password || !confirm_password) {
      return res.json(error_res("Please fill all the field"));
    }

    const adminRecord = await admin.findById(adminId);
    if (!adminRecord) {
      return res.json(error_res("Admin not found"));
    }
    const isMatch = await decryption(old_password, adminRecord.password);
    if (!isMatch) {
      return res.json(error_res("Old password is incorrect"));
    }

    if (old_password === new_password) {
      return res.json(
        error_res("new password must be differnt from old password")
      );
    }

    if (new_password !== confirm_password) {
      return res.json(
        error_res("new password and confirm password must match")
      );
    }

    adminRecord.password = await encryption(new_password);
    await adminRecord.save();

    delete req.session.admin;
    return res.json(success_res("password updated successfully"));
  } catch (error) {
    console.error("postsetting-------->",error);
    return res.json(error_res("Server error"));
  }
};

module.exports = {
  getLogin,
  getUser,
  getDashboard,
  getservice,
  getabout,
  getBarber,
  getbookappoinment,
  getaddservice,
  getupdateservice,
  getaddbarber,
  getupdatebarber,
  getupdateabout,
  getsetting,
  getcategory,
  getaddcategory,
  getgallery,
  getaddgallery,
  getlogout,
  getUpdateUser,
  getadduser,
  getupdateuserstatus,

  postLogin,
  postaddservice,
  postdeleteservice,
  postaddbarber,
  postdeletebarber,
  postupdateservice,
  postupdatebarber,
  postupdateabout,
  postaddcategory,
  postupdatestatus,
  postaddgallery,
  postsetting,
  postupdateuser,
  postdeleteuser,
  postdeletecategory,
  postadduser,
  postupdateuserstatus,
  postbookappoinmentupdatestatus,
  // postaddabout,
};
