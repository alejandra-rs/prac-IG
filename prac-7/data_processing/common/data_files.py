import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"


def write_json(name, content):
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    (PROCESSED_DIR / name).write_text(json.dumps(content, separators=(",", ":")))
    print(f"{name}: {(PROCESSED_DIR / name).stat().st_size} bytes")
