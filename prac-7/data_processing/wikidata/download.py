import urllib.parse
from collections import defaultdict

from common import fetch_json, save
from cowger.process import company_ids
from comtrade.process import country_codes

URL = "https://query.wikidata.org/sparql"
HEADERS = {"User-Agent": "plastic-globe-student-project/1.0", "Accept": "application/sparql-results+json"}
BATCH_SIZE = 150

COMPANIES_QUERY = """SELECT ?company ?companyLabel ?kindLabel WHERE {
  VALUES ?company { %s }
  OPTIONAL { { ?company wdt:P31 ?kind } UNION { ?company wdt:P452 ?kind } }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }"""

COUNTRIES_QUERY = """SELECT ?code ?landlocked ?neighbourCode WHERE {
  VALUES ?code { %s }
  ?country wdt:P297 ?code .
  BIND(EXISTS { ?country wdt:P31 wd:Q123480 } AS ?landlocked)
  OPTIONAL { ?country wdt:P47 ?neighbour . ?neighbour wdt:P297 ?neighbourCode } }"""


def download():
    save("wikidata/companies.json", companies())
    save("wikidata/countries.json", countries())

def companies():
    result = defaultdict(lambda: {"name": None, "kinds": []})
    for row in query(COMPANIES_QUERY, ["wd:" + q for q in company_ids()]):
        company = result[row["company"].rsplit("/", 1)[1]]
        company["name"] = row.get("companyLabel")
        company["kinds"] += [row["kindLabel"]] if "kindLabel" in row else []
    return result

def countries():
    result = defaultdict(lambda: {"landlocked": False, "neighbours": []})
    for row in query(COUNTRIES_QUERY, [f'"{code}"' for code in country_codes()]):
        country = result[row["code"]]
        country["landlocked"] |= row["landlocked"] == "true"
        country["neighbours"] += [row["neighbourCode"]] if "neighbourCode" in row else []
    return result

def query(template, values):
    batches = [values[start:start + BATCH_SIZE] for start in range(0, len(values), BATCH_SIZE)]
    return [{name: cell["value"] for name, cell in binding.items()} for batch in batches
            for binding in fetch_json(URL, data=urllib.parse.urlencode({"query": template % " ".join(batch), "format": "json"}).encode(),
                                      headers=HEADERS)["results"]["bindings"]]
