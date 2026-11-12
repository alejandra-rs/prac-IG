from common import fetch, save

URL = "https://zenodo.org/api/records/17866398/files/Global_Ethylene_Production_Database_December_2025.xlsx/content"


def download():
    save("spatial_finance/ethylene.xlsx", fetch(URL))
