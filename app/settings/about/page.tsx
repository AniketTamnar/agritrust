"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { Sprout } from "lucide-react";

export default function AboutAgriTrust() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="About AgriTrust" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-lg border mt-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Sprout className="text-green-600 w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">AgriTrust</h1>
        </div>

        <p className="text-gray-700 leading-relaxed">
          AgriTrust is a modern agriculture platform dedicated to empowering farmers,
          traders, and AgriTech businesses with the tools they need to grow.
        </p>

        <p className="text-gray-700">
          We provide farm insights, product traceability, live weather, and a trusted
          marketplace — all in one place.
        </p>

        <p className="font-semibold text-green-700">
          Building the future of agriculture. Together.
        </p>
      </motion.div>
    </div>
  );
}
