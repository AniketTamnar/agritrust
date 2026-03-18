"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChevronDown } from "lucide-react"

const wheatData = [
  { month: "Jan", historical: 2100, predicted: null },
  { month: "Feb", historical: 2150, predicted: null },
  { month: "Mar", historical: 2200, predicted: null },
  { month: "Apr", historical: 2280, predicted: null },
  { month: "May", historical: 2250, predicted: null },
  { month: "Jun", historical: 2300, predicted: 2320 },
  { month: "Jul", historical: null, predicted: 2350 },
  { month: "Aug", historical: null, predicted: 2380 },
  { month: "Sep", historical: null, predicted: 2400 },
  { month: "Oct", historical: null, predicted: 2420 },
  { month: "Nov", historical: null, predicted: 2450 },
]

const crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"]

export default function MarketTrendsChart() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Market Trends: {selectedCrop}</h3>
          <p className="text-sm text-gray-600">Historical and predicted price data.</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="text-sm font-medium text-gray-700">{selectedCrop}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => {
                    setSelectedCrop(crop)
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {crop}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={wheatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={["dataMin - 100", "dataMax + 100"]}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-500"></div>
          <span className="text-sm text-gray-600">Historical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-0.5 bg-green-500"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #10b981 0, #10b981 5px, transparent 5px, transparent 10px)",
            }}
          ></div>
          <span className="text-sm text-gray-600">Predicted</span>
        </div>
      </div>
    </div>
  )
}
