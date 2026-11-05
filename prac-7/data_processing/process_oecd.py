import csv
from collections import defaultdict

from common.data_files import RAW_DIR, write_json

OCEAN_STOCK = "ACCUMULATED_STOCK_IN_OCEANS"
WORLD = "W"
SCENARIO = "CENTRAL_BASELINE"
FIRST_PROJECTED_YEAR = 2020


def read_csv(name):
    with open(RAW_DIR / "oecd" / name, encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))

def is_ocean_stock(row):
    return row["PLASTIC_WATER"] == OCEAN_STOCK


def sum_by_year(rows):
    totals = defaultdict(float)
    for row in rows:
        totals[int(row["TIME_PERIOD"])] += float(row["OBS_VALUE"])
    return totals

def historical_stock():
    return sum_by_year(row for row in read_csv("DF_PL.csv") if is_ocean_stock(row))

def is_world_baseline(row):
    return is_ocean_stock(row) and row["REF_AREA"] == WORLD and row["SCENARIO"] == SCENARIO

def projected_stock():
    return sum_by_year(row for row in read_csv("DF_PL_P.csv") if is_world_baseline(row))


def stock_series():
    projected = {year: value for year, value in projected_stock().items() if year >= FIRST_PROJECTED_YEAR}
    return dict(sorted({**historical_stock(), **projected}.items()))

def stock_file(series):
    return {"firstProjectedYear": FIRST_PROJECTED_YEAR,
            "stockByYear": {year: round(value, 2) for year, value in series.items()}}


if __name__ == "__main__":
    write_json("ocean-stock.json", stock_file(stock_series()))
