from functools import cache

from common import read_json, to_number, is_valid_coordinate, sample

SURFACE_MAX_DEPTH_M = 1
CONCENTRATION_CLASSES = {"Very Low": 0, "Low": 1, "Medium": 2, "High": 3, "Very High": 4}
MEDIUMS = {"Ocean water": "water", "Ocean sediment": "seafloor"}


@cache
def records():
    return read_json("noaa/microplastics.json")

def surface_samples():
    samples = [{"lat": r["Latitude__degree_"], "lon": r["Longitude_degree_"], "class": CONCENTRATION_CLASSES.get(r["Concentration_class_text"])}
               for r in records() if r["Medium"] == "Ocean water" and r["Water_Sample_Depth__m_"] is not None
               and r["Water_Sample_Depth__m_"] <= SURFACE_MAX_DEPTH_M]
    return [s for s in samples if is_valid_coordinate(s["lat"], s["lon"]) and s["class"] is not None]

def below_surface_samples():
    return [sample(r["Latitude__degree_"], r["Longitude_degree_"], depth(r), r["Microplastics_measurement"], MEDIUMS[r["Medium"]])
            for r in records() if r["Medium"] in MEDIUMS]

def depth(record):
    return record["Water_Sample_Depth__m_"] if record["Medium"] == "Ocean water" else to_number(record["Ocean_Bottom_Depth__m_"])
