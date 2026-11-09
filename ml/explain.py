
import json
import sys
from pathlib import Path

import joblib
import numpy as np
import shap
from sklearn.datasets import fetch_california_housing

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"

MODELS = {
    "xgboost": {
        "file": "model_xgboost.joblib",
        "name": "XGBoost Regressor",
        "kind": "tree",
    },
    "random_forest": {
        "file": "model_random_forest.joblib",
        "name": "Random Forest Regressor",
        "kind": "tree",
    },
    "decision_tree": {
        "file": "model_decision_tree.joblib",
        "name": "Decision Tree Regressor",
        "kind": "tree",
    },
    "ridge": {
        "file": "model_ridge.joblib",
        "name": "Ridge Regression",
        "kind": "linear",
    },
}

FEATURE_NAMES = [
    "Median Household Income",
    "Housing Median Age",
    "Average Rooms",
    "Average Bedrooms",
    "Block Population",
    "Average Occupancy",
    "Latitude",
    "Longitude",
    "Bedrooms per Room",
    "Estimated Number of Households",
]

LOADED_MODELS = {
    model_id: joblib.load(MODEL_DIR / info["file"])
    for model_id, info in MODELS.items()
}

# Match the feature engineering used during training.
dataset = fetch_california_housing()
X = dataset.data

bedrooms_per_room = X[:, 3] / np.maximum(X[:, 2], 1e-9)
population_per_household = X[:, 4] / np.maximum(X[:, 5], 1e-9)

X = np.column_stack([
    X,
    bedrooms_per_room,
    population_per_household,
])

BACKGROUND = X[:100]


def build_features(data):
    f = data.get("features", data)

    income = float(f.get("median_income", f.get("MedInc", 3.87)))
    age = float(f.get("housing_median_age", f.get("HouseAge", 28.0)))
    population = float(f.get("population", f.get("Population", 1400)))
    households = max(float(f.get("households", 500)), 1.0)
    rooms = max(float(f.get("total_rooms", 2500)), 1.0)
    bedrooms = max(float(f.get("total_bedrooms", 500)), 1.0)

    avg_rooms = float(f.get("AveRooms", rooms / households))
    avg_bedrooms = float(f.get("AveBedrms", bedrooms / households))
    avg_occupancy = float(f.get("AveOccup", population / households))

    latitude = float(f.get("latitude", f.get("Latitude", 36.75)))
    longitude = float(f.get("longitude", f.get("Longitude", -119.75)))

    bedrooms_per_room = avg_bedrooms / max(avg_rooms, 1e-9)
    population_per_household = population / max(avg_occupancy, 1e-9)

    return np.array([[
        income,
        age,
        avg_rooms,
        avg_bedrooms,
        population,
        avg_occupancy,
        latitude,
        longitude,
        bedrooms_per_room,
        population_per_household,
    ]], dtype=float)


def explain(data):
    requested_model = str(data.get("model_id", "xgboost")).lower()

    aliases = {
        "randomforest": "random_forest",
        "random-forest": "random_forest",
        "decisiontree": "decision_tree",
        "decision-tree": "decision_tree",
        "linear": "ridge",
        "ridge_regression": "ridge",
    }
    model_id = aliases.get(requested_model, requested_model)

    if model_id not in MODELS:
        raise ValueError(
            f"Unsupported model_id: {requested_model}. "
            f"Choose one of: {', '.join(MODELS)}"
        )

    info = MODELS[model_id]
    model = LOADED_MODELS[model_id]
    row = build_features(data)

    # Tree models: XGBoost, Random Forest, Decision Tree.
    if info["kind"] == "tree":
        explainer = shap.TreeExplainer(
            model,
            data=BACKGROUND,
            feature_perturbation="interventional",
        )
        shap_result = explainer(row)

    # Ridge: explain the final estimator using transformed inputs.
    else:
        if hasattr(model, "steps"):
            preprocessing = model[:-1]
            estimator = model.steps[-1][1]

            background_transformed = preprocessing.transform(BACKGROUND)
            row_transformed = preprocessing.transform(row)
        else:
            estimator = model
            background_transformed = BACKGROUND
            row_transformed = row

        explainer = shap.LinearExplainer(
            estimator,
            background_transformed,
        )
        shap_result = explainer(row_transformed)

    impacts = np.asarray(shap_result.values).reshape(-1)
    baseline = float(np.asarray(shap_result.base_values).reshape(-1)[0])
    prediction = float(model.predict(row)[0])

    contributions = []

    for name, value, impact in zip(FEATURE_NAMES, row[0], impacts):
        contributions.append({
            "feature": name,
            "label": name,
            "user_value": round(float(value), 4),
            "impact_dollars": round(float(impact), 2),
            "direction": "positive" if impact >= 0 else "negative",
        })

    contributions.sort(
        key=lambda item: abs(item["impact_dollars"]),
        reverse=True,
    )

    return {
        "model_id": model_id,
        "model_name": info["name"],
        "explanation_method": (
            "SHAP TreeExplainer"
            if info["kind"] == "tree"
            else "SHAP LinearExplainer"
        ),
        "baseline_prediction": round(baseline, 2),
        "predicted_value": round(prediction, 2),
        "ranked_contributions": contributions,
        "disclaimer": (
            "SHAP values explain how model features contribute to this "
            "prediction relative to the reference data. They do not establish "
            "causation or provide a certified appraisal."
        ),
    }


# Persistent JSON-lines interface for the Node.js server.
for line in sys.stdin:
    try:
        request = json.loads(line)
        result = explain(request)
        print(json.dumps(result), flush=True)
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), flush=True)
