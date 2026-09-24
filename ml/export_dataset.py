import csv

SESSION_RANGES = {
    1: (6402, 6541),
    2: (6542, 6679),
    3: (6680, 6826),
}


def get_session_id(sensor_id):
    for session_id, (start_id, end_id) in SESSION_RANGES.items():
        if start_id <= sensor_id <= end_id:
            return session_id

    return None



input_file = "ml/sensor_raw.csv"
output_file = "ml/sensor_dataset.csv"

with open(input_file, "r") as infile, open(output_file, "w", newline="") as outfile:
    reader = csv.DictReader(infile)

    fieldnames = reader.fieldnames + ["session"]
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)

    writer.writeheader()

    for row in reader:
        sensor_id = int(row["id"])
        session_id = get_session_id(sensor_id)

        if session_id is not None:
            row["session"] = session_id
            writer.writerow(row)

print("Dataset hazirlandi:", output_file)
