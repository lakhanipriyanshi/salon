require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
var cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const adminRouters = require("./routes/adminRouters");
const { log1 } = require("./lib/general.lib");
const router = require("./routes/adminRouters");
const app = express();
const path = require('path');

//const fileUpload = require("express-fileupload");
const httpServer = require("http").createServer(app);

var session = require("express-session");

//app.use(fileUpload({ createParentPath: true,}));

//Third-party middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/uploads', express.static('uploads'));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure your uploaded files in the 'uploads' folder are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//built-in middleware express.static used for images,css,js 
app.use("/css", express.static("assets/css"));
app.use("/js", express.static("assets/js"));
app.use("/images", express.static("assets/images"));
app.use("/vendor", express.static("assets/vendor"));
app.use("/banner_images", express.static("uploads/banner_images"));
app.use("/service_images", express.static("uploads/service_images"));
app.use("/user_images", express.static("uploads/user_images"));
app.use(expressLayouts);

// Set up the view engine (EJS)
app.set("view engine", "ejs");
app.set("layout", "./layouts/admin-layout");

app.use(
  session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
  })
);

app.use("/admin", router);

httpServer.listen(process.env.PORT, () => {
  log1(`app listening at ${process.env.APP_URL}`);
});

app.use("", (req, res) => {
  return res.render("404", {
     header: { title: 404 },
     layout: "./layouts/common-layout",
  });
});
 