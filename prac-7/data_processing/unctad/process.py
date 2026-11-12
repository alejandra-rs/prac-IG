import csv
import io
import json
import tempfile
from collections import defaultdict
from pathlib import Path
from statistics import mean
import py7zr
import searoute
from common import RAW_DIR

CONNECTIVITY_YEAR = "2023"
CONNECTIVITY = "Index (average Q1 2023 = 100)"
SEAROUTE_PORTS = Path(searoute.__file__).parent / "data" / "ports.geojson"


def main_ports():
    scores, locations = defaultdict(list), searoute_ports()
    for row in csv.DictReader(io.StringIO(connectivity_table())):
        if row["Quarter"].startswith(CONNECTIVITY_YEAR) and row[CONNECTIVITY]:
            scores[row["Port"]].append(float(row[CONNECTIVITY]))
    return {code[:2]: locations[code] for code in sorted(scores, key=lambda code: mean(scores[code])) if code in locations}

def connectivity_table():
    with tempfile.TemporaryDirectory() as folder, py7zr.SevenZipFile(RAW_DIR / "unctad" / "port_connectivity.7z") as archive:
        archive.extractall(folder)
        return next(Path(folder).iterdir()).read_text(encoding="utf-8")

def searoute_ports():
    features = json.loads(SEAROUTE_PORTS.read_text(encoding="utf-8"))["features"]
    return {f["properties"]["port"]: {"code": f["properties"]["port"][:2], "port": f["properties"]["name"],
                                      "lat": round(f["geometry"]["coordinates"][1], 3), "lon": round(f["geometry"]["coordinates"][0], 3)}
            for f in features}
