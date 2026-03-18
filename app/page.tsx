"use client";

import { useEffect, useState } from "react";
import { getToken, getUser } from "@/lib/auth";
import { motion } from "framer-motion";

import StatCard from "@/components/stat-card";
import PricePredictionChart from "@/components/price-prediction-chart";
import FertilizerDistributionChart from "@/components/fertilizer-distribution-chart";
import ForecastMiniChart from "@/components/forecast-mini-chart";

import {
  Users,
  TrendingUp,
  TrendingDown,
  IndianRupee,
} from "lucide-react";

export default function Dashboard() {
  // --------------------------------------------------------
  // 🔐 AUTH CHECK
  // --------------------------------------------------------
  const token = getToken();
  const user = getUser();

  if (typeof window !== "undefined") {
    if (!token || !user?.id) {
      window.location.href = "/login";
      return null;
    }
  }

  // --------------------------------------------------------
  // STATES
  // --------------------------------------------------------
  const [farmerCount, setFarmerCount] = useState<number | null>(null);
  const [grain, setGrain] = useState("Wheat");
  const [city, setCity] = useState("Pune");

  const apiGrain = grain.toLowerCase();

  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [priceTrend, setPriceTrend] = useState<"up" | "down">("up");

  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  // --------------------------------------------------------
  // 1️⃣ FETCH FARMER COUNT
  // --------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:4000/api/count")
      .then((res) => res.json())
      .then((data) => setFarmerCount(data.count))
      .catch(console.error);
  }, []);

  // --------------------------------------------------------
  // 2️⃣ FETCH LATEST GRAIN PRICE
  // --------------------------------------------------------
  useEffect(() => {
    fetch(
      `http://localhost:4000/api/prices/latest?grain=${apiGrain}&city=${city}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.latestPrice) return;

        const newPrice = Number(data.latestPrice);

        if (latestPrice !== null) {
          setPriceTrend(newPrice >= latestPrice ? "up" : "down");
        }

        setLatestPrice(newPrice);
      })
      .catch(console.error);
  }, [grain, city]);

  // --------------------------------------------------------
  // 3️⃣ FETCH TOTAL TRANSACTION AMOUNT (FIXED ✅)
  // --------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchTotalAmount = () => {
      fetch("http://localhost:4000/api/transactions/total/amount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setTotalAmount(data.totalAmount || 0))
        .catch(console.error);
    };

    fetchTotalAmount();
    const interval = setInterval(fetchTotalAmount, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100"
    >
      {/* HEADER */}
      <div className="w-full backdrop-blur-xl bg-white/70 shadow-lg py-6 px-10 border-b border-emerald-200">
        <h1 className="text-4xl font-extrabold text-emerald-800">
          AgriTrust Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
      </div>

      <div className="p-10">
        {/* GRAIN & CITY SELECT */}
        <div className="flex flex-wrap gap-6 mb-10">
          <select
            value={grain}
            onChange={(e) => setGrain(e.target.value)}
            className="border rounded-xl p-3 shadow-md bg-white"
          >
            <option>Wheat</option>
            <option>Rice</option>
            <option>Bajra</option>
            <option>Maize</option>
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-xl p-3 shadow-md bg-white"
          >
            <option>Pune</option>
            <option>Nagpur</option>
            <option>Mumbai</option>
            <option>Nashik</option>
          </select>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <StatCard
            title="Total Farmers"
            value={farmerCount ?? "Loading..."}
            change="+5%"
            icon={Users}
            trend="up"
          />

          <StatCard
            title="Total Transactions Amount"
            value={
              totalAmount !== null
                ? `₹${Number(totalAmount).toLocaleString("en-IN")}`
                : "Loading..."
            }
            change="+12%"
            icon={IndianRupee}
            trend="up"
          />

          <StatCard
            title={`Latest ${grain} Price (${city})`}
            value={latestPrice ? `₹${latestPrice}/qtl` : "Loading..."}
            change={priceTrend === "up" ? "Price Up" : "Price Down"}
            icon={priceTrend === "up" ? TrendingUp : TrendingDown}
            trend={priceTrend}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/60 p-8 rounded-3xl shadow-xl border border-emerald-200">
            <h3 className="text-xl font-bold mb-6">
              Price Trends ({grain}, {city})
            </h3>
            <PricePredictionChart grain={apiGrain} city={city} />
          </div>

          <div className="bg-white/60 p-8 rounded-3xl shadow-xl border border-emerald-200">
            <h3 className="text-xl font-bold mb-6">
              Fertilizer Distribution
            </h3>
            <FertilizerDistributionChart />
          </div>

          <div className="bg-white/60 p-8 rounded-3xl shadow-xl border border-blue-200 col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">
              🔮 LSTM Forecast ({grain}, {city})
            </h3>
            <ForecastMiniChart
              key={`${apiGrain}-${city}`}
              grain={apiGrain}
              city={city}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
