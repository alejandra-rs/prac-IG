from common.data_files import RAW_DIR, write_json
from common.plastic_layers import is_valid_coordinate, layer_file
from common.xlsx_reader import read_table

LAYERS = {"midwater": (10, 200), "deep": (200, float("inf"))}


def to_sample(row):
    return {"lat": row.get("Latitude"), "lon": row.get("Longitude"),
            "depth": row.get("Sampling depth (m)"), "abundance": row.get("Abundance (particles/m3)")}

def has_numbers(sample):
    return all(isinstance(value, float) for value in sample.values())

def is_plastic_found(sample):
    return has_numbers(sample) and is_valid_coordinate(sample["lat"], sample["lon"]) and sample["abundance"] > 0

def in_layer(sample, layer):
    shallowest, deepest = LAYERS[layer]
    return shallowest < sample["depth"] <= deepest


if __name__ == "__main__":
    samples = [s for s in map(to_sample, read_table(RAW_DIR / "zhao" / "multiple_depths.xlsx")) if is_plastic_found(s)]
    for layer in LAYERS:
        write_json(f"{layer}.json", layer_file(layer, [s for s in samples if in_layer(s, layer)]))
