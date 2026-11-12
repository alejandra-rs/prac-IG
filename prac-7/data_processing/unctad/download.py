from common import fetch, save

URL = "https://unctadstat-api.unctad.org/bulkdownload/US.PLSCI/US_PLSCI"


def download():
    save("unctad/port_connectivity.7z", fetch(URL))
