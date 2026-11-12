import csv
import io

from common import RAW_DIR, to_number, sample


def samples():
    return (dataset_samples("weddell_sea", lambda r: number(r, "Depth water"), "Microplastic [#/m**3]", "water")
            + dataset_samples("eastern_tropical_pacific", lambda r: number(r, "Depth water"), "Plastic particle conc", "water")
            + dataset_samples("kuril_kamchatka_trench", lambda r: -number(r, "Elevation"), "Microplastic [#/kg]", "seafloor"))

def dataset_samples(name, depth, abundance_column, medium):
    return [sample(number(r, "Latitude"), number(r, "Longitude"), depth(r), number(r, abundance_column), medium) for r in rows(name)]

def rows(name):
    table = (RAW_DIR / "pangaea" / f"{name}.tab").read_text(encoding="utf-8").split("*/", 1)[1].strip()
    return csv.DictReader(io.StringIO(table), delimiter="\t", quoting=csv.QUOTE_NONE)

def number(row, column_start):
    return to_number(next(value for name, value in row.items() if name.startswith(column_start)))
