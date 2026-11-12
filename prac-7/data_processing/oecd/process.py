import csv
from collections import defaultdict

from common import RAW_DIR

OCEAN_STOCK = "ACCUMULATED_STOCK_IN_OCEANS"
FIRST_PROJECTED_YEAR = 2020


def ocean_stock():
    historical = stock_by_year("DF_PL.csv", lambda row: True)
    projected = stock_by_year("DF_PL_P.csv", lambda row: row["REF_AREA"] == "W" and row["SCENARIO"] == "CENTRAL_BASELINE" and int(row["TIME_PERIOD"]) >= FIRST_PROJECTED_YEAR)
    series = historical | projected
    return {"firstProjectedYear": FIRST_PROJECTED_YEAR, "stockByYear": {year: round(value, 2) for year, value in sorted(series.items())}}

def stock_by_year(name, keep):
    totals = defaultdict(float)
    with open(RAW_DIR / "oecd" / name, encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            if row["PLASTIC_WATER"] == OCEAN_STOCK and keep(row):
                totals[int(row["TIME_PERIOD"])] += float(row["OBS_VALUE"])
    return totals
