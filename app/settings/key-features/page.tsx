"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { Star, Truck, Leaf, CloudRain } from "lucide-react";

export default function KeyFeatures() {
  const features = [
    { icon: Leaf, title: "Smart Farming Insights" },
    { icon: CloudRain, title: "Live Weather Forecasts" },
    { icon: Truck, title: "Fast Delivery Tracking" },
    { icon: Star, title: "Premium Agri Services" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="Key Features" />

      <div className="max-w-3xl mx-auto mt-6 space-y-4">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4 border"
            >
              <Icon className="w-10 h-10 text-green-600" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
