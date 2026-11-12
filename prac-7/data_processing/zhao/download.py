from common import fetch, save

URL = "https://ndownloader.figshare.com/files/51531731"


def download():
    save("zhao/multiple_depths.xlsx", fetch(URL))
