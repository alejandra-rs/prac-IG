from common import fetch, save

DATASETS = {"weddell_sea": 941107, "eastern_tropical_pacific": 986752, "kuril_kamchatka_trench": 928575}


def download():
    for name, dataset in DATASETS.items():
        save(f"pangaea/{name}.tab", fetch(f"https://doi.pangaea.de/10.1594/PANGAEA.{dataset}?format=textfile"))
