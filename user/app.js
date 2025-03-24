require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {db} = require("./utils/db.helper");
const router = require("./route/clientRouter");
const path = require("path");
const app = express();
const cors = require("cors");
const session = require("express-session");

//Third-party middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Ensure your uploaded files in the 'uploads' folder are accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
//built-in middleware express.static used for images,css,js
app.use("/img", express.static("assets/img"));
app.use("/css", express.static("assets/css"));
app.use("/js", express.static("assets/js"));
app.use("/lib", express.static("lib"));
app.use("/mail", express.static("mail"));
app.use(expressLayouts);

// Set up the view engine (EJS)
app.set("view engine", "ejs");
app.set("layout", "./layouts/user-layout");

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

app.use("/client", router);

app.get("/", (req, res) => {
  const token = req.session.token || req.headers["authorization"];
  if (token) {
    res.redirect("/client/home");
  } else {
    res.render("user/login", {
    layout: "./layouts/auth-layout",
      header: { title: "Login Page" },
      footer:{js:"login.js"}
    });
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log(`app listening at ${process.env.APP_URL}`);
});
