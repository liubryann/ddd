import flask
from flask import request, jsonify
import yfinance as yf 
from flask_cors import CORS, cross_origin
import pandas as pd
import json
from datetime import timezone
import random

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/getAnalysis', methods=['GET'])
@cross_origin()
def get_analysis():
    if 'symbol' in request.args and 'date' in request.args:
        symbol = request.args['symbol']
        date = request.args['date']
    else:
        return "Error: Request was not properly formatted"

    response = {}

    # call redis
    # if redis response is not data, call scraper
    # forward scraper response to analyzer
    return jsonify(response)

@app.route('/getTickerData', methods=['GET'])
@cross_origin()
def getTickerData():
    if 'symbol' in request.args and 'date' in request.args:
        symbol = request.args['symbol']
        date = request.args['date']
    else:
        return "Error: Request was not properly formatted"
    company = yf.Ticker(symbol)
    
    if (date == "1d"):
        dataInterval = "5m"
    elif (date == "5d"):
        dataInterval = "30m"
    elif (date == "1mo" or date == "1y"):
        dataInterval = "1d"
    else:
        dataInterval = "1mo"
    
    # extract more info if needed
    # print(company.info)
    info = {}
    info["shortName"] = company.info["shortName"] 
    info["currency"] = company.info["currency"]

    data = company.history(period=date, interval=dataInterval)
    # print(data)
    data = data.reset_index()
    if (date == "1d" or date == "5d"):
        data = data[["Datetime", "Close"]]
        data.columns = ['Date', 'Close']

    else:
        data = data[["Date", "Close"]]

    data = data.dropna()
    data["Close"] = data["Close"].round(2)
    data = data.to_dict('records')

    prevClose = company.info["previousClose"]
    curr = data[-1]["Close"]
    difference = round(curr - prevClose, 2)
    percentChange = round((curr - prevClose) / prevClose * 100, 2)
    firstClose = data[0]["Close"]

    if curr - firstClose >= 0: 
        color = "green"
    else: 
        color = "red"
    
    info["color"] = color
    info["difference"] = difference
    info["percentChange"] = percentChange
  
    return_data = {}
    return_data["data"] = data
    return_data["info"] = info
    return_data["key"] = random.uniform(0, 1)
    jsonify(return_data)
    return return_data


app.run()