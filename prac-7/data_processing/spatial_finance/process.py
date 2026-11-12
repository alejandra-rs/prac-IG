from common import read_xlsx, is_number, is_valid_coordinate

CAPACITY = "capacity (Kt ethylene/year)"


def plants():
    usable = [p for p in read_xlsx("spatial_finance/ethylene.xlsx") if is_usable(p)]
    return sorted(({"name": name(p), "lat": round(p["latitude"], 3), "lon": round(p["longitude"], 3), "capacity": int(p[CAPACITY])} for p in usable),
                  key=lambda plant: -plant["capacity"])

def is_usable(plant):
    return (plant["status"] == "Operating" and is_number(plant.get(CAPACITY)) and plant[CAPACITY] > 0
            and is_valid_coordinate(plant.get("latitude"), plant.get("longitude")))

def name(plant):
    return plant["plant_name"].strip() if plant["plant_name"].strip() != "Unknown" else plant["operator_name"].strip()
