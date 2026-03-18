"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <PageHeader title="Privacy & Policy" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-lg border mt-8 space-y-6"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-green-600" />
          <h2 className="text-2xl font-semibold">Privacy Policy</h2>
        </div>

        <p className="text-gray-700 leading-relaxed">
          AgriTrust is committed to protecting your privacy. This policy outlines how your
          personal information is collected, used, and secured...
        </p>

        <p className="text-gray-700">
          ✔ We do not sell your personal data  
          ✔ Your information is encrypted  
          ✔ You can delete your account anytime
        </p>

        <p className="text-gray-700">
          For full details, contact us at <span className="font-semibold">support@agritrust.com</span>.
        </p>
      </motion.div>
    </div>
  );
}
