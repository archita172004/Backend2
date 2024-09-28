import express from "express";
import path from "path";
const app = express();

app.get("/", (req, res) => {
  const currentLocation = path.resolve();
  res.sendFile(path.join(currentLocation, "./index.html"));
});

//path methods
// app.get("/", (req, res) => {
//     const currentLocation = path.resolve();
//     res.sendFile(path.join(currentLocation, "./index.html"));
//   });

// statuscodes
// app.get("/", (req, res) => {
//     res.status(400).send("meri mrzi")
//    });

// app.get("/", (req, res) => {
//     res.status(400)
//    });

app.listen(5000, () => {
  console.log("Server is on");
});
