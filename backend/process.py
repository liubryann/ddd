from backend.nlp.nlp import process
from argparse import ArgumentParser
import json
import concurrent.futures as cf


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


def truncate_text(text):
    return " ".join(text.split(" ")[:81]).strip() + "..."


def analyze(data):
    total_sentiment = 0
    total_magnitude = 0

    def analyze_subprocess(entry):
        nonlocal total_magnitude
        nonlocal total_sentiment
        result = json.loads(process(entry["data"]))
        sentiment_result = result["sentiment_details"]

        if result["summary"] == "":
            summary = truncate_text(entry["data"])
        else:
            result["summary"] = result["summary"].replace("\n", " ").strip()
            summary = (
                result["summary"]
                if len(result["summary"]) < 400
                else truncate_text(result["summary"])
            )

        total_sentiment += sentiment_result["sentiment"]
        total_magnitude += sentiment_result["magnitude"]
        return {
            "title": entry["title"],
            "summary": summary,
            "sentiment": feeling(
                sentiment_result["sentiment"],
                sentiment_result["magnitude"],
            ),
            "time": entry["time"],
            "link": entry["url"],
        }

    analyzed_data = []
    with cf.ThreadPoolExecutor(1000) as executor:
        all_futures = [executor.submit(analyze_subprocess, entry) for entry in data]
        for future in cf.as_completed(all_futures):
            try:
                analyzed_data.append(future.result())
            except:
                pass

    count = len(data)
    avg_sentiment = 0
    if count != 0:
        avg_sentiment = feeling(total_sentiment / count, total_magnitude / count)

    return analyzed_data, avg_sentiment


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