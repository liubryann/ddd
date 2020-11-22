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

function sentiment(num) {
  feeling = "Neutral";
  sentiment_num = Math.abs(num);
  if (sentiment_num > 0.5) {
    feeling = "Strongly ";
  } else if (sentiment_num > 0.25) {
    feeling = "";
  } else if (sentiment_num >= 0) {
    if (sentiment["magnitude"] > 2) feeling = "Mixed";
    else feeling = "Neutral";
  }
  if (num >= 0.25) {
    feeling += "Positive";
  } else if (num <= -0.25) {
    feeling += "Negative";
  }
  return feeling;
}

app.get("/", function (req, res) {
  let symbol = req.query.symbol;
  let date = req.query.range;
  
  let options = {
    mode: "text",
    scriptPath: "../",
    args: [symbol, date],
  };

  PythonShell.run("webscraper/scraper.py", options, function (err, result) {
    let processed_data = {
        people: [],
        corporation: [],
        peopleAVG: 0,
        corporationAVG: 0,
      };
    if (err) throw err;
    let text_content = JSON.parse(fs.readFileSync("./dump.json"));
    // console.log(text_content);
    count = 0;
    total_feeling = 0;
    console.log(typeof(text_content.people));
    console.log(text_content.people[0]);
    text_content.people.forEach((data) => {
      count = count + 1;
        PythonShell.run("nlp/nlp.py", {mode: "text",scriptPath: "../",args: ["process", data["data"]]}, function (err, result) {
        if (err) throw err;

        console.log(data["title"]);
        console.log(result);
        total_feeling = total_feeling + result["feeling"];
        processed_data["people"].push({
          title: data["title"],
          summary: result["summary"],
          sentiment: sentiment(result["feeling"]),
        });
      });
    });
    processed_data["peopleAVG"] = sentiment(total_feeling / count);
    count = 0;
    total_feeling = 0;
    text_content.corporation.forEach((data) => {
      count = count + 1;
    //   options[args] = ["process", data["data"]];
      PythonShell.run("nlp/nlp.py", {mode: "text",scriptPath: "../",args: ["process", data["data"]]}, function (err, result) {
        if (err) throw err;
        result = JSON.parse(result);
        total_feeling = total_feeling + result["feeling"];
        processed_data["corporation"].push({
          title: data["title"],
          summary: result["summary"],
          sentiment: sentiment(result["feeling"]),
        });
      });
    });
    processed_data["corporationAVG"] = sentiment(total_feeling / count);
    console.log(processed_data);
    return res.json(JSON.stringify(processed_data));
  });

  console.log(text_content);
});

app.listen(PORT, function () {
  console.log("Server is running on Port " + PORT);
});
