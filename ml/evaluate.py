"""
TempestIQ - Model Evaluation Module
Evaluates trained models or test sets on strict meteorological metrics:
Precision, Recall, F1, ROC-AUC, Brier Score, POD, FAR, CSI.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from train import calculate_meteorological_metrics, FEATURE_COLS

def evaluate_nowcast_models():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    models_dir = os.path.join(root_dir, "ml", "models")
    csv_path = os.path.join(root_dir, "data", "demo", "synthetic_meteorological_dataset.csv")
    
    if not os.path.exists(csv_path) or not os.path.exists(os.path.join(models_dir, "scaler.joblib")):
        print("Models or dataset missing. Running train first...")
        from train import train_nowcasting_model
        return train_nowcasting_model()
        
    df = pd.read_csv(csv_path)
    split_idx = int(len(df) * 0.8)
    test_df = df.iloc[split_idx:]
    
    scaler = joblib.load(os.path.join(models_dir, "scaler.joblib"))
    X_test_scaled = scaler.transform(test_df[FEATURE_COLS].values)
    
    results = {}
    for horizon, target_col in [("30m", "target_thunderstorm_30m"), ("60m", "target_thunderstorm_60m"), ("120m", "target_thunderstorm_120m")]:
        model_file = os.path.join(models_dir, f"xgb_{horizon}.joblib")
        if os.path.exists(model_file):
            model = joblib.load(model_file)
            y_true = test_df[target_col].values
            y_pred = model.predict(X_test_scaled)
            y_prob = model.predict_proba(X_test_scaled)[:, 1]
            results[horizon] = calculate_meteorological_metrics(y_true, y_pred, y_prob)
            
    print("Evaluation Results:")
    print(json.dumps(results, indent=2))
    return results

if __name__ == "__main__":
    evaluate_nowcast_models()
