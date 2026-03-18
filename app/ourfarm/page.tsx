"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, User, FileText } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function OurFarmPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // ✅ Fetch logged-in user from localStorage or backend
  useEffect(() => {
    const storedUser = localStorage.getItem("agritrust-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || parsed.email || "Farmer");
      } catch {
        setUserName("Farmer");
      }
    } else {
      setUserName("Farmer");
    }
  }, []);

  // Card animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const cards = [
    { title: "About AgriTrust", text: "Secure farm management & innovative tools.", color: "from-green-400 to-green-600", icon: "🌱", href: "/settings/about"  },
    { title: "AI Support 🌟", text: "AI-powered advice & prediction.", color: "from-indigo-500 to-purple-600", icon: <FileText className="w-14 h-14" />, href: "/llm" },
    { title: "Weather", text: "Weather-based productivity.", color: "from-pink-400 to-pink-600", icon: "📊" , href: "/settings/weather-live"},
    { title: "Contact Support", text: "Email & call support available.", color: "from-orange-400 to-orange-600", icon: "📞" , href: "/support"},
    { title: "Privacy & Policy", text: "Your data is protected with encryption.", color: "from-blue-400 to-blue-600", icon: "🔒", href: "/settings/privacy" },
    { title: "Key Features", text: "Daily logs & crop tracking.", color: "from-purple-400 to-purple-600", icon: "⚙️", href: "/settings/key-features" },
    { title: "Community Connect", text: "Knowledge sharing with farmers.", color: "from-red-400 to-red-600", icon: "🤝", href: "/settings/community-connect"  },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 p-6">
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <User className="w-14 h-14 text-green-500 animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {userName ? `Hello, ${userName}!` : "Hello, Farmer!"}
            </h1>
            <p className="text-gray-500">Welcome to your AgriTrust OurFarm</p>
          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 transform transition-all hover:scale-105"
          onClick={() => router.push("/ourfarm/add-farm")}
        >
          <Plus className="w-5 h-5" />
          <span>Add New Farm</span>
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`relative bg-gradient-to-br ${card.color} rounded-3xl p-8 shadow-2xl border border-gray-200 text-white cursor-pointer`}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            onClick={() => card.href && router.push(card.href)}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }}
              className="mb-4 flex justify-center"
            >
              <div className="text-6xl">{card.icon}</div>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-center">{card.title}</h2>
            <p className="text-sm text-center">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
