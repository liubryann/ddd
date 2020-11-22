const express = require('express');
const app = express();
const cors = require('cors');
import { PythonShell } from "python-shell";
PythonShell.defaultOptions = { scriptPath: '../' }
require("dotenv").config();
const PORT = process.env.PORT || 4000;
import getAnalysis from "./handlers";

app.use(cors());

app.get('/', function (req, res) {
    let symbol = req.query.symbol;
    let date = req.query.range;
    
    let options = {
      mode: "text",
      scriptPath: "../",
      args: [source, symbol, date],
    };
    
    let text_content;
    PythonShell.run("webscraper/scraper.py", options, function (err, result) {
      if (err) throw err;
      text_content = result
    })
  
  
    options[args] = ["process", text_content]
    PythonShell.run("nlp/nlp.py", options, function (err, result) {
      if (err) throw err;
      let processed_article = new Data({
        sector: result["sector"]["Category name"],
        symbol: symbol,
        date: date,
        sentiment: result["sentiment_details"]["sentiment"],
        summary: result["summary"],
      });
      processed_article.save();
      console.log("results: %j", results);
    });
})

app.listen(PORT, function() {
    console.log("Server is running on Port " + PORT);
});