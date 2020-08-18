// var express = require("express");
// var app = express();
// var path = require("path");

// app.use(express.static(path.join(__dirname)));
// app.use("/styles", express.static(__dirname + "/styles"));
// app.use("/images", express.static(__dirname + "/images"));
// app.use("/scripts", express.static(__dirname + "/scripts"));

// // viewed at based directory http://localhost:8080/
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname + "views/index.html"));
// });

// // add other routes below
// app.get("/about", function (req, res) {
//   res.sendFile(path.join(__dirname + "views/about.html"));
// });

// app.listen(process.env.PORT || 8080);

/////////////////////////////------------------------------

const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("dist"));

// If user makes a get request to any address, run this function.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});

app.listen(port);

console.log("server started");
