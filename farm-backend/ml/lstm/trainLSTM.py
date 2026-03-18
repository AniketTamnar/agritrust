import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
import os

GRAINS = ["wheat", "rice", "maize", "bajra"]

print("🚀 Training started...")

for grain in GRAINS:
    file_path = f"data/{grain}.csv"

    if not os.path.exists(file_path):
        print(f"❌ Missing CSV: {file_path}")
        continue

    df = pd.read_csv(file_path)

    if df.empty:
        print(f"⚠️ CSV empty for: {grain}")
        continue

    # 🔥 FIX: DO NOT GROUP — KEEP ALL ROWS
    df = df.sort_values("Date")

    prices = df["Price"].values.reshape(-1, 1)

    if len(prices) < 40:
        print(f"⚠️ Not enough data for {grain}. Minimum 40 rows needed.")
        continue

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(prices)

    joblib.dump(scaler, f"scalers/{grain}.pkl")

    X, y = [], []
    seq = 30

    for i in range(seq, len(scaled)):
        X.append(scaled[i-seq:i, 0])
        y.append(scaled[i, 0])

    X = np.array(X).reshape(-1, seq, 1)
    y = np.array(y)

    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(seq, 1)),
        Dropout(0.2),
        LSTM(64),
        Dropout(0.2),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=20, batch_size=8)

    model.save(f"models/{grain}_model.h5")
    print(f"✅ Model saved for {grain}")

print("🎉 Training finished!")
