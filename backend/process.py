from backend.nlp.nlp import process
from argparse import ArgumentParser
from dotenv import load_dotenv
import json, os
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT")
NYT_KEY = os.getenv("NYT_KEY")


def feeling(num, mag):
    feeling = 0
    sentiment_num = abs(num)
    if sentiment_num > 0.5:
        if num >= 0.25:
            feeling = 5
        elif num <= -0.25:
            feeling = 1
    elif sentiment_num > 0.25:
        if num >= 0.25:
            feeling = 4
        elif num <= -0.25:
            feeling = 2
    elif sentiment_num >= 0:
        if mag > 2:
            feeling = 3
    return feeling


def analyze(data):
    total_sentiment = 0
    total_magnitude = 0
    analyzed_data = []
    for entry in data:
        # if len(entry["data"].split(".")) > 1:
        result = json.loads(process(entry["data"]))["sentiment_details"]
        total_sentiment += result["sentiment"]
        total_magnitude += result["magnitude"]
        analyzed_data.append(
            {
                "title": entry["title"],
                # "summary": entry["data"],
                "summary": result["summary"],
                "sentiment": feeling(
                    result["sentiment"],
                    result["magnitude"],
                ),
                "time": entry["time"],
                "link": entry["url"],
            }
        )
    count = len(data)
    avg_sentiment = 0
    if count != 0:
        print(total_sentiment)
        print(total_magnitude)
        print(count)
        avg_sentiment = feeling(total_sentiment / count, total_magnitude / count)

    return analyzed_data, avg_sentiment

def analyze_subprocess():



if __name__ == "__main__":
    parser = ArgumentParser(
        description="Get information about articles from various news sources."
    )
    parser.add_argument("query", type=str, help="Query to search for")
    parser.add_argument(
        "timeframe",
        type=str,
        default="month",
        help="A time frame, choose between day, week, month, year and all (default: month)",
    )
    args = parser.parse_args()
    query = args.query
    timeframe = args.timeframe