from common import fetch_json, save

LAYER = ("https://services2.arcgis.com/C8EMgrsFcRFL6LrL/arcgis/rest/services/"
         "Hub_Microplastics_Replace/FeatureServer/0/query?where=1%3D1&f=json")
PAGE_SIZE = 1000


def download():
    expected = fetch_json(f"{LAYER}&returnCountOnly=true")["count"]
    records = [record for offset in range(0, expected, PAGE_SIZE) for record in page(offset)]
    assert len(records) == expected, f"NOAA: expected {expected} records, got {len(records)}"
    save("noaa/microplastics.json", records)

def page(offset):
    query = f"&outFields=*&returnGeometry=false&orderByFields=ObjectId&resultOffset={offset}"
    return [feature["attributes"] for feature in fetch_json(LAYER + query)["features"]]
