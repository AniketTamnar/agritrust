"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

export default function PricePredictionChart({ grain, city }: any) {
  const [data, setData] = useState([]);

  const API_URL = "http://localhost:4000/api/prices";

  // Fetch daily price data
  useEffect(() => {
    if (!grain || !city) return;

    fetch(`${API_URL}?grain=${grain}&city=${city}`)
      .then((res) => res.json())
      .then((d) => {
        const formatted = d.map((entry: any, index: number) => ({
          day: `Day ${index + 1}`,
          price: entry.price,
        }));

        setData(formatted);
      })
      .catch((error) => console.error("Price fetch error:", error));
  }, [grain, city]);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-green-200 hover:shadow-green-300/40 transition-all duration-500">

      {/* Title */}
      <h3 className="text-2xl font-extrabold text-emerald-700 mb-6 tracking-tight">
        🌾 Daily {grain} Price Trend — {city}
      </h3>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            {/* Soft grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.6} />

            {/* BEAUTIFUL GRADIENT AREA */}
            <defs>
              <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="greenLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* X & Y Axis */}
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#047857", opacity: 0.8 }}
              stroke="#6ee7b7"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#047857", opacity: 0.8 }}
              stroke="#6ee7b7"
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #a7f3d0",
                boxShadow: "0 8px 20px rgba(16,185,129,0.15)",
              }}
              labelStyle={{ color: "#065f46", fontWeight: "bold" }}
              cursor={{ stroke: "#10b981", strokeWidth: 1 }}
            />

            {/* Filled Area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="none"
              fill="url(#greenArea)"
              animationDuration={1200}
            />

            {/* Main Line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#greenLine)"
              strokeWidth={4}
              dot={{
                r: 6,
                fill: "#10b981",
                stroke: "#065f46",
                strokeWidth: 2,
                className: "shadow-lg"
              }}
              activeDot={{ r: 10, stroke: "#047857", strokeWidth: 3 }}
              animationDuration={1400}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-6">
        <div className="flex items-center space-x-3 bg-emerald-100/80 px-4 py-2 rounded-full shadow-md">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-emerald-800 tracking-wide">
            {grain} Daily Price Trend
          </span>
        </div>
      </div>
    </div>
  );
}
