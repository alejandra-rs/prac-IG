from functools import cache
from common import read_json

@cache
def countries():
    areas = read_json("comtrade/countries.json", "utf-8-sig")["results"]
    return {area["id"]: area["PartnerCodeIsoAlpha2"] for area in areas if area.get("PartnerCodeIsoAlpha2")}

def country_codes():
    return sorted(set(countries().values()))

def flows():
    return [{"from": countries()[f["reporterCode"]], "to": countries()[f["partnerCode"]], "weight": f["netWgt"]}
            for f in read_json("comtrade/plastic_waste_flows.json") if f["netWgt"] and f["reporterCode"] in countries() and f["partnerCode"] in countries()]
