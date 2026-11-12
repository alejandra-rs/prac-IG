from common import fetch, save

URL = "https://zenodo.org/records/10849603/files/wincowgerDEV/BFFP-FinalPub.zip?download=1"


def download():
    save("cowger/brand_audits.zip", fetch(URL))
