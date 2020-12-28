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
    return " ".join(text.split(" ")[:66]).strip() + "..."


def analyze(data):
    total_sentiment = 0
    total_magnitude = 0

    def analyze_subprocess(entry):
        """
        modifies a dictionary inplace*
        """
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
                if len(result["summary"]) < 300
                else truncate_text(result["summary"])
            )

        total_sentiment += sentiment_result["sentiment"]
        total_magnitude += sentiment_result["magnitude"]
        entry.update(
            {
                "summary": summary,
                "sentiment": feeling(
                    sentiment_result["sentiment"],
                    sentiment_result["magnitude"],
                ),
            }
        )
        entry["link"] = entry.pop("url")
        entry.pop("data")

    with cf.ThreadPoolExecutor(1000) as executor:
        for index in range(len(data)):
            executor.submit(analyze_subprocess, data[index])
    count = len(data)
    avg_sentiment = 0
    if count != 0:
        avg_sentiment = feeling(total_sentiment / count, total_magnitude / count)

    return avg_sentiment


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