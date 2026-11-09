
from pathlib import Path
import json

import joblib
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

FEATURE_NAMES = [
    "MedInc",
    "HouseAge",
    "AveRooms",
    "AveBedrms",
    "Population",
    "AveOccup",
    "Latitude",
    "Longitude",
    "BedroomsPerRoom",
    "PopulationPerHousehold",
]

# Load the California Housing dataset.
dataset = fetch_california_housing()
X = dataset.data
y = dataset.target * 100000  # Convert target to approximate USD.

# Add the same engineered features expected by ml_service.ts.
bedrooms_per_room = X[:, 3] / np.maximum(X[:, 2], 1e-9)
population_per_household = X[:, 4] / np.maximum(X[:, 5], 1e-9)

X = np.column_stack([
    X,
    bedrooms_per_room,
    population_per_household,
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

models = {
    "ridge": Pipeline([
        ("scaler", StandardScaler()),
        ("model", Ridge(alpha=1.0)),
    ]),
    "decision_tree": DecisionTreeRegressor(
        max_depth=12, random_state=42
    ),
    "random_forest": RandomForestRegressor(
        n_estimators=150,
        max_depth=16,
        random_state=42,
        n_jobs=-1,
    ),
    "xgboost": XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
        n_jobs=-1,
    ),
}

results = {}

for name, model in models.items():
    print(f"\nTraining {name}...")
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    metrics = {
        "r2": round(float(r2_score(y_test, predictions)), 4),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, predictions))), 2),
        "mae": round(float(mean_absolute_error(y_test, predictions)), 2),
    }

    joblib.dump(model, MODEL_DIR / f"model_{name}.joblib")
    results[name] = metrics

    print(f"R²:   {metrics['r2']}")
    print(f"RMSE: ${metrics['rmse']:,.2f}")
    print(f"MAE:  ${metrics['mae']:,.2f}")

joblib.dump(
    StandardScaler().fit(X_train),
    MODEL_DIR / "scaler.joblib",
)

with open(MODEL_DIR / "metrics.json", "w", encoding="utf-8") as file:
    json.dump(results, file, indent=2)

print("\nTraining complete!")
print(f"Models saved to: {MODEL_DIR}")
print("Files:", [p.name for p in MODEL_DIR.iterdir()])
