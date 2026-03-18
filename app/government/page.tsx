"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GiFarmer } from "react-icons/gi";
import { MdOutlineAgriculture } from "react-icons/md";
import { RiGovernmentLine } from "react-icons/ri";

const schemes = [
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "Income support scheme for farmers, ₹6000/year directly to bank accounts.",
    link: "https://pmkisan.gov.in/",
    icon: <GiFarmer size={30} className="text-green-600" />,
    category: "Income"
  },
  {
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers to improve soil fertility.",
    link: "https://soilhealth.dac.gov.in/",
    icon: <MdOutlineAgriculture size={30} className="text-yellow-600" />,
    category: "Irrigation"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme for protection against crop losses.",
    link: "https://pmfby.gov.in/",
    icon: <GiFarmer size={30} className="text-blue-600" />,
    category: "Insurance"
  },
  {
    name: "Kisan Credit Card (KCC)",
    description: "Provides farmers access to credit at low interest rates.",
    link: "https://www.rbi.org.in/Scripts/BS_KCC.aspx",
    icon: <MdOutlineAgriculture size={30} className="text-purple-600" />,
    category: "Loan"
  },
  {
    name: "National Agriculture Market (eNAM)",
    description: "Online trading platform for agricultural commodities.",
    link: "https://enam.gov.in/",
    icon: <GiFarmer size={30} className="text-red-600" />,
    category: "Market"
  },
  {
    name: "Sub-Mission on Agricultural Mechanization",
    description: "Support for purchasing agricultural machinery and tools.",
    link: "https://agrimachinery.nic.in/",
    icon: <MdOutlineAgriculture size={30} className="text-indigo-600" />,
    category: "Irrigation"
  },
  {
    name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description: "Provides irrigation facilities and water conservation solutions.",
    link: "https://pmksy.gov.in/",
    icon: <GiFarmer size={30} className="text-teal-600" />,
    category: "Irrigation"
  },
  {
    name: "National Food Security Mission (NFSM)",
    description: "Promotes increase in production of rice, wheat, pulses, and coarse cereals.",
    link: "https://nfsm.gov.in/",
    icon: <MdOutlineAgriculture size={30} className="text-orange-600" />,
    category: "Market"
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "Encourages states to invest in agriculture and allied sectors.",
    link: "https://rkvy.nic.in/",
    icon: <GiFarmer size={30} className="text-pink-600" />,
    category: "Loan"
  },
  {
    name: "e-RUPI Digital Vouchers",
    description: "Digital vouchers for direct benefit transfer to farmers.",
    link: "https://www.mygov.in/erupi/",
    icon: <RiGovernmentLine size={30} className="text-blue-500" />,
    category: "Income"
  },
  {
    name: "National Mission on Agricultural Extension and Technology (NMAET)",
    description: "Provides training & extension services to farmers.",
    link: "https://agricoop.nic.in/en/department/divisions/national-mission-agricultural-extension-and-technology",
    icon: <MdOutlineAgriculture size={30} className="text-purple-400" />,
    category: "Training"
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming and sustainable agriculture.",
    link: "https://pgsindia-ncof.gov.in/pkv/",
    icon: <GiFarmer size={30} className="text-green-800" />,
    category: "Technology"
  },
  {
    name: "Fertilizer Subsidy Scheme",
    description: "Provides subsidy on fertilizers to reduce input costs for farmers.",
    link: "https://www.india.gov.in/topics/agriculture/fertilizer-subsidy",
    icon: <MdOutlineAgriculture size={30} className="text-yellow-800" />,
    category: "Fertilizer"
  },
  {
    name: "Market Intervention Scheme",
    description: "Ensures minimum support price for farmers during surplus production.",
    link: "https://agriculture.gov.in/en/msp",
    icon: <GiFarmer size={30} className="text-red-400" />,
    category: "Market"
  },
];

const categories = ["All", "Insurance", "Loan", "Market", "Irrigation", "Income", "Technology", "Training", "Fertilizer"];

export default function GovernmentPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredSchemes = schemes.filter((scheme) => {
    const matchCategory = filter === "All" || scheme.category === filter;
    const matchSearch = scheme.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        <span className="text-green-600">Government</span>{" "}
        <span className="text-yellow-500">Help for Farmers</span>
      </h1>

      <p className="text-center mb-10 text-gray-600 text-lg">
        Explore government schemes and resources for farmers in India.
      </p>

      {/* Search & Filter */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg ${
                filter === cat ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-green-400 hover:text-white transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <motion.div layout className="grid md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredSchemes.map((scheme) => (
            <motion.div
              key={scheme.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-4 space-x-4">
                {scheme.icon}
                <h2 className="text-xl font-semibold">{scheme.name}</h2>
              </div>
              <p className="mb-4 text-gray-700">{scheme.description}</p>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          ))}
          {filteredSchemes.length === 0 && (
            <motion.div
              layout
              className="col-span-2 p-6 text-center text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No schemes found for this search/filter.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center mt-12">
        <Link href="/" className="text-blue-500 underline text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
