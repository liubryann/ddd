# pip install -r requirements.txt
import praw
import re
from datetime import date
from dateutil.relativedelta import relativedelta
import pyjq
import json
import os
from argparse import ArgumentParser
from dotenv import load_dotenv
import requests

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT")
NYT_KEY = os.getenv("NYT_KEY")


class Scraper:
    def __init__(self, client_id, client_secret, user_agent):
        self.reddit = praw.Reddit(
            client_id=client_id, client_secret=client_secret, user_agent=user_agent,
        )

    def hotPostsReddit(self, subreddit="investing", limit=10):
        hot_posts = self.reddit.subreddit(subreddit).hot(limit=limit)
        return self.postFormatter(hot_posts)

    def postFormatter(self, posts):
        retPosts = []
        for post in posts:
            retPost = {}
            retPost["title"] = post.title
            retPost["url"] = post.url
            retPost["data"] = re.sub(
                r'[^\x00-\x7F]+', ' ',  post.selftext.replace("\n", ""))
            # retPost["data"] = post.selftext.replace("\n", "").encode("unicode-escape").decode('utf8')
            retPosts.append(retPost)
        return retPosts

    def scrapeReddit(
        self, query, subreddit="investing", limit=10, time_filter="month",
    ):
        result = self.reddit.subreddit(subreddit).search(
            query, sort="relevance", time_filter=time_filter
        )
        result.limit = limit
        return self.postFormatter(result)

    def scrapeNYT(self, query, time_filter="month"):
        end_date = date.today()
        if time_filter == "month":
            begin_date = end_date + relativedelta(months=-1)
        elif time_filter == "day":
            begin_date = end_date
        elif time_filter == "week":
            begin_date = end_date + relativedelta(days=-7)
        elif time_filter == "year":
            begin_date = end_date + relativedelta(years=-1)
        elif time_filter == "all":
            begin_date = end_date + relativedelta(years=-10)
        else:
            return None
        end_date = str(end_date).replace("-", "")
        begin_date = str(begin_date).replace("-", "")

        requestUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=" + \
            begin_date+"&end_date="+end_date+"&q=" + \
            query+"&sort=relevance&api-key=" + NYT_KEY
        requestHeaders = {
            "Accept": "application/json"
        }
        parsed = requests.get(requestUrl, headers=requestHeaders).json()
        # with open("test1.json", "w") as f1:
        obj = pyjq.all(
            '.response.docs[] | {"title": .headline.print_headline, "data": (.headline.main + ". " + .abstract + " " + .lead_paragraph), "url": .web_url} ', parsed
        )
        obj = json.loads(re.sub(r'[^\x00-\x7F]+', ' ', json.dumps(obj)))
        return obj


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

    scraper = Scraper(CLIENT_ID, CLIENT_SECRET, USER_AGENT)
    ret = {"people": scraper.scrapeReddit(
        query, time_filter=timeframe), "corporation": scraper.scrapeNYT(query, timeframe)}
    with open("dump.json", "w") as f:
        f.write(json.dumps(ret))
