import importlib
from datetime import date

from common import save

SOURCES = ["noaa", "zhao", "pangaea", "oecd", "cowger", "comtrade", "unctad", "spatial_finance", "wikidata"]

if __name__ == "__main__":
    for source in SOURCES:
        importlib.import_module(f"{source}.download").download()
    save("ACCESSED.txt", f"{date.today().isoformat()}\n".encode())
