const dotenv = require("dotenv");
require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const db = require("./Database/db");
const router = require("./route/clientRouter");
const bodyparser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const session = require("express-session");

const port = process.env.PORT;

//.env
console.log(process.env.PORT);
console.log(process.env.DB_HOST);

//app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({extended:true}));
//for use bodyparser is json and urlencode
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//built-in middleware express.static used for images,css,js
app.use("/img", express.static("img"));
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use("/lib", express.static("lib"));
app.use("/mail", express.static("mail"));

//app.use("/uploads", express.static(("uploads")));
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Ensure your uploaded files in the 'uploads' folder are accessible
// app.use("http://localhost:3002/uploads", express.static(path.join(__dirname, "uploads")));
 app.use("/uploads", express.static(path.join(__dirname, "uploads")));


 app.use("/service_images", express.static("uploads/service_images"));
 app.use("/user_images", express.static("uploads/user_images"));
//use Session
app.use(
  session({
    secret: "jwtSecretKey",
    resave: false,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "views"));

app.use("/client", router);

app.get("/", (req, res) => {
  const token = req.session.token || req.headers["authorization"];
  if (token) {
    res.redirect("/client/home");
  } else {
    res.render("Login", {
      header: { title: "Login Page" },
    });
  }
});

const server = app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
