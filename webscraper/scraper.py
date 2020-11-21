# pip install -r requirements.txt
import praw
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT")


class Scraper:
    def __init__(self, client_id, client_secret, user_agent):
        self.reddit = praw.Reddit(
            client_id=client_id, client_secret=client_secret, user_agent=user_agent,
        )

    def basic(self, subreddit: str, limit: int) -> pd.DataFrame:
        hot_posts = self.reddit.subreddit(subreddit).hot(limit=limit)
        return self.postFormatter(hot_posts)

    def postFormatter(self, posts: pd.DataFrame) -> pd.DataFrame:
        retPosts = []
        for post in posts:
            retPosts.append(
                [post.title, post.score, post.subreddit, post.url, post.selftext]
            )
        return pd.DataFrame(
            retPosts, columns=["Title", "Upvotes", "Subreddit", "URL", "Body"]
        )

    def search(
        self, query, subreddit, limit, time_filter,
    ):
        result = self.reddit.subreddit(subreddit).search(
            query, sort="relevance", time_filter=time_filter
        )
        result.limit = limit
        return self.postFormatter(result)


if __name__ == "__main__":
    scraper = Scraper(CLIENT_ID, CLIENT_SECRET, USER_AGENT)
    # print(scraper.basic("investing", 10))
    print(scraper.search("NIO", "investing", 10, "month"))

