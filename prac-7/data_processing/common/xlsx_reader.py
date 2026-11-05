import re
import zipfile
import xml.etree.ElementTree as ET

NAMESPACE = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
SHARED_STRINGS = "xl/sharedStrings.xml"
FIRST_SHEET = "xl/worksheets/sheet1.xml"


def tag(name):
    return NAMESPACE + name

def read_xml(archive, path):
    return ET.fromstring(archive.read(path))

def text_of(item):
    return "".join(part.text or "" for part in item.iter(tag("t")))

def shared_strings(archive):
    return [text_of(item) for item in read_xml(archive, SHARED_STRINGS).findall(tag("si"))]

def column_letter(cell):
    return re.match(r"[A-Z]+", cell.get("r")).group()

def is_shared_string(cell):
    return cell.get("t") == "s"

def cell_value(cell, strings):
    value = cell.find(tag("v"))
    if value is None:
        return None
    return strings[int(value.text)] if is_shared_string(cell) else float(value.text)

def read_row(row, strings):
    return {column_letter(cell): cell_value(cell, strings) for cell in row.findall(tag("c"))}

def read_rows(path):
    with zipfile.ZipFile(path) as archive:
        strings = shared_strings(archive)
        return [read_row(row, strings) for row in read_xml(archive, FIRST_SHEET).iter(tag("row"))]

def label_columns(row, header):
    return {header[column].strip(): value for column, value in row.items() if column in header}

def read_table(path):
    header, *rows = read_rows(path)
    return [label_columns(row, header) for row in rows]
