import http from "http";
import { generatePercent } from "./features.js";
import fs from "fs";
import path from "path";

console.log(path);
console.log(generatePercent());

const server = http.createServer((req, res) => {
  if (req.url === "/about") {
    res.end("<h1>About </h1>");
  } else if (req.url === "/") {
    const home = fs.readFile("./index.html", (err, home) => {
      res.end(home);
    });
  } else if (req.url === "/contact") {
    res.end("<h1>contact us</h1>");
  } else {
    res.end("<h1>page not found</h1>");
  }
});

server.listen(5000, () => console.log("server is working"));
