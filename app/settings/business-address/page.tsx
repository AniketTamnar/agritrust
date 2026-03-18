"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { MapPin } from "lucide-react";

export default function BusinessAddress() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="Business Address" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-lg border space-y-6 mt-6"
      >
        <div className="flex items-center gap-3">
          <MapPin className="text-green-600 w-8 h-8" />
          <h2 className="text-xl font-semibold">Your Business Details</h2>
        </div>

        <form className="space-y-4">
          <div>
            <label className="font-medium">Business Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl mt-1"
              placeholder="AgriTrust Pvt Ltd"
            />
          </div>

          <div>
            <label className="font-medium">Address Line 1</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl mt-1"
              placeholder="Street / Plot No / Building"
            />
          </div>

          <div>
            <label className="font-medium">Address Line 2</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl mt-1"
              placeholder="Area / Locality"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="font-medium">City</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl mt-1"
                placeholder="Pune"
              />
            </div>

            <div className="w-full">
              <label className="font-medium">Postal Code</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl mt-1"
                placeholder="411001"
              />
            </div>
          </div>

          <button className="bg-green-600 text-white w-full p-3 rounded-xl font-medium hover:bg-green-700 shadow">
            Save Address
          </button>
        </form>
      </motion.div>
    </div>
  );
}
