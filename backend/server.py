import flask
from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/getAnalysis', methods=['GET'])
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


app.run()