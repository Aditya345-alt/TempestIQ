"""
TempestIQ - Model Training Pipeline
Trains XGBoost nowcasting classifier on multi-sensor atmospheric features.
Saves model artifacts, scaler, and verified evaluation metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    brier_score_loss, confusion_matrix, roc_curve
)
import xgboost as xgb

FEATURE_COLS = [
    "radar_reflectivity_dbz",
    "radar_velocity_mps",
    "radar_echo_top_km",
    "satellite_ir_temp_k",
    "cloud_cooling_rate_k_hr",
    "lightning_strikes_15m",
    "lightning_frequency_min",
    "nwp_cape_j_kg",
    "nwp_cin_j_kg",
    "nwp_shear_0_6km_mps",
    "nwp_lifted_index",
    "nwp_k_index",
    "precipitable_water_mm",
    "surface_temp_c",
    "surface_dew_point_c",
    "relative_humidity_pct",
    "surface_pressure_hpa",
    "rain_rate_mm_hr",
]

def calculate_meteorological_metrics(y_true, y_pred, y_prob):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    # Standard metrics
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_true, y_prob))
    brier = float(brier_score_loss(y_true, y_prob))
    
    # Meteorological contingency metrics
    # Hits = TP, Misses = FN, False Alarms = FP, Correct Negatives = TN
    pod = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
    far = float(fp / (tp + fp)) if (tp + fp) > 0 else 0.0
    csi = float(tp / (tp + fn + fp)) if (tp + fn + fp) > 0 else 0.0
    
    # ROC curve points for plotting
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    # Downsample points for JSON serialization
    sample_indices = np.linspace(0, len(fpr) - 1, min(25, len(fpr))).astype(int)
    roc_points = [{"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} for i in sample_indices]
    
    return {
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "brier_score": round(brier, 4),
        "pod": round(pod, 4),  # Probability of Detection
        "far": round(far, 4),  # False Alarm Ratio
        "csi": round(csi, 4),  # Critical Success Index
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp),
        },
        "roc_curve": roc_points,
    }

def train_nowcasting_model(csv_path: str = None):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    if csv_path is None:
        csv_path = os.path.join(root_dir, "data", "demo", "synthetic_meteorological_dataset.csv")
    
    if not os.path.exists(csv_path):
        from datasets.generate_dataset import generate_meteorological_dataset
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        df = generate_meteorological_dataset(n_samples=4000)
        df.to_csv(csv_path, index=False)
    else:
        df = pd.read_csv(csv_path)
        
    print(f"Loaded dataset with {len(df)} samples from {csv_path}")
    
    # Chronological train/test split (80% train, 20% test)
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    X_train = train_df[FEATURE_COLS].values
    X_test = test_df[FEATURE_COLS].values
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train 3 horizon models (30m, 60m, 120m)
    models = {}
    metrics = {}
    
    for horizon, target_col in [("30m", "target_thunderstorm_30m"), ("60m", "target_thunderstorm_60m"), ("120m", "target_thunderstorm_120m")]:
        y_train = train_df[target_col].values
        y_test = test_df[target_col].values
        
        clf = xgb.XGBClassifier(
            n_estimators=120,
            max_depth=5,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=42,
            eval_metric="logloss"
        )
        clf.fit(X_train_scaled, y_train)
        
        y_pred = clf.predict(X_test_scaled)
        y_prob = clf.predict_proba(X_test_scaled)[:, 1]
        
        horiz_metrics = calculate_meteorological_metrics(y_test, y_pred, y_prob)
        metrics[horizon] = horiz_metrics
        models[horizon] = clf
        print(f"[{horizon} Horizon] F1: {horiz_metrics['f1_score']}, AUC: {horiz_metrics['roc_auc']}, CSI: {horiz_metrics['csi']}, POD: {horiz_metrics['pod']}, FAR: {horiz_metrics['far']}")
        
    # Save artifacts
    models_dir = os.path.join(root_dir, "ml", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    # Feature importances
    feat_importances = models["30m"].feature_importances_
    features_meta = [
        {"name": col, "importance": round(float(imp), 4)}
        for col, imp in sorted(zip(FEATURE_COLS, feat_importances), key=lambda x: x[1], reverse=True)
    ]
    
    model_metadata = {
        "model_name": "TempestIQ Multi-Sensor XGBoost Ensemble",
        "version": "1.0.0",
        "task": "Thunderstorm & Lightning Nowcasting",
        "status": "TRAINED",
        "training_date": datetime.now().isoformat(),
        "total_samples": len(df),
        "train_samples": len(train_df),
        "test_samples": len(test_df),
        "features": features_meta,
        "metrics": metrics,
        "input_features": FEATURE_COLS,
    }
    
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))
    joblib.dump(models["30m"], os.path.join(models_dir, "xgb_30m.joblib"))
    joblib.dump(models["60m"], os.path.join(models_dir, "xgb_60m.joblib"))
    joblib.dump(models["120m"], os.path.join(models_dir, "xgb_120m.joblib"))
    
    with open(os.path.join(models_dir, "model_metadata.json"), "w") as f:
        json.dump(model_metadata, f, indent=2)
        
    print("Models and metadata successfully saved to:", models_dir)
    return model_metadata

if __name__ == "__main__":
    train_nowcasting_model()
