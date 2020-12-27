import praw, re, pyjq, json, os, requests, redditcleaner, unidecode
from datetime import date, datetime
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

TIME_MAP = {"1d": "day", "1mo": "month", "5d": "week", "1y": "year", "max": "all"}


class Scraper:
    def __init__(self, client_id, client_secret, user_agent, query, time_filter="1mo"):
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent,
        )
        self.query = query
        self.time_filter = time_filter
        self.newsapi = NewsApiClient(api_key=NEWS_API_KEY)

    def scrapeReddit(self):
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
                executor.submit(self.scrapeSubreddit, result, subreddit, 15)
                for subreddit in subreddits
            ]
        return result

    def scrapeSubreddit(
        self,
        data,
        subreddit,
        limit=10,
    ):
        try:
            timeframe = TIME_MAP[self.time_filter]
        except:
            timeframe = "month"
        result = self.reddit.subreddit(subreddit).search(
            self.query, sort="relevance", time_filter=timeframe
        )
        result.limit = limit
        self.postFormatter(result, data)

    def scrapeNYT(self):
        begin_date, end_date = self.getDates(self.time_filter, True)
        requestUrl = (
            "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date="
            + begin_date
            + "&end_date="
            + end_date
            + "&q="
            + self.query
            + "&sort=relevance&api-key="
            + NYT_KEY
        )
        requestHeaders = {"Accept": "application/json"}
        parsed = requests.get(requestUrl, headers=requestHeaders).json()
        obj = pyjq.all(
            '.response.docs[] | {"title": .headline.print_headline, "data": (.headline.main + ". " + .abstract + " " + .lead_paragraph), "url": .web_url} ',
            parsed,
        )
        obj = json.loads(self.clean(json.dumps(obj)))
        return obj

    def scrapeNewsAPI(self):
        begin_date, end_date = self.getDates(self.time_filter)
        begin_date = begin_date + relativedelta(days=+1)
        result = self.newsapi.get_everything(
            q=self.query,
            sources="bbc-news,bloomberg,cbc-news,financial-post,fortune",
            from_param=begin_date,
            to=end_date,
            language="en",
        )
        return self.newsAPIFormatter(result) if result != None else None

    def getDates(self, time_range, format_dates=False):
        # defaults to 1 month
        end_date = date.today()
        if time_range == "1d":
            begin_date = end_date
        elif time_range == "5d":
            begin_date = end_date + relativedelta(days=-7)
        elif time_range == "1y":
            begin_date = end_date + relativedelta(years=-1)
        elif time_range == "max":
            begin_date = end_date + relativedelta(years=-10)
        else:
            begin_date = end_date + relativedelta(months=-1)
        if format_dates:
            end_date = str(end_date).replace("-", "")
            begin_date = str(begin_date).replace("-", "")
        return begin_date, end_date

    def clean(self, text):
        regex = re.compile("<.*?>")
        text = re.sub(regex, " ", text)
        return unidecode.unidecode(text.replace("\r\n", " ").replace("\n", " ")).strip()

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
                retPost["data"] = re.sub(regex, "", retPost["data"]).strip()
                published_date = datetime.strptime(
                    post["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
                )
                retPost["time"] = self.pretty_time(published_date)
                retPosts.append(retPost)
            except:
                continue

        return retPosts

    def postFormatter(self, posts, retPosts):
        for post in posts:
            if len(post.selftext) >= 100:
                retPost = {}
                retPost["title"] = self.clean(post.title)
                retPost["url"] = post.url
                retPost["data"] = (
                    self.clean(redditcleaner.clean(post.selftext))
                    .replace("&x200B;", "")
                    .strip()
                )
                retPost["time"] = datetime.fromtimestamp(post.created_utc)
                retPost["time"] = self.pretty_time(retPost["time"])
                retPosts.append(retPost)

    def pretty_time(self, start_date):
        rd = relativedelta(datetime.now(), start_date)
        relative_string = ""
        for period in ["years", "months", "days", "hours", "minutes"]:
            time_attr = getattr(rd, period)
            if time_attr > 1:
                relative_string = f"{time_attr} { period }, "
            elif time_attr == 1:
                relative_string = f"{time_attr} { period[:-1] }, "
            if relative_string != "":
                break

        return relative_string[:-2] + " ago" if relative_string != "" else "just now"


def scrape(query, time_filter):
    scraper = Scraper(CLIENT_ID, CLIENT_SECRET, USER_AGENT, query, time_filter)
    individual = scraper.scrapeReddit()
    if time_filter == "1y" or time_filter == "max":
        institutional = scraper.scrapeNYT()
    else:
        institutional = scraper.scrapeNewsAPI()
    return individual, institutional


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

    ret1, ret2 = scrape(query, timeframe)
    ret = {"institutional": ret2, "individual": ret1}
    with open("dump.json", "w") as f:
        f.write(json.dumps(ret))
