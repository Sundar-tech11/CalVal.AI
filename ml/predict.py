
import json
import sys
from pathlib import Path

import joblib
import numpy as np

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"

# Load the trained models once when this process starts.
MODELS = {
    "ridge": joblib.load(MODEL_DIR / "model_ridge.joblib"),
    "decision_tree": joblib.load(MODEL_DIR / "model_decision_tree.joblib"),
    "random_forest": joblib.load(MODEL_DIR / "model_random_forest.joblib"),
    "xgboost": joblib.load(MODEL_DIR / "model_xgboost.joblib"),
}


def predict(data):
    f = data["features"]

    income = float(f.get("median_income", f.get("MedInc", 3.87)))
    age = float(f.get("housing_median_age", f.get("HouseAge", 28.0)))
    population = float(f.get("population", f.get("Population", 1400)))
    households = max(float(f.get("households", 500)), 1)
    rooms = max(float(f.get("total_rooms", 2500)), 1)
    bedrooms = max(float(f.get("total_bedrooms", 500)), 1)

    avg_rooms = float(f.get("AveRooms", rooms / households))
    avg_bedrooms = float(f.get("AveBedrms", bedrooms / households))
    avg_occupancy = float(f.get("AveOccup", population / households))

    features = np.array([[
        income,
        age,
        avg_rooms,
        avg_bedrooms,
        population,
        avg_occupancy,
        float(f.get("latitude", f.get("Latitude", 36.75))),
        float(f.get("longitude", f.get("Longitude", -119.75))),
        avg_bedrooms / max(avg_rooms, 1e-9),
        population / max(avg_occupancy, 1e-9),
    ]])

    predictions = {
        name: round(float(model.predict(features)[0]))
        for name, model in MODELS.items()
    }

    selected = data.get("model_id", "xgboost")
    if selected not in predictions:
        selected = "xgboost"

    return {
        "model_id": selected,
        "predicted_value": predictions[selected],
        "predictions": predictions,
    }


# Keep the process running and handle multiple JSON requests.
for line in sys.stdin:
    try:
        request = json.loads(line)
        result = predict(request)
        print(json.dumps(result), flush=True)
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), flush=True)
