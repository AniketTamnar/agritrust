"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AiSummaryPanel() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [latestPrice, setLatestPrice] = useState(null); // ⭐ NEW

  const generateSummary = async () => {
    setLoading(true);
    setSummary("");

    const grain = localStorage.getItem("selectedGrain");
    const city = localStorage.getItem("selectedCity");

    if (!grain || !city) {
      setSummary("⚠️ Please select grain & city first.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grain, city }),
      });

      const data = await res.json();

      // Extract latest price from summary string (smooth method)
      const match = data.summary.match(/Latest Price: ₹(\d+)/);
      if (match) setLatestPrice(match[1]);

      setSummary(
        data.summary ||
          "⚠️ AI could not generate summary. Check backend logs."
      );
    } catch (error) {
      setSummary("❌ Unable to connect to AI server.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800">
        AI-Powered Price Summary
      </h3>

      <p className="text-sm text-gray-500 mt-1 mb-4">
        Smooth, simple, farmer-friendly summary in  
        <b> English + Hindi + Marathi</b>.
      </p>

      {/* ⭐ Latest Price Card (only when available) */}
      {latestPrice && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h4 className="text-lg font-semibold text-green-700">
            Latest Market Price
          </h4>
          <p className="text-2xl font-bold text-green-800 mt-1">
            ₹{latestPrice}
          </p>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generateSummary}
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700 w-full"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </Button>

      {/* Final Summary Output */}
      {summary && (
        <div
          className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm whitespace-pre-line leading-relaxed transition-all duration-300 ease-in-out"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {summary}
        </div>
      )}
    </div>
  );
}
