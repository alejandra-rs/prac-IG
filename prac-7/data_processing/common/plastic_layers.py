import math
from collections import defaultdict

SQUARE_SIZE_DEGREES = 2


def is_valid_coordinate(lat, lon):
    return lat is not None and lon is not None and \
           -90 <= lat <= 90 and -180 <= lon <= 180

def group_by(items, key):
    groups = defaultdict(list)
    for item in items:
        groups[key(item)].append(item)
    return groups

def square_position(sample):
    return (math.floor(min(sample["lat"], 89.999) / SQUARE_SIZE_DEGREES),
            math.floor(min(sample["lon"], 179.999) / SQUARE_SIZE_DEGREES))

def middle_degrees(row_or_column):
    return row_or_column * SQUARE_SIZE_DEGREES + SQUARE_SIZE_DEGREES / 2

def square_point(position, samples, describe):
    row, column = position
    return [middle_degrees(row), middle_degrees(column), *describe(samples)]

def one_point_per_square(samples, describe):
    squares = group_by(samples, square_position)
    return [square_point(position, square_samples, describe) for position, square_samples in sorted(squares.items())]

def sample_count(samples):
    return [len(samples)]

def layer_file(layer, samples, describe=sample_count):
    return {"layer": layer, "squareSizeDegrees": SQUARE_SIZE_DEGREES, "samples": len(samples),
            "points": one_point_per_square(samples, describe)}
