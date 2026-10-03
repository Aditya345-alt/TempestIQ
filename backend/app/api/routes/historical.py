import os
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from ...schemas.historical import HistoricalAnalyticsResponse, DatasetSummary, HistoricalTrendPoint

router = APIRouter()

@router.get("/historical", response_model=HistoricalAnalyticsResponse)
def get_historical_analytics():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    csv_path = os.path.join(root_dir, "data", "demo", "synthetic_meteorological_dataset.csv")
    
    datasets = []
    preview_rows = []
    selected_dataset = None
    
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            row_count = len(df)
            features = list(df.columns)
            locs = list(df["location"].unique()) if "location" in df.columns else ["Bhopal", "Indore", "Delhi"]
            min_date = str(df["timestamp"].min())[:10] if "timestamp" in df.columns else "2025-04-01"
            max_date = str(df["timestamp"].max())[:10] if "timestamp" in df.columns else "2025-05-15"
            
            selected_dataset = DatasetSummary(
                id=1,
                name="IMD-Corridor-MultiSensor-2025.csv",
                row_count=row_count,
                date_range=f"{min_date} to {max_date}",
                uploaded_at="2025-05-15 08:30 UTC",
                missing_values_count=int(df.isnull().sum().sum()),
                features=features[:16],
                locations=locs
            )
            datasets.append(selected_dataset)
            
            # Preview first 10 rows
            sample_df = df.head(10).fillna(0)
            preview_rows = sample_df.to_dict(orient="records")
        except Exception:
            pass

    trends = [
        HistoricalTrendPoint(date="2025-04-01", storm_frequency=4, lightning_strikes=142, avg_rainfall_mm=12.4, high_risk_hours=3.5),
        HistoricalTrendPoint(date="2025-04-05", storm_frequency=6, lightning_strikes=289, avg_rainfall_mm=28.1, high_risk_hours=5.0),
        HistoricalTrendPoint(date="2025-04-10", storm_frequency=2, lightning_strikes=54, avg_rainfall_mm=4.2, high_risk_hours=1.2),
        HistoricalTrendPoint(date="2025-04-15", storm_frequency=8, lightning_strikes=460, avg_rainfall_mm=44.8, high_risk_hours=7.2),
        HistoricalTrendPoint(date="2025-04-20", storm_frequency=5, lightning_strikes=210, avg_rainfall_mm=19.5, high_risk_hours=4.0),
        HistoricalTrendPoint(date="2025-04-25", storm_frequency=9, lightning_strikes=512, avg_rainfall_mm=58.2, high_risk_hours=8.5),
        HistoricalTrendPoint(date="2025-04-30", storm_frequency=3, lightning_strikes=98, avg_rainfall_mm=8.6, high_risk_hours=2.0),
        HistoricalTrendPoint(date="2025-05-05", storm_frequency=7, lightning_strikes=380, avg_rainfall_mm=36.0, high_risk_hours=6.0),
        HistoricalTrendPoint(date="2025-05-10", storm_frequency=11, lightning_strikes=640, avg_rainfall_mm=72.4, high_risk_hours=9.8),
    ]

    return HistoricalAnalyticsResponse(
        datasets=datasets,
        selected_dataset=selected_dataset,
        trends=trends,
        preview_rows=preview_rows
    )

@router.post("/historical/upload")
async def upload_historical_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV datasets are supported")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        row_count = len(df)
        cols = list(df.columns)
        missing_count = int(df.isnull().sum().sum())
        
        # Save to processed directory
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
        save_path = os.path.join(root_dir, "data", "processed", file.filename)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(contents)
            
        return {
            "status": "success",
            "filename": file.filename,
            "row_count": row_count,
            "columns": cols,
            "missing_values": missing_count,
            "message": f"Successfully parsed {row_count} rows across {len(cols)} atmospheric features."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")
