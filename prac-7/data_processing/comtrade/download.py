import time
import urllib.error
import urllib.parse

from common import fetch, fetch_json, save

EXPORTS = "https://comtradeapi.un.org/public/v1/preview/C/A/HS"
COUNTRIES = "https://comtradeapi.un.org/files/v1/app/reference/partnerAreas.json"
PLASTIC_WASTE_CODE = "3915"
TRADE_YEAR = 2023
TOP_EXPORTERS = 25
WAIT_SECONDS = (3, 30, 60, 90, 120)


def download():
    save("comtrade/countries.json", fetch(COUNTRIES))
    top = sorted(exports(reporterCode="", partnerCode=0), key=lambda row: -(row["netWgt"] or 0))[:TOP_EXPORTERS]
    save("comtrade/plastic_waste_flows.json", [flow for row in top for flow in exports(reporterCode=row["reporterCode"])])

def exports(**filters):
    query = urllib.parse.urlencode({"period": TRADE_YEAR, "cmdCode": PLASTIC_WASTE_CODE, "flowCode": "X", **filters})
    for wait in WAIT_SECONDS:
        time.sleep(wait)
        try:
            return fetch_json(f"{EXPORTS}?{query}")["data"]
        except urllib.error.HTTPError as error:
            if error.code != 429:
                raise
    raise RuntimeError("Comtrade kept answering 'too many requests'")
