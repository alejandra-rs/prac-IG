from common import fetch, save

DATAFLOWS = {"DF_PL": "DSD_PL@DF_PL", "DF_PL_P": "DSD_PL_P@DF_PL_P"}


def download():
    for name, dataflow in DATAFLOWS.items():
        save(f"oecd/{name}.csv", fetch(f"https://sdmx.oecd.org/public/rest/data/OECD.ENV.EEI,{dataflow},/all"
                                       "?dimensionAtObservation=AllDimensions&format=csvfilewithlabels"))
