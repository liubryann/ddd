from flask import Flask, request, jsonify
import yfinance as yf 
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
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

    response["individualAverage"] = "Positive (10)"
    response["institutionalAverage"] = "Negative (-10)"

    individual = []

    post1 = {}
    post1["title"] = "Title 1"
    post1["summary"] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
    post1["sentiment"] = 0
    post1["time"] = "5 hours ago"
    post1["link"] = "https://reddit.com/wallstreetbets"

    individual.append(post1)

    post2 = {}
    post2["title"] = "Title 2"
    post2["summary"] = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec "
    post2["sentiment"] = 5
    post2["time"] = "10 days ago"
    post2["link"] = "https://reddit.com/stocks"

    individual.append(post2)

    post3 = {}
    post3["title"] = "Title 3"
    post3["summary"] = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec "
    post3["sentiment"] = 4
    post3["time"] = "10 days ago"
    post3["link"] = "https://reddit.com/stocks"

    individual.append(post3)

    post4 = {}
    post4["title"] = "Title 4"
    post4["summary"] = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."
    post4["sentiment"] = 3
    post4["time"] = "10 days ago"
    post4["link"] = "https://reddit.com/stocks"

    individual.append(post4)

    post5 = {}
    post5["title"] = "Title 5"
    post5["summary"] = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."
    post5["sentiment"] = 2
    post5["time"] = "10 days ago"
    post5["link"] = "https://reddit.com/stocks"

    individual.append(post5)


    response["individual"] = individual 
    response["institutional"] = individual

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
    info["symbol"] = company.info["symbol"]

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

    # color of the graph 
    if curr - firstClose > 0:
        color = '#43a047'
    elif curr - firstClose < 0: 
        color = '#d50000'
    else:
        color = '#757575'

    # color of the percent change 
    if difference > 0:
        percentChangeColor = '#43a047'
        difference = "+" + str(difference)
        percentChange = "+" + str(percentChange)
    elif difference < 0:
        percentChangeColor = '#d50000'
    else:
        percentChangeColor = '#757575'

    
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

if __name__ == '__main__':
    app.run(threaded=True, port=5000)