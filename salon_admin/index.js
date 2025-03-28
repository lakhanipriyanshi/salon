require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { log1 } = require("./utils/general.lib");
const router = require("./routes/adminRouters");
const app = express();
const path = require('path');
var cors = require("cors");
var session = require("express-session");
var cronfile = require("../salon_admin/cron/index")

const httpServer = require("http").createServer(app);

//Third-party middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure your uploaded files in the 'uploads' folder are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//built-in middleware express.static used for images,css,js 
app.use("/css", express.static("assets/css"));
app.use("/js", express.static("assets/js"));
app.use("/images", express.static("assets/images"));
app.use("/vendor", express.static("assets/vendor"));
app.use(expressLayouts);

// Set up the view engine (EJS)
app.set("view engine", "ejs");
app.set("layout", "./layouts/admin-layout");

//use Session
app.use(
  session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
  })
);

app.use("/admin", router);

//cronnotification
cronfile()

httpServer.listen(process.env.PORT, () => {
  log1(`app listening at ${process.env.APP_URL}`);
});

app.use("", (req, res) => {
  return res.render("404", {
     header: { title: 404 },
     layout: "./layouts/common-layout",
  });
});
 