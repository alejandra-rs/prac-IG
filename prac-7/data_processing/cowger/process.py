import csv
import io
import re
import zipfile
from collections import Counter
from common import RAW_DIR, to_number, is_valid_coordinate

BRAND_COUNTS_TABLE = "wincowgerDEV-BFFP-bcf8c38/raw_processed_data.csv"


def brand_counts():
    with zipfile.ZipFile(RAW_DIR / "cowger" / "brand_audits.zip") as archive:
        return list(csv.DictReader(io.TextIOWrapper(archive.open(BRAND_COUNTS_TABLE), encoding="utf-8", errors="replace")))

def company_id(row):
    wikidata_id = row["id"].strip().upper()
    return wikidata_id if re.fullmatch(r"Q\d+", wikidata_id) else None

def company_ids():
    return sorted({company_id(row) for row in brand_counts()} - {None})

def companies_by_items():
    totals = Counter()
    for row in brand_counts():
        totals[company_id(row)] += to_number(row["total_count"]) or 0
    return [q for q, _ in totals.most_common()]

def found_items():
    rows = [(row, to_number(row["latitude_most_specific"]), to_number(row["longitude_most_specific"]), to_number(row["total_count"]) or 0) for row in brand_counts()]
    return [{"id": company_id(row), "place": row["city"] or row["country"], "lat": lat, "lon": lon, "items": items}
            for row, lat, lon, items in rows if is_valid_coordinate(lat, lon) and items > 0]
