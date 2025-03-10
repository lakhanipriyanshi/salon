require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const { encryption, decryption } = require("../lib/mycrypt.lib");
const {
  log1,
  success_res,
  formatDateTime,
  shownotifications,
  error_res,
} = require("../lib/general.lib");
const { custom_validation } = require("../lib/validation.lib");
const Constants = require("../config/constant");
const { generateAuthToken } = require("../service/adminToken");
const { getAdmin } = require("../service/admin");
const { admin } = require("../models/admin.model");
const multer = require("multer");
const { service } = require("../models/service.model");
const { barber } = require("../models/barber.model");
const { ObjectId } = require("mongodb");
const { about } = require("../models/about.model");
const { User } = require("../models/user.model");
const { gallery } = require("../models/gallery.model");
const { category } = require("../models/category.model");
const { appoinmentbook } = require("../models/appoinmentbook.model");
const { notification } = require("../models/notification.model");
const { log } = require("console");
const bcrypt = require("bcrypt");
// const { title } = require("process");

//multer disk storage setup

let index = 1;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Defines where the files are saved
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
}).array("imageArray");

const getLogin = async (req, res) => {
  log1("getLogin");
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
};

const getDashboard = async (req, res) => {
  log1("getDashboard");
  
  const users = await User.countDocuments({});
  const servicecount = await service.countDocuments({});
  const barbercount = await barber.countDocuments({});
  const Category = await category.countDocuments({});
  const booking = await appoinmentbook.countDocuments({});

  const notificationDetails = await shownotifications();
  // console.log('notification----------------------------',notificationDetails);

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
};

//For View UserList
const getUser = async (req, res) => {
  log1("getUser");
  
  const userId = req.body.userId;
  var page = Number(req.query.page) || 1;
  var perpage = 5;
  try {
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
    console.error("Error fetching services:", error);
    res.status(500).send("Error fetching services");
  }
};

const getadduser = async (req, res) => {
  log1("getadduser");

  const notificationDetails = await shownotifications();
  try {
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
    res.status(500).send("server error");
  }
};

const getUpdateUser = async (req, res) => {
  log1("getUpdateUser");
  const id = req.params.id;
  try {
    const notificationDetails = await shownotifications();
    const users = await User.findById(id);
    if (!users) {
      return res.status(404).send("users not found");
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
    console.error("Error fetching service:", error);
    res.status(500).send("Server error");
  }
};

const getupdateuserstatus = async (req, res) => {
  log1("updateuserstatus");
  const id = req.params.id;
  try {
    const notificationDetails = await shownotifications();
    const users = await User.findById(id);
    if (!users) {
      return res.status(404).send("users not found");
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
    console.error("Error fetching service:", error);
    res.status(500).send("Server error");
  }
};
const getservice = async (req, res) => {
  log1("getservice");
  const page = Number(req.query.page) || 1;
  const perpage = 10;
  try {
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
    console.error("Error fetching services:", error);
    return res.status(500).send("Error fetching services");
  }
};

const getbookappoinment = async (req, res) => {
  log1("getbookappoinment");
  const page = Number(req.query.page) || 1;
  const perpage = 10;
  try {
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
            userId:"$userInformation._id",
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
    console.error("error fetching server", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getaddservice = async (req, res) => {
  log1("getaddservice");

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
};
const getupdateservice = async (req, res) => {
  log1("getupdateservice");
  const id = req.params.id;
  try {
    const notificationDetails = await shownotifications();
    const services = await service.findById(id);
    if (!services) {
      return res.status(404).send("Service not found");
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
    console.error("Error fetching service:", error);
    res.status(500).send("Server error");
  }
};

const getupdatebarber = async (req, res) => {
  const id = req.params.id;
  try {
    const barbers = await barber.findById(id);
    const notificationDetails = await shownotifications();

    if (!barbers) {
      return res.status(404).send("barber not found");
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
    console.error("Error fetching service:", error);
    res.status(500).send("Server error");
  }
};

const getupdateabout = async (req, res) => {
  const id = req.params.id;
  try {
    const abouts = await about.findById(id);

    const notificationDetails = await shownotifications();
    if (!abouts) {
      return res.status(404).send("About not found");
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
    console.error("Error fetching about:", error);
    res.status(500).send("Server error");
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
    console.error("Error fetching services:", error);
    res.status(500).send("Error fetching services");
  }
};

const getBarber = async (req, res) => {
  log1("getBarber");
  const perpage = 10;
  const page = Number(req.query.page) || 1;

  try {
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
    console.error("Error fetching services:", error);
    res.status(500).send("Error fetching services");
  }
};

const getaddbarber = async (req, res) => {
  log1("getaddbarber");

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
    res.status(500).send("server error");
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
    res.status(500).send("server error");
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
  } catch (err) {
    console.error("Error fetching gallery:", err);
    res.status(500).send("Server Error");
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
    console.error("Error fetching admin:", error);
    return res.status(500).send("Server error");
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
    res.status(500).send("Innternal server error");
  }
};

const getlogout = (req, res) => {
  log1("logout");
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      res.status(500).send("failed to log out");
    } else {
      res.redirect("/admin/login");
    }
  });
};

const postLogin = async (req, res) => {
  log1("postLogin");
  let param = req.body;
  const validate = custom_validation(param, "admin.login");
  if (validate.flag != 1) {
    return res.json(validate);
  }

  //Create
  //const encryptedPassword = await encryption(param.password);
  //const result = await admin.create({ email: param.email, password: encryptedPassword });

  //FIND
  const result = await admin.findOne({ email: param.email });

  if (!result) {
    return res.json({ flag: 0, msg: "Invalid credentials. Please try again." });
  }
  let decrypt = await decryption(param.password, result.password);
  if (!decrypt) {
    return res.json({ flag: 0, msg: "Invalid credentials. Please try again." });
  }
  delete result.password;
  req.session.admin = result;
  await generateAuthToken(result._id, req);

  return res.json(
    success_res("Login successful! Welcome to your Salon Admin Panel.", result)
  );
};

const postaddservice = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const imageArray = req.files.map((file) => `/uploads/${file.filename}`);

    try {
      const newService = new service({
        servicename: req.body.servicename,
        description: req.body.description,
        price: req.body.price,
        img: imageArray,
      });

      await newService.save();

      return res.json({
        success: true,
        message: "Service added successfully!",
        service: newService,
      });
    } catch (error) {
      console.error("Error saving service:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add service" });
    }
  });
};

const postaddbarber = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const imageArray = req.files.map((file) => `/uploads/${file.filename}`);

    try {
      const newbarber = new barber({
        name: req.body.name,
        barbar_type: req.body.barbar_type,
        img: imageArray,
      });

      await newbarber.save();

      return res.json({
        success: true,
        message: "barber added successfully!",
        barber: newbarber,
      });
    } catch (error) {
      console.error("Error saving barber:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add barber" });
    }
  });
};

const postadduser = async (req, res) => {
  log("postadduser");
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error uploading", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const imageArray = req.files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    );

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const gender = req.body.gender;

    const existingemail = await User.findOne({ email });
    console.log("Existing user:", existingemail);
    if (existingemail) {
      return res.status(200).json({
        isSuccess: false,
        message: `The username "${email}" is already taken. Please choose a different one.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username: username,
        password: hashedPassword,
        email: email,
        mobileno: mobileno,
        gender: gender,
        img: imageArray,
      });
      return res
        .status(200)
        .json({ success: true, message: "user added succesfully", user: user });
    } catch (error) {
      console.error("Error add", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add user" });
    }
  });
};

const postaddgallery = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const imageArray = req.files.map((file) => `/uploads/${file.filename}`);
    const { category: categoryId } = req.body;

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required." });
    }
    try {
      const categoryExists = await category.findById(categoryId);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid category ID." });
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
        return res.json({
          success: true,
          message: "Gallery updated successfully!",
        });
      } else {
        await gallery.create({
          categorytype: categoryId,
          img: imageArray,
        });

        return res.json({
          success: true,
          message: "Gallery added successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving gallery:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add/update gallery" });
    }
  });
};

const postaddcategory = async (req, res) => {
  try {
    const categorytype = req.body.categorytype;
    const status = req.body.status;
    const existingCategory = await category.findOne({ categorytype });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category "${categorytype}" already exists`,
      });
    }
    const Category = await category.create({
      categorytype,
      status: parseInt(status),
    });
    return res
      .status(200)
      .json({ success: true, message: "Category added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add Category" });
  }
};

const postupdatestatus = async (req, res) => {
  try {
    const categoryId = req.body.categoryId;

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

    res.status(200).json({
      message: "Category status updated successfully",
    });
  } catch (error) {
    console.error("Error updating category status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postaddabout = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    const imageArray = req.files.map((file) => `/uploads/${file.filename}`);

    try {
      const newabout = await about.create({
        experince: req.body.experince,
        description: req.body.description,
        img: imageArray,
      });
      return res.json({
        success: true,
        message: "about added successfully!",
        service: newabout,
      });
    } catch (error) {
      console.error("Error saving about:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add about" });
    }
  });
};

const postdeleteservice = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid service ID" });
    }
    const deleteservice = await service.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "service deleted successfully" });
  } catch (error) {
    console.error("error---", error);
    return res
      .status(400)
      .json({ success: false, message: "failed to delete service" });
  }
};

const postdeletebarber = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid barber ID" });
    }
    const deletebarber = await barber.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "barber deleted successfully" });
  } catch (error) {
    console.log("error---", error);
    return res
      .status(400)
      .json({ success: false, message: "failed to delete barber" });
  }
};

const postdeleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id" });
    }
    const users = await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    console.log("error----", error);
    return res.status(400).json({ message: error.message });
  }
};

const postdeletecategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    const delcategory = await category.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "delete category successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Server error" });
  }
};

const postupdatebarber = async (req, res) => {
  upload(req, res, async function (err) {
    try {
      const barberId = req.body.barberId;
      if (!barberId) {
        return res.status(400).json({ message: "barbar id required" });
      }

      let updateObj = {};
      if (req.body.name) {
        updateObj["name"] = req.body.name;
      }
      if (req.body.barbar_type) {
        updateObj["barbar_type"] = req.body.barbar_type;
      }
      let imageArray = [];
      req.files.forEach((file) => {
        imageArray.push(`/uploads/${file.filename}`);
      });
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
      return res
        .status(200)
        .json({ message: "barbar updated successfully", barbarupdate });
    } catch (err) {
      console.log("Error", err);
      return res.status(400).json({ message: err.message });
    }
  });
};

const postupdateabout = (req, res) => {
  upload(req, res, async function (error) {
    try {
      const aboutId = req.body.aboutId;
      if (!aboutId) {
        res.status(400).json({ message: "about id is required" });
      }
      let updateObj = {};
      if (req.body.description) {
        updateObj["description"] = req.body.description;
      }
      if (req.body.experince) {
        updateObj["experince"] = req.body.experince;
      }

      let imageArray = [];
      req.files.forEach((file) => {
        imageArray.push(`/uploads/${file.filename}`);
      });
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
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "about is successfully updated ",
        aboutupdate,
      });
    } catch (error) {
      console.log("Error", err);
      return res.status(400).json({ message: error.message });
    }
  });
};

const postupdateuser = async (req, res) => {
  upload(req, res, async function (err) {
    try {
      const userId = req.body.userId;
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
      req.files.forEach((file) => {
        imageArray.push(`http://localhost:3000/uploads/${file.filename}`);
      });
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

      console.log("userupdated----------------------", update_object);

      return res
        .status(200)
        .json({ message: "user updated successfully", userupdate });
    } catch (err) {
      console.log("Error", err);
      return res.status(400).json({ message: err.message });
    }
  });
};

const postupdateuserstatus = async (req, res) => {
  const userId = req.params.id;
  const status = req.body.status;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
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
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User status updated successfully", userstatus });
  } catch (error) {
    console.log("Error", error);
    return res.status(400).json({ message: "Server error" });
  }
};

const postbookappoinmentupdatestatus = async (req, res) => {
  log1("postbookappoinmentupdatestatus");
  const booksid = req.params.id;
  const status = req.body.status;
  const userId = req.body.userId;
  // console.log("req.body-------------------------", req.body);
  // console.log("req.params-------------------------", req.params);

  if (!userId) {
    console.log("userid not found", req.body.userId);
    return res
      .status(400)
      .json({ message: "User id is required", success: false });
  }
  try {
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
      return res
        .status(400)
        .json({ message: "bookstatus not found", success: false });
    }

    let description;
    if (status == Constants?.BOOKING_APPOINMENT?.ACCEPT) {
      description = "your Booking Appointment Accepted ";
    } else {
      description = "your Booking Appointment Rejected ";
    }
    // console.log("description-----------------------------", description);

    const user = await User.findById(userId);

    const createnotification = await notification.create({
      userId,
      title: "Book Appointment",
      description: `${user.username}  ${description}.`,
      notificationType: Constants?.NOTIFICATION_TYPE?.BOOk,
      is_user: true,
    });
    // console.log(
    //   "created notification-------------------------",
    //   createnotification
    // );

    console.log("status----------------------------------", status);
    return res.status(200).json({
      message: "status updated successfully",
      success: true,
      bookstatus,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(400).json({ message: "Server error" });
  }
};

const postupdateservice = async (req, res) => {
  log1("postupdateservice------------");
  upload(req, res, async function (err) {
    try {
      const serviceId = req.body.serviceId;
      if (!serviceId) {
        return res.status(400).json({ message: "Service ID is required" });
      }

      let update_obj = {};

      if (req.body.servicename) {
        update_obj["servicename"] = req.body.servicename;
      }

      if (req.body.description) {
        update_obj["description"] = req.body.description;
      }

      if (req.body.price) {
        update_obj["price"] = req.body.price;
      }
      let imageArray = [];
      req.files.forEach((file) => {
        imageArray.push(`/uploads/${file.filename}`);
      });
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
      return res
        .status(200)
        .json({ message: "service Updated", updateData: serviceupdate });
    } catch (error) {
      console.log("error----------->", error);
      return res.status(400).json({ message: error.message });
    }
  });
};

const postsetting = async (req, res) => {
  log1("postsetting");
  try {
    const adminId = req.params.adminId || req.params.id;
    if (!adminId) {
      return res.status(404).json({ message: "AdminID is requird" });
    }
    const { old_password, new_password, confirm_password } = req.body;

    if (!old_password || !new_password || !confirm_password) {
      return res.status(400).json({ message: "Please fill all the field" });
    }

    const adminRecord = await admin.findById(adminId);
    if (!adminRecord) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await decryption(old_password, adminRecord.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Old password is incorrect" });
    }

    if (old_password === new_password) {
      return res
        .status(404)
        .json({ message: "new password must be differnt from old password" });
    }

    if (new_password !== confirm_password) {
      return req
        .status(404)
        .json({ message: "new password and confirm password must match" });
    }

    adminRecord.password = await encryption(new_password);
    await adminRecord.save();

    delete req.session.admin;

    return res
      .status(200)
      .json({ success: true, message: "password updated successfully" });
  } catch (error) {
    console.error("Error updating password", error);
    return res.status(500).json({ message: "Server error" });
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
  postaddabout,
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
};
