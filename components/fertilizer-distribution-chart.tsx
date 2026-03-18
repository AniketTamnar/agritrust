"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Urea", value: 34, color: "#10b981" },
  { name: "DAP", value: 25, color: "#059669" },
  { name: "Potash", value: 24, color: "#34d399" },
  { name: "NPK", value: 17, color: "#6ee7b7" },
];

export default function FertilizerDistributionChart() {
  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
      {/* Title */}
      <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
        🌱 Fertilizer Distribution
      </h3>

      {/* Chart */}
      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1800}
              animationBegin={200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-transform duration-300"
                  style={{
                    filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.15))",
                  }}
                />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#374151", fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
