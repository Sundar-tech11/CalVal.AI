@'
# CalVal.AI 🏡
### California Housing Valuation & Explainable Machine Learning

CalVal.AI is a full-stack housing valuation platform that estimates property values using machine learning models trained on the California Housing dataset. It combines an interactive interface with model comparisons and SHAP-based explanations to help users understand predictions.

> **Disclaimer:** Predictions are educational estimates based on a historical dataset. They are not professional appraisals or guaranteed market prices.

## ✨ Features

- **Housing valuation:** Estimate property values from housing and location features.
- **Four trained ML models:** XGBoost, Random Forest, Ridge Regression, and Decision Tree.
- **Explainable AI:** SHAP-based feature contribution analysis.
- **Model comparison:** Explore predictions and model performance.
- **Interactive dashboard:** Visual analytics, California map, regional presets, and valuation tools.
- **REST API:** Server endpoints for predictions, explanations, model metadata, and dataset statistics.

## 🧠 Machine Learning

The project includes four trained models:

| Model | Explanation method |
|---|---|
| XGBoost | SHAP TreeExplainer |
| Random Forest | SHAP TreeExplainer |
| Decision Tree | SHAP TreeExplainer |
| Ridge Regression | SHAP LinearExplainer |

The pipeline uses the California Housing dataset, feature preprocessing, and engineered features. Model artifacts are stored in `ml/models/`.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Machine Learning:** Python, scikit-learn, XGBoost
- **Explainable AI:** SHAP
- **Visualization:** Recharts and interactive map components

## 📁 Project Structure

```text
.
├── ml/
│   ├── models/          # Trained model artifacts
│   ├── predict.py       # Python prediction worker
│   ├── explain.py       # SHAP explanation worker
│   └── train_models.py  # Model training pipeline
├── server/
│   └──                 # Backend services
├── src/
│   └──                 # React application
├── server.ts            # Express server and API routes
├── package.json
└── README.md