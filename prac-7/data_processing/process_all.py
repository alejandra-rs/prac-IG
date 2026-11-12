import json
import math
from itertools import islice
from collections import Counter, defaultdict
from statistics import median_low
import searoute
from common import DATA_DIR, is_number, is_valid_coordinate
from noaa import process as noaa
from zhao import process as zhao
from pangaea import process as pangaea
from oecd import process as oecd
from cowger import process as cowger
from comtrade import process as comtrade
from unctad import process as unctad
from spatial_finance import process as spatial_finance
from wikidata import process as wikidata

OUTPUT = DATA_DIR / "processed" / "data.json"
SQUARE_SIZE_DEGREES = 2
MIDWATER = (10, 200)
DEEP_FROM = 200
TOP_COMPANIES = 10
TOP_ROUTES = 50
SHORTEST_ROUTE_KM = 2000


def cells(points):
    groups = defaultdict(list)
    for p in points:
        groups[(square(p["lat"], 89.999), square(p["lon"], 179.999))].append(p)
    return [(centre(row), centre(column), group) for (row, column), group in sorted(groups.items())]

def layer(samples):
    return [[lat, lon] for lat, lon, _ in cells(samples)]

def surface_layer():
    return [[lat, lon, median_low(s["class"] for s in group)] for lat, lon, group in cells(noaa.surface_samples())]

def square(degrees, limit):
    return math.floor(min(degrees, limit) / SQUARE_SIZE_DEGREES)

def centre(index):
    return index * SQUARE_SIZE_DEGREES + SQUARE_SIZE_DEGREES / 2


def below_surface_samples():
    found = (s for s in zhao.samples() + noaa.below_surface_samples() + pangaea.samples()
             if all(is_number(s[f]) for f in ("lat", "lon", "depth", "abundance")) and is_valid_coordinate(s["lat"], s["lon"]) and s["abundance"] > 0)
    return list({(s["lat"], s["lon"], s["depth"], s["medium"]): s for s in found}.values())


def takeout_brands(names):
    return [names[q] for q in cowger.companies_by_items() if q in names][:TOP_COMPANIES]

def takeout_places(names):
    places = [takeout_place(group, names) for _, _, group in cells(i for i in cowger.found_items() if i["id"] in names)]
    return sorted(places, key=lambda place: -place["items"])

def takeout_place(found, names):
    spots, brands = Counter(), Counter()
    for f in found:
        spots[(f["place"], f["lat"], f["lon"])] += f["items"]
        brands[names[f["id"]]] += f["items"]
    (place, lat, lon), _ = spots.most_common(1)[0]
    return {"place": place.title(), "lat": round(lat, 3), "lon": round(lon, 3), "items": int(sum(brands.values())), "brand": brands.most_common(1)[0][0]}


def waste_routes():
    ports = unctad.main_ports()
    flows = [f for f in comtrade.flows() if f["from"] in ports and f["to"] in ports and f["from"] != f["to"] and wikidata.can_ship(f["from"], f["to"])]
    routes = (route(ports[f["from"]], ports[f["to"]], f["weight"]) for f in sorted(flows, key=lambda f: -f["weight"]))
    return list(islice((r for r in routes if r), TOP_ROUTES))

def route(origin, destination, weight):
    line = searoute.searoute([origin["lon"], origin["lat"]], [destination["lon"], destination["lat"]])
    if line.properties["length"] < SHORTEST_ROUTE_KM:
        return None
    return {"from": origin, "to": destination, "tonnes": round(weight / 1000), "path": [[round(lat, 2), round(lon, 2)] for lon, lat in line.geometry["coordinates"]]}


if __name__ == "__main__":
    below, names = below_surface_samples(), wikidata.takeout_names()
    data = {"surface": surface_layer(),
            "midwater": layer([s for s in below if s["medium"] == "water" and MIDWATER[0] < s["depth"] <= MIDWATER[1]]),
            "deep": layer([s for s in below if s["depth"] > DEEP_FROM]),
            "oceanStock": oecd.ocean_stock(), "takeout": takeout_places(names), "takeoutBrands": takeout_brands(names), "wasteRoutes": waste_routes(), "ethylene": spatial_finance.plants()}
    OUTPUT.write_text(json.dumps(data, separators=(",", ":")))
    print(f"{OUTPUT.name}: {OUTPUT.stat().st_size} bytes")
