from redistimeseries.client import Client

rts = Client()
try:
    rts.create("ddd-scraper")
    rts.create("ddd-ticker")
except:
    pass


def get_scraped_data():
    pass


def get_data_analysis():
    pass


def set_scraped_data():
    pass


def set_data_analysis():
    pass
