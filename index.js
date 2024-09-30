import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();

//connectiong database
mongoose
  .connect(`${process.env.MONGOOSE_URL}`, {
    dbName: "backend2",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});
//collection name Message
const Message = mongoose.model("Message", messageSchema);

const users = [];

//setting  statics
const middlewareStatic = express.static(path.join(path.resolve(), "public"));
app.use(middlewareStatic);
//using middlewares
app.use(express.urlencoded({ extended: true }));

// app.get("/add", async (req, res) => {
//   await Message.create({ name: "Archita2", email: "sample2@gmail.com" });

//   res.send("nice");
// });

//setting up view engine
app.set("view engine", "ejs");

//redering index page in view (where the form is )
app.get("/", (req, res) => {
  // res.render("index");
  res.render("login");
});

//rendering success page in view
app.get("/success", (req, res) => {
  res.render("success");
});

//handling the form submission
app.post("/contact", async (req, res) => {
  await Message.create({ name: req.body.name, email: req.body.email });
  res.redirect("/success");
});

//setting up users route
app.get("/users", (req, res) => {
  res.json({ users });
});

app.post("/login", (req, res) => {
  res.cookie("token", "iamin", {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

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
