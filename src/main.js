const express = require("express");
const path = require("path");
const requests = require("requests");
// const we = require('../public/public_main.js')
const app = express();
const port = 8000;

// const public_main = require('../public/public_main.js')
var six_days_weather = [];
const path_of_htmlfile = path.join(__dirname, "../public");

app.use(express.static(path_of_htmlfile));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/city", (req, res) => {
  // console.log(we);
});

app.listen(port, () => {
  console.log("port is running");
});
