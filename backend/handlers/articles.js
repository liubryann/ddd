import { PythonShell } from "python-shell";
PythonShell.defaultOptions = { scriptPath: '../' }
let Data = require("../database");

const dataSchema = mongoose.Schema({
  sector: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: false,
  },
  date: String,
  sentiment: String,
  summary,
});

export function getAnalysis(req, res) {
  let symbol = req.symbol;
  let date = req.date;
  let source = req.source;
  let query = req.query;
  let timeframe = req.timeframe;

  let options = {
    mode: "text",
    scriptPath: "../",
    args: [source, query, timeframe],
  };
  
  let text_content
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


}
