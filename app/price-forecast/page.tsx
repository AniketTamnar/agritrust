"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import AiSummaryPanel from "@/components/ai-summary-panel";

interface HistoricalEntry {
  day: string;
  price: number;
}

interface ForecastEntry {
  month: string;
  price: number;
}

export default function PriceForecast() {
  const [grain, setGrain] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const [historyData, setHistoryData] = useState<HistoricalEntry[]>([]);
  const [forecastData, setForecastData] = useState<ForecastEntry[]>([]);
  const [trend, setTrend] = useState("");

  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:4000/api/prices";
  const LSTM_URL = "http://localhost:4000/api/lstm/forecast";

  // Load saved options
  useEffect(() => {
    const g = localStorage.getItem("selectedGrain");
    const c = localStorage.getItem("selectedCity");
    if (g) setGrain(g);
    if (c) setCity(c);
  }, []);

  // Fetch DATA
  useEffect(() => {
    if (!grain || !city) return;

    setLoading(true);

    // ⭐ Historical DB prices — now formatted DAY-WISE
    fetch(`${API_URL}?grain=${grain}&city=${city}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((entry: any, i: number) => ({
          day: `Day ${i + 1}`,
          price: entry.price,
        }));

        setHistoryData(formatted);
      });

    // ⭐ LSTM FORECAST
    fetch(`${LSTM_URL}?grain=${grain.toLowerCase()}&city=${city}`)
      .then((res) => res.json())
      .then((result) => {
        if (!result.forecast) return;

        const formatted = result.forecast.map((p: number, idx: number) => ({
          month: result.dates[idx],
          price: p,
        }));

        setForecastData(formatted);

        const diff = formatted.at(-1)!.price - formatted[0].price;
        if (diff > 0) setTrend(`📈 Strong Uptrend (+${diff.toFixed(2)} ₹)`);
        else if (diff < 0) setTrend(`📉 Market Falling (${diff.toFixed(2)} ₹)`);
        else setTrend("➡ Stable Market");
      })
      .finally(() => setLoading(false));
  }, [grain, city]);

  // Add New Price
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grain, city, price: Number(price) }),
    });

    setPrice("");

    const res = await fetch(`${API_URL}?grain=${grain}&city=${city}`);
    const updated = await res.json();

    const formatted = updated.map((entry: any, i: number) => ({
      day: `Day ${i + 1}`,
      price: entry.price,
    }));

    setHistoryData(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-50">
      <PageHeader title="🌾 LSTM/Manual Grain Price Forecast" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="p-8 space-y-12"
      >
        {/* Add Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-6 border-l-4 border-green-500 hover:shadow-2xl hover:scale-[1.01]"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🌱 Add Today's Market Price
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="border rounded-lg p-2"
              value={grain}
              onChange={(e) => {
                setGrain(e.target.value);
                localStorage.setItem("selectedGrain", e.target.value);
              }}
            >
              <option value="">Select Grain</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="bajra">Bajra</option>
            </select>

            <select
              className="border rounded-lg p-2"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                localStorage.setItem("selectedCity", e.target.value);
              }}
            >
              <option value="">Select City</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nashik">Nashik</option>
            </select>

            <input
              type="number"
              className="border rounded-lg p-2"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Button className="bg-green-600 hover:bg-green-700">➕ Add Price</Button>
          </form>
        </motion.div>

        {/* ⭐ DAY-WISE Historical Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-md p-6 border border-green-200"
        >
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            📉 LIVE Daily Prices
          </h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <defs>
                  <linearGradient id="histLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#histLine)"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Forecast Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-md p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-1">
            📈 LSTM Forecast
          </h3>

          <motion.p className="text-sm mb-4 font-medium text-gray-600">{trend}</motion.p>

          <div className="h-[350px]">
            {loading ? (
              <div className="animate-pulse text-center py-20 text-gray-400">
                ⏳ Loading forecast...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <defs>
                    <linearGradient id="forecastLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#forecastLine)"
                    strokeWidth={4}
                    dot={{ r: 4 }}
                    strokeDasharray="4 4"
                    animationDuration={1300}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <div className="mt-16">
          <AiSummaryPanel />
        </div>
      </motion.div>
    </div>
  );
}
