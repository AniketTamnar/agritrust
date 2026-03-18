"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

interface ForecastMiniChartProps {
  grain: string;
  city: string;
}

interface ForecastPoint {
  date: string;
  price: number;
}

export default function ForecastMiniChart({ grain, city }: ForecastMiniChartProps) {
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [trend, setTrend] = useState<"up" | "down" | "none">("none");

  const LSTM_URL = "http://localhost:4000/api/lstm/forecast";

  // Fetch LSTM forecast
  useEffect(() => {
    if (!grain || !city) return;

    const url = `${LSTM_URL}?grain=${grain}&city=${city}`;
    console.log("Fetching Forecast:", url);

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (!result.forecast) {
          setForecastData([]);
          setTrend("none");
          return;
        }

        const formatted = result.forecast.map((p: number, i: number) => ({
          date: result.dates[i]?.slice(5) || `Day ${i + 1}`,
          price: p,
        }));

        setForecastData(formatted);

        // Trend calculation
        const first = formatted[0].price;
        const last = formatted[formatted.length - 1].price;

        if (last > first) setTrend("up");
        else if (last < first) setTrend("down");
        else setTrend("none");
      })
      .catch((err) => console.error("Forecast fetch error:", err));
  }, [grain, city]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/70 backdrop-blur-xl border border-blue-200 shadow-xl rounded-3xl p-6"
    >
      <h3 className="text-xl font-extrabold text-blue-800 mb-2 tracking-wide flex items-center gap-2">
        🔮 LSTM Forecast  
        <span className="text-sm font-semibold text-gray-500">({grain}, {city})</span>
      </h3>

      {/* Trend Arrow */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`font-semibold text-lg mb-4 ${
          trend === "up"
            ? "text-green-600"
            : trend === "down"
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {trend === "up" && "📈 Strong Uptrend"}
        {trend === "down" && "📉 Market Falling"}
        {trend === "none" && "➡ Stable Market"}
      </motion.p>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={forecastData}>
            <defs>
              <linearGradient id="forecastLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#d1e3ff" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#555" }}
              stroke="#ccc"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #c7d7ff",
                boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#forecastLine)"
              strokeWidth={3}
              dot={{
                r: 5,
                strokeWidth: 2,
                stroke: "#1d4ed8",
                fill: "white",
              }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "#1d4ed8",
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
