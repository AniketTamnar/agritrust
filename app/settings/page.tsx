"use client";

import Link from "next/link";
import PageHeader from "@/components/page-header";
import { motion } from "framer-motion";
import {
  Building2,
  Hash,
  Info,
  Stars,
  ShieldCheck,
  Users,
  CloudSun,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Settings() {
  const links = [
    {
      name: "Business Address",
      url: "/settings/business-address",
      icon: Building2,
    },
    {
      name: "Company Registration Number",
      url: "/settings/company-reg",
      icon: Hash,
    },
    { name: "About AgriTrust", url: "/settings/about", icon: Info },
    { name: "Key Features", url: "/settings/key-features", icon: Stars },
    { name: "Privacy & Policy", url: "/settings/privacy", icon: ShieldCheck },
    { name: "Community Connect", url: "/settings/community-connect", icon: Users },
    { name: "View Real-Time Weather", url: "/settings/weather-live", icon: CloudSun },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <PageHeader title="AgriTrust — Settings" />

      {/* INFO CARD */}
      <div className="max-w-3xl mx-auto mt-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg border rounded-xl p-6 mb-6 flex items-center gap-4"
        >
          <Sparkles className="w-10 h-10 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Customize Your AgriTrust Experience
            </h2>
            <p className="text-gray-600">
              Manage business details, privacy preferences & account settings.
            </p>
          </div>
        </motion.div>

        {/* MAIN SETTINGS LIST */}
        <div className="bg-white rounded-xl shadow-xl border p-4 space-y-2">
          {links.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.url}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-green-50 transition duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-gray-800 group-hover:text-green-700">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
