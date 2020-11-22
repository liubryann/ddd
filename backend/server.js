const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
import { PythonShell } from "python-shell";
PythonShell.defaultOptions = { scriptPath: "../" };
require("dotenv").config();
const PORT = process.env.PORT || 4000;
import getAnalysis from "./handlers";

app.use(cors());

function sentiment(num) {
  feeling = "Neutral"
  sentiment_num = math.abs(num)
  if (sentiment_num > 0.5) {
    feeling = "Strongly";
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
  return feeling
}

app.get("/", function (req, res) {
  let symbol = req.query.symbol;
  let date = req.query.range;
  let processed_data = {
    people: [],
    corporation: [],
    peopleAVG: 0,
    corporationAVG: 0,
  };
  let options = {
    mode: "text",
    scriptPath: "../",
    args: [symbol, date],
  };

  let text_content;
 PythonShell.run("webscraper/scraper.py", options, function (err, result) {
    if (err) throw err;
    text_content = JSON.parse(result);
    text_content = JSON.parse(fs.readFileSync("/dump.json"));
  });
  count = 0
  total_feeling = 0
  text_content["people"].forEach((data) => {
    count = count + 1
    options[args] = ["process", data["data"]];
    PythonShell.run("nlp/nlp.py", options, function (err, result) {
      if (err) throw err;
      result = JSON.parse(result);
      total_feeling = total_feeling + result["feeling"]
      processed_data["people"].push({
        title: data["title"],
        summary: result["summary"],
        sentiment: sentiment(result["feeling"]),
      });
    });
  });
  processed_data["peopleAVG"] = sentiment(total_feeling/count)
  count = 0
  total_feeling = 0
  text_content["corporation"].forEach((data) => {
    count = count + 1
    options[args] = ["process", data["data"]];
    PythonShell.run("nlp/nlp.py", options, function (err, result) {
      if (err) throw err;
      result = JSON.parse(result);
      total_feeling = total_feeling + result["feeling"]
      processed_data["corporation"].push({
        title: data["title"],
        summary: result["summary"],
        sentiment: sentiment(result["feeling"])
      });
    });
  });
  processed_data["corporationAVG"] = sentiment(total_feeling/count)
  res.send(JSON.dumps(processed_data))
});

app.listen(PORT, function () {
  console.log("Server is running on Port " + PORT);
});
