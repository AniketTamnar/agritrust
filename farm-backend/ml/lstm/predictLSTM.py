import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # hide TensorFlow logs

import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
import json
import sys
from datetime import datetime, timedelta

SEQ = 30  # sequence length for LSTM


def predict(grain):
    # --- FIXED: ABSOLUTE SAFE PATHS ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    data_path = os.path.join(BASE_DIR, "data", f"{grain}.csv")
    model_path = os.path.join(BASE_DIR, "models", f"{grain}_model.h5")
    scaler_path = os.path.join(BASE_DIR, "scalers", f"{grain}.pkl")

    # --- LOAD CSV ---
    print(f"Reading CSV: {data_path}")
    df = pd.read_csv(data_path)

    # group by date (if multiple cities exist)
    df = df.groupby("Date")["Price"].mean().reset_index()

    prices = df["Price"].values.reshape(-1, 1)

    # --- LOAD SCALER ---
    print(f"Loading scaler: {scaler_path}")
    scaler = joblib.load(scaler_path)
    scaled = scaler.transform(prices)

    # --- LOAD MODEL ---
    print(f"Loading model: {model_path}")
    model = load_model(model_path)

    # last 30 days as input sequence
    last_seq = scaled[-SEQ:].reshape(1, SEQ, 1)

    predictions_scaled = []
    seq_data = last_seq.copy()

    # --- predict next 7 days ---
    for _ in range(7):
        pred = model.predict(seq_data, verbose=0)[0][0]
        predictions_scaled.append(pred)
        seq_data = np.append(seq_data[:, 1:, :], [[[pred]]], axis=1)

    # inverse scale back to actual price values
    predictions = scaler.inverse_transform(
        np.array(predictions_scaled).reshape(-1, 1)
    ).flatten()

    # generate forecast dates
    last_date = datetime.strptime(df["Date"].iloc[-1], "%Y-%m-%d")
    forecast_dates = [
        (last_date + timedelta(days=i + 1)).strftime("%Y-%m-%d")
        for i in range(7)
    ]

    # final JSON structure
    return {
        "grain": grain,
        "actual": df["Price"].tolist()[-30:],  # last 30 days actual data
        "forecast": predictions.tolist(),
        "dates": forecast_dates
    }


# --- MAIN (called from Node.js) ---
if __name__ == "__main__":
    grain = sys.argv[1]
    result = predict(grain)
    print(json.dumps(result))  # send only JSON to backend
