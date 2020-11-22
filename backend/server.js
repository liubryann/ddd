const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

let { PythonShell } = require("python-shell");
const { text } = require("express");
PythonShell.defaultOptions = { scriptPath: "../" };
require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get("/getAnalysis", function (req, res) {
  let symbol = req.query.symbol;
  let date = req.query.range;
  
  let options = {
    mode: "text",
    scriptPath: "../",
    args: [symbol, date],
  };

  PythonShell.run("process.py", options, function (err, result) {
    if (err) throw err;
    return res.json(JSON.parse(fs.readFileSync("./dump.json")));
  });

});

app.listen(PORT, function () {
  console.log("Server is running on Port " + PORT);
});

// app.get("/test", function (req, res) {
//   return res.json({people: [{title: "Hello", summary: "wagwan"}], corporation: [{title: "kms", summary: "I wanna sleep"}], peopleAverage: "Strongly Positive", corporationAverage: "Mixed"})
// })