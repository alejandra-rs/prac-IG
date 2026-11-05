import json
import urllib.request
from datetime import date
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
HEADERS = {"User-Agent": "plastic-globe-student-project"}
NOAA_LAYER = ("https://services2.arcgis.com/C8EMgrsFcRFL6LrL/arcgis/rest/services/"
              "Hub_Microplastics_Replace/FeatureServer/0")
PAGE_SIZE = 1000


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as response:
        return response.read()

def fetch_json(url):
    return json.loads(fetch(url))

def oecd_url(dataflow):
    return (f"https://sdmx.oecd.org/public/rest/data/OECD.ENV.EEI,{dataflow},/all"
            "?dimensionAtObservation=AllDimensions&format=csvfilewithlabels")

def noaa_count():
    return fetch_json(f"{NOAA_LAYER}/query?where=1%3D1&returnCountOnly=true&f=json")["count"]

def noaa_page(offset):
    query = f"where=1%3D1&outFields=*&returnGeometry=false&orderByFields=ObjectId&resultOffset={offset}&f=json"
    return [feature["attributes"] for feature in fetch_json(f"{NOAA_LAYER}/query?{query}")["features"]]

def noaa_records():
    expected = noaa_count()
    records = [record for offset in range(0, expected, PAGE_SIZE) for record in noaa_page(offset)]
    assert len(records) == expected, f"NOAA: expected {expected} records, got {len(records)}"
    return json.dumps(records).encode()

def save(target, content):
    path = RAW_DIR / target
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    print(f"{target}: {len(content)} bytes")



SOURCES = {
    "noaa/microplastics.json": noaa_records,
    "oecd/DF_PL.csv": lambda: fetch(oecd_url("DSD_PL@DF_PL")),
    "oecd/DF_PL_P.csv": lambda: fetch(oecd_url("DSD_PL_P@DF_PL_P")),
    "zhao/multiple_depths.xlsx": lambda: fetch("https://ndownloader.figshare.com/files/51531731"),}

if __name__ == "__main__":
    for target, download in SOURCES.items():
        save(target, download())
    save("ACCESSED.txt", f"{date.today().isoformat()}\n".encode())
