import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib




DATASET_PATH = "ml/sensor_dataset.csv"

SENSOR_COLUMNS = [
    "accel_x",
    "accel_y",
    "accel_z",
    "gyro_x",
    "gyro_y",
    "gyro_z",
]

WINDOW_SIZE = 5

df = pd.read_csv(DATASET_PATH)

print("Toplam ham olcum:", len(df))
print(df.groupby(["session", "label"]).size())


def extract_features(window):
    features = {}

    for column in SENSOR_COLUMNS:
        values = window[column].values

        features[f"{column}_mean"] = np.mean(values)
        features[f"{column}_std"] = np.std(values)
        features[f"{column}_min"] = np.min(values)
        features[f"{column}_max"] = np.max(values)
        features[f"{column}_range"] = np.max(values) - np.min(values)

    return features



feature_rows = []

for (session, label), group in df.groupby(["session", "label"]):
    group = group.sort_values("id")

    for start in range(0, len(group) - WINDOW_SIZE + 1, WINDOW_SIZE):
        window = group.iloc[start:start + WINDOW_SIZE]

        features = extract_features(window)

        features["session"] = session
        features["label"] = label

        feature_rows.append(features)

feature_df = pd.DataFrame(feature_rows)

print("\nOlusturulan pencere sayisi:", len(feature_df))
print(feature_df.groupby(["session", "label"]).size())



train_df = feature_df[feature_df["session"].isin([1, 2])]
test_df = feature_df[feature_df["session"] == 3]

feature_columns = [
    column
    for column in feature_df.columns
    if column not in ["session", "label"]
]

X_train = train_df[feature_columns]
y_train = train_df["label"]

X_test = test_df[feature_columns]
y_test = test_df["label"]

print("\nTrain pencere sayisi:", len(X_train))
print("Test pencere sayisi:", len(X_test))
print("Feature sayisi:", len(feature_columns))


model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


MODEL_PATH = "ml/activity_model.joblib"

model_package = {
    "model": model,
    "feature_columns": feature_columns,
    "sensor_columns": SENSOR_COLUMNS,
    "window_size": WINDOW_SIZE,
}

joblib.dump(model_package, MODEL_PATH)

print("\nModel kaydedildi:", MODEL_PATH)
