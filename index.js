import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();

//connectiong database
mongoose
  .connect(`${process.env.MONGOOSE_URL}`, {
    dbName: "backend2",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//collection name Message
const User = mongoose.model("User", userSchema);

const users = [];

//setting  statics
const middlewareStatic = express.static(path.join(path.resolve(), "public"));
app.use(middlewareStatic);
//using middlewares
app.use(express.urlencoded({ extended: true }));
//using cookie-parser
app.use(cookieParser());

//setting up view engine
app.set("view engine", "ejs");

//making autentication middleware.
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decodedData = jwt.verify(token, "kjdjfkkwokjSADAKNFSND");
    console.log(decodedData);

    req.user = await User.findById(decodedData._id);
    next();
  } else {
    res.redirect("/login");
  }
};

//redering index page in view (where the form is )
app.get("/", isAuthenticated, (req, res) => {
  // res.render("index");
  console.log(req.user);
  res.render("logout", { name: req.user.name });
});

//register page
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//login page
// app.post("/login", async (req, res) => {
//   const { name, email } = req.body;

//   let user = await User.findOne({ email });
//   if (!user) {
//     return res.redirect("/register");
//   }
//   user = await User.create({
//     name,
//     email,
//   });
//   const token = jwt.sign({ _id: user._id }, "kjdjfkkwokjSADAKNFSND");
//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//   });
//   res.redirect("/");
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.redirect("register");

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.render("login", { email, message: "incorrect password" });

  const token = jwt.sign({ _id: user._id }, "kjdjfkkwokjSADAKNFSND");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedpassword = await bcrypt.hash(
    password,
    10
  )(
    (user = await User.create({
      name,
      email,
      hashedpassword,
    }))
  );

  const token = jwt.sign({ _id: user._id }, "kjdjfkkwokjSADAKNFSND");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

//==============================================
// //rendering success page in view
// app.get("/success", (req, res) => {
//   res.render("success");
// });

//=========================================
// //setting up users route
// app.get("/users", (req, res) => {
//   res.json({ users });
// });

//======================================================
//handling the form submission
// app.post("/contact", async (req, res) => {
//   await Message.create({ name: req.body.name, email: req.body.email });
//   res.redirect("/success");
// });

//==================================================
//path methods
// app.get("/", (req, res) => {
//     const currentLocation = path.resolve();
//     res.sendFile(path.join(currentLocation, "./index.html"));
//   });

//=======================================================
// statuscodes
// app.get("/", (req, res) => {
//     res.status(400).send("meri mrzi")
//    });

//====================================
// app.get("/", (req, res) => {
//     res.status(400)
//    });

app.listen(5000, () => {
  console.log("Server is on");
});
