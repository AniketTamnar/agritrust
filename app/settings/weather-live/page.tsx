"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";

export default function GoogleMaterialWeather() {
  const [city, setCity] = useState("Pune");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cities = ["Pune", "Nashik", "Mumbai", "Ahmednagar"];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/weather/google-style?city=${city}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log("Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  if (loading || !data?.current)
    return (
      <p className="text-center mt-10 text-blue-600 text-xl animate-pulse">
        Loading weather...
      </p>
    );

  const current = data.current;
  const hourly = data.hourly || [];
  const weekly = data.weekly || [];

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-black">
      <PageHeader title="Weather Report" />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* CITY SELECT */}
        <motion.select
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded-xl bg-white text-blue-700 border border-blue-300 shadow-sm text-lg"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </motion.select>

        {/* MAIN WEATHER CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 flex items-center gap-6"
        >
          <img
            src={current?.condition?.icon ?? ""}
            className="w-20 drop-shadow-md"
          />

          <div>
            <p className="text-5xl font-semibold text-blue-700">
              {current?.temp_c ?? "--"}°C
            </p>

            <p className="text-blue-500 font-medium">
              {current?.condition?.text ?? "Loading..."}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Humidity {current?.humidity ?? "--"}% • Wind{" "}
              {current?.wind_kph ?? "--"} km/h
            </p>
          </div>
        </motion.div>

        {/* HOURLY FORECAST */}
        <h2 className="text-lg font-semibold text-blue-700">Hourly</h2>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {hourly.map((h: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="bg-white border border-blue-100 p-3 min-w-[80px] rounded-xl text-center shadow"
            >
              <p className="text-sm text-blue-700">
                {h?.time?.split(" ")[1] ?? "--"}
              </p>

              <img
                src={h?.condition?.icon ?? ""}
                className="w-8 mx-auto"
              />

              <p className="mt-1 text-base text-blue-800 font-medium">
                {h?.temp_c ?? "--"}°
              </p>
            </motion.div>
          ))}
        </div>

        {/* WEEKLY FORECAST */}
        <h2 className="text-lg font-semibold text-blue-700">Weekly</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {weekly.map((day: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="bg-white border border-blue-100 p-4 rounded-xl text-center shadow"
            >
              <p className="text-sm font-semibold text-blue-700">
                {new Date(day?.date ?? "").toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>

              <img
                src={day?.day?.condition?.icon ?? ""}
                className="w-10 mx-auto"
              />

              <p className="text-lg text-blue-800 font-bold">
                {day?.day?.maxtemp_c ?? "--"}°
              </p>
              <p className="text-blue-500 text-sm">
                {day?.day?.mintemp_c ?? "--"}°
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
