import flask
from flask import request, jsonify
import yfinance as yf 
from flask_cors import CORS, cross_origin
import pandas as pd
import json

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
        dataInterval = "30m"
    elif (date == "5d"):
        dataInterval = "30m"
    elif (date == "1mo" or date == "1y"):
        dataInterval = "1d"
    else:
        dataInterval = "1wk"
    
    # extract more info if needed
    info = company.info["shortName"] 
    data = company.history(period=date, interval=dataInterval)
    data = data.reset_index()
    if (date == "1d"):
        data = data[["Datetime", "Close"]]
        data["Datetime"] = data["Datetime"].apply(lambda t: t.strftime('%H:%M'))
    elif (date == "5d"): 
        data = data[["Datetime", "Close"]]
    elif (date == "1mo" or date == "1y"):
        data = data[["Date", "Close"]]
        # data["Date"] = data["Date"].apply(lambda t: t.strftime('%B %d'))

        # data["Datetime"] = data["Datetime"].apply(lambda t: t.strftime('%b. %d'))

    else:
        data = data[["Date", "Close"]]
        
    data = data.to_dict('records')

    return_data = {}
    return_data["data"] = data
    return_data["info"] = info
    # return_data = json.dumps(return_data, default=str)
    jsonify(return_data)
    # return_data = jsonify(return_data)
    return return_data


app.run()