from functools import cache

from common import read_json

TAKEOUT_KINDS = ("fast food", "fast-food", "restaurant chain", "café chain", "cafe chain", "coffeehouse chain", "quick service")


def takeout_names():
    return {q: company["name"] for q, company in read_json("wikidata/companies.json").items()
            if any(term in kind.lower() for kind in company["kinds"] for term in TAKEOUT_KINDS)}

@cache
def countries():
    return read_json("wikidata/countries.json")

def can_ship(origin, destination):
    return is_coastal(origin) and is_coastal(destination) and not are_neighbours(origin, destination) and not are_neighbours(destination, origin)

def is_coastal(code):
    return not countries().get(code, {}).get("landlocked", True)

def are_neighbours(code, other):
    return other in countries().get(code, {}).get("neighbours", [])
