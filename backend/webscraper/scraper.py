import praw, re, pyjq, json, os, requests
from datetime import date
from dateutil.relativedelta import relativedelta
from argparse import ArgumentParser
from dotenv import load_dotenv
from newsapi import NewsApiClient
import concurrent.futures as cf

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NYT_KEY = os.getenv("NYT_KEY")

TIME_MAP = {"1d": "day", "1mo": "month", "5d": "week", "1yr": "year", "max": "all"}


class Scraper:
    def __init__(self, client_id, client_secret, user_agent):
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent,
        )
        self.newsapi = NewsApiClient(api_key=NEWS_API_KEY)

    def postFormatter(self, posts, retPosts):
        for post in posts:
            if len(post.selftext) >= 100:
                retPost = {}
                retPost["title"] = self.clean(post.title)
                retPost["url"] = post.url
                regex = re.compile("\[.*?\]\(.*?\)")
                retPost["data"] = re.sub(regex, "", self.clean(post.selftext).strip())
                if len(retPost["data"]) > 400:
                    retPost["data"] = retPost["data"][:401].strip() + "..."
                retPosts.append(retPost)

    def scrapeReddit(
        self,
        query,
        time_filter="1mo",
    ):
        subreddits = [
            "investing",
            "stocks",
            "news",
            "business",
            "worldnews",
        ]
        result = []
        with cf.ThreadPoolExecutor(1000) as executor:
            [
                executor.submit(
                    self.scrapeSubreddit, query, result, subreddit, 15, time_filter
                )
                for subreddit in subreddits
            ]
        return result

    def scrapeSubreddit(
        self,
        query,
        data,
        subreddit="investing",
        limit=10,
        time_filter="1mo",
    ):
        try:
            time_filter = TIME_MAP[time_filter]
        except:
            time_filter = "month"
        result = self.reddit.subreddit(subreddit).search(
            query, sort="relevance", time_filter=time_filter
        )
        result.limit = limit
        self.postFormatter(result, data)

    def getDates(self, time_range, format_dates=False):
        # defaults to 1 month
        end_date = date.today()
        if time_range == "1d":
            begin_date = end_date
        elif time_range == "5d":
            begin_date = end_date + relativedelta(days=-7)
        elif time_range == "1yr":
            begin_date = end_date + relativedelta(years=-1)
        elif time_range == "max":
            begin_date = end_date + relativedelta(years=-10)
        else:
            begin_date = end_date + relativedelta(months=-1)
        if format_dates:
            end_date = str(end_date).replace("-", "")
            begin_date = str(begin_date).replace("-", "")
        return begin_date, end_date

    def scrapeNYT(self, query, time_filter="1mo"):
        begin_date, end_date = self.getDates(time_filter, True)
        requestUrl = (
            "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date="
            + begin_date
            + "&end_date="
            + end_date
            + "&q="
            + query
            + "&sort=relevance&api-key="
            + NYT_KEY
        )
        requestHeaders = {"Accept": "application/json"}
        parsed = requests.get(requestUrl, headers=requestHeaders).json()
        # with open("test1.json", "w") as f1:
        obj = pyjq.all(
            '.response.docs[] | {"title": .headline.print_headline, "data": (.headline.main + ". " + .abstract + " " + .lead_paragraph), "url": .web_url} ',
            parsed,
        )
        obj = json.loads(re.sub(r"[^\x00-\x7F]+", " ", json.dumps(obj)))
        return obj

    def scrapeNewsAPI(self, query, time_filter="1mo"):
        begin_date, end_date = self.getDates(time_filter)
        result = self.newsapi.get_everything(
            q=query,
            # sources="fortune,bloomberg,business-insider",
            sources="bbc-news,bloomberg,cbc-news,financial-post,fortune",
            from_param=begin_date,
            to=end_date,
            language="en",
        )
        return self.newsAPIFormatter(result) if result != None else None

    def clean(self, text):
        regex = re.compile("<.*?>")
        text = re.sub(regex, " ", text)
        return re.sub(r"[^\x00-\x7F]+", " ", text.replace("\n", "").replace("\r", ""))

    def newsAPIFormatter(self, posts):
        retPosts = []
        for post in posts["articles"]:
            retPost = {}
            try:
                retPost["title"] = self.clean(post["title"])
                retPost["url"] = post["url"]
                if len(post["description"]) < 100:
                    retPost["data"] = self.clean(post["content"])
                else:
                    retPost["data"] = self.clean(post["description"])
                regex = re.compile("\[.*?\]")
                retPost["data"] = re.sub(regex, "...", retPost["data"]).strip()
                retPosts.append(retPost)
            except:
                continue

        return retPosts

def main(query, timeframe):
    scraper = Scraper(CLIENT_ID, CLIENT_SECRET, USER_AGENT)
    ret = {
        "people": scraper.scrapeReddit(query, time_filter=timeframe),
        "corporation": scraper.scrapeNewsAPI(query, time_filter=timeframe),
    }
    with open("dump.json", "w") as f:
        f.write(json.dumps(ret))


if __name__ == "__main__":
    parser = ArgumentParser(
        description="Get information about articles from various news sources."
    )
    parser.add_argument("query", type=str, help="Query to search for")
    parser.add_argument(
        "timeframe",
        type=str,
        default="1mo",
        help="A time frame, choose between day, week, month, year and all (default: month)",
    )
    args = parser.parse_args()
    query = args.query
    timeframe = args.timeframe

    main(query, timeframe)
