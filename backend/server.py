import yfinance as yf
from backend.webscraper.scraper import scrape
from backend.process import analyze
import random
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["DEBUG"] = True


@app.route("/getAnalysis", methods=["GET"])
@cross_origin()
def get_analysis():
    if "symbol" in request.args and "date" in request.args:
        symbol = request.args["symbol"]
        date = request.args["date"]
    else:
        return "Error: Request was not properly formatted"

    individual, institutional = scrape(symbol, date)

    individual_result, individual_avg = analyze(individual)
    institutional_result, institutional_avg = analyze(institutional)

    response = {
        "individual": individual_result,
        "individualAverage": individual_avg,
        "institutional": institutional_result,
        "institutionalAverage": institutional_avg,
    }

    return jsonify(response)


@app.route("/getTickerData", methods=["GET"])
@cross_origin()
def getTickerData():
    if "symbol" in request.args and "date" in request.args:
        symbol = request.args["symbol"]
        date = request.args["date"]
    else:
        return "Error: Request was not properly formatted"
    company = yf.Ticker(symbol)

    if date == "1d":
        dataInterval = "5m"
    elif date == "5d":
        dataInterval = "30m"
    elif date == "1mo" or date == "1y":
        dataInterval = "1d"
    else:
        dataInterval = "1mo"

    # extract more info if needed
    # print(company.info)
    info = {}
    info["shortName"] = company.info["shortName"]
    info["currency"] = company.info["currency"]
    info["symbol"] = company.info["symbol"]

    data = company.history(period=date, interval=dataInterval)
    # print(data)
    data = data.reset_index()
    if date == "1d" or date == "5d":
        data = data[["Datetime", "Close"]]
        data.columns = ["Date", "Close"]

    else:
        data = data[["Date", "Close"]]

    data = data.dropna()
    data["Close"] = data["Close"].round(2)
    data = data.to_dict("records")

    prevClose = company.info["previousClose"]
    curr = data[-1]["Close"]
    difference = round(curr - prevClose, 2)
    percentChange = round((curr - prevClose) / prevClose * 100, 2)
    firstClose = data[0]["Close"]

    # color of the graph
    if curr - firstClose > 0:
        color = "#43a047"
    elif curr - firstClose < 0:
        color = "#d50000"
    else:
        color = "#757575"

    # color of the percent change
    if difference > 0:
        percentChangeColor = "#43a047"
        difference = "+" + str(difference)
        percentChange = "+" + str(percentChange)
    elif difference < 0:
        percentChangeColor = "#d50000"
    else:
        percentChangeColor = "#757575"

    info["color"] = color
    info["percentChangeColor"] = percentChangeColor
    info["difference"] = difference
    info["percentChange"] = percentChange
    info["curr"] = curr

    return_data = {}
    return_data["data"] = data
    return_data["info"] = info
    return_data["key"] = random.uniform(0, 1)
    jsonify(return_data)
    return return_data


if __name__ == "__main__":
    app.run(threaded=True, port=5000)