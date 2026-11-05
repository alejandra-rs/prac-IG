import json
from statistics import median_low

from common.data_files import RAW_DIR, write_json
from common.plastic_layers import is_valid_coordinate, layer_file

SURFACE_MAX_DEPTH_M = 1
CONCENTRATION_CLASSES = {"Very Low": 0, "Low": 1, "Medium": 2, "High": 3, "Very High": 4}


def is_surface_water(record):
    depth = record["Water_Sample_Depth__m_"]
    return record["Medium"] == "Ocean water" \
           and depth is not None and depth <= SURFACE_MAX_DEPTH_M

def to_sample(record):
    return {"lat": record["Latitude__degree_"], "lon": record["Longitude_degree_"],
            "class": CONCENTRATION_CLASSES.get(record["Concentration_class_text"])}

def is_usable(sample):
    return is_valid_coordinate(sample["lat"], sample["lon"]) and sample["class"] is not None

def surface_samples(records):
    samples = [to_sample(r) for r in records if is_surface_water(r)]
    return [s for s in samples if is_usable(s)]


def class_and_count(samples):
    return [median_low(s["class"] for s in samples), len(samples)]


if __name__ == "__main__":
    records = json.loads((RAW_DIR / "noaa" / "microplastics.json").read_text())
    write_json("surface.json", layer_file("surface", surface_samples(records), class_and_count))
