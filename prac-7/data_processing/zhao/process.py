from common import read_xlsx, sample


def samples():
    return [sample(r.get("Latitude"), r.get("Longitude"), r.get("Sampling depth (m)"), r.get("Abundance (particles/m3)"), "water")
            for r in read_xlsx("zhao/multiple_depths.xlsx")]
