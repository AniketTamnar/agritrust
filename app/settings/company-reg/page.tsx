"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { Hash } from "lucide-react";

export default function CompanyReg() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="Company Registration Number" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-lg border mt-8 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Hash className="text-green-600 w-8 h-8" />
          <h2 className="text-xl font-semibold">Enter Company Registration Details</h2>
        </div>

        <input
          type="text"
          placeholder="Enter Registration Number (e.g. CIN, GSTIN)"
          className="w-full p-3 border rounded-xl"
        />

        <button className="bg-green-600 text-white w-full p-3 rounded-xl font-medium hover:bg-green-700">
          Save Details
        </button>
      </motion.div>
    </div>
  );
}
