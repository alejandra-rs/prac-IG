import json
import re
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; plastic-globe-student-project)"}
XLSX = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def fetch(url, data=None, headers=HEADERS):
    with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers), timeout=120) as response:
        return response.read()

def fetch_json(url, **options):
    return json.loads(fetch(url, **options))

def save(target, content):
    path = RAW_DIR / target
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content if isinstance(content, bytes) else json.dumps(content).encode())
    print(f"{target}: {path.stat().st_size} bytes")


def read_json(target, encoding="utf-8"):
    return json.loads((RAW_DIR / target).read_text(encoding=encoding))

def read_xlsx(target):
    with zipfile.ZipFile(RAW_DIR / target) as archive:
        strings = ["".join(t.text or "" for t in item.iter(XLSX + "t"))
                   for item in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall(XLSX + "si")]
        rows = [{re.match(r"[A-Z]+", cell.get("r")).group(): cell_value(cell, strings) for cell in row.findall(XLSX + "c")}
                for row in ET.fromstring(archive.read("xl/worksheets/sheet1.xml")).iter(XLSX + "row")]
    header, *rows = rows
    return [{header[c].strip(): v for c, v in row.items() if header.get(c)} for row in rows]

def cell_value(cell, strings):
    value = cell.find(XLSX + "v")
    if value is None:
        return None
    return strings[int(value.text)] if cell.get("t") == "s" else float(value.text)


def to_number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def is_number(value):
    return isinstance(value, (int, float))

def is_valid_coordinate(lat, lon):
    return is_number(lat) and is_number(lon) and -90 <= lat <= 90 and -180 <= lon <= 180

def sample(lat, lon, depth, abundance, medium):
    return {"lat": lat, "lon": lon, "depth": depth, "abundance": abundance, "medium": medium}
