"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { Users } from "lucide-react";

export default function CommunityConnect() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="Community Connect" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-lg border mt-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Users className="text-green-600 w-8 h-8" />
          <h2 className="text-xl font-semibold">Join the AgriTrust Community</h2>
        </div>

        <p className="text-gray-700">
          Connect with farmers, experts, vendors, and AgriTrade partners.  
          Stay updated with the latest crop insights, weather alerts & more.
        </p>

        <button className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700">
          Join Community
        </button>
      </motion.div>
    </div>
  );
}
