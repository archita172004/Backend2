import express from "express";
import path from "path";
const app = express();

const users = [];

//setting  statics
const middlewareStatic = express.static(path.join(path.resolve(), "public"));
app.use(middlewareStatic);
//using middlewares
app.use(express.urlencoded({ extended: true }));

//setting up view engine
app.set("view engine", "ejs");

//redering index page in view (where the form is )
app.get("/", (req, res) => {
  res.render("index", { name: "Archita" });
});

//rendering succes page in view
app.get("/success", (req, res) => {
  res.render("success");
});

//handling the form submission
app.post("/contact", (req, res) => {
  users.push({ userName: req.body.name, email: req.body.email });

  // res.render("success");
  res.redirect("/success");
});

//setting up users route
app.get("/users", (req, res) => {
  res.json({ users });
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
