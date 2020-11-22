import webscraper.scraper as sc
from nlp.nlp import process as p
from argparse import ArgumentParser
from dotenv import load_dotenv
import json
import os
load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT")
NYT_KEY = os.getenv("NYT_KEY")


def feeling(num, mag):
    feeling = "Neutral";
    sentiment_num = abs(num);
    if sentiment_num > 0.5:
        feeling = "Strongly "
    elif sentiment_num > 0.25:
        feeling = "";
    elif sentiment_num >= 0:
        if mag > 2: 
            feeling = "Mixed"
        else:
            feeling = "Neutral"
    if num >= 0.25:
        feeling += "Positive"
    elif num <= -0.25:
        feeling += "Negative"
    return feeling


if __name__ == "__main__":
    parser = ArgumentParser(
        description="Get information about articles from various news sources.")
    parser.add_argument('query',
                        type=str,
                        help="Query to search for")
    parser.add_argument('timeframe',
                        type=str,
                        default="month",
                        help="A time frame, choose between day, week, month, year and all (default: month)")
    args = parser.parse_args()
    query = args.query
    timeframe = args.timeframe

    scraper = sc.Scraper(CLIENT_ID, CLIENT_SECRET, USER_AGENT)
    ret = {"people": scraper.scrapeReddit(
        query, time_filter=timeframe), "corporation": scraper.scrapeNYT(query, timeframe)}

    result = {
        "people": [],
        "corporation": [],
        "peopleAVG": 0,
        "corporationAVG": 0
    }
    ppl_sentiment = 0
    ppl_magnitude = 0
    corp_sentiment = 0
    corp_magnitude = 0
    for data in ret["people"]:
        if len(data["data"].split('.')) > 1:
            print(data["data"])
            r = json.loads(p(data["data"]))
            ppl_sentiment += r["sentiment_details"]["sentiment"]
            ppl_magnitude += r["sentiment_details"]["magnitude"]
            result["people"].append({
            "title": data["title"],
            "summary": r["summary"],
            "sentiment": feeling(r["sentiment_details"]["sentiment"], r["sentiment_details"]["magnitude"])
        })
        else:
            pass

    for data in ret["corporation"]:
        if len(data["data"].split('.')) > 1:
            print(data["data"])
            r = json.loads(p(data["data"]))
            corp_sentiment += r["sentiment_details"]["sentiment"]
            corp_magnitude += r["sentiment_details"]["magnitude"]
            result["corporation"].append({
            "title": data["title"],
            "summary": r["summary"],
            "sentiment": feeling(r["sentiment_details"]["sentiment"], r["sentiment_details"]["magnitude"])
        })
        else:
            pass
        ppl = len(ret["people"])
        corp = len(ret["corporation"])
        if ppl != 0:
            result["peopleAVG"] = feeling(ppl_sentiment/ppl, ppl_magnitude/ppl)
        if corp != 0:    
            result["corporationAVG"] = feeling(corp_sentiment/corp, corp_magnitude/corp)
    print(result)
    with open("dump.json", "w") as f:
        f.write(json.dumps(result))
