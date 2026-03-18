"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";

import {
  User,
  MapPin,
  Hash,
  Leaf,
  Droplets,
  Phone,
  Truck,
  DollarSign,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Trash2,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface FarmLog {
  _id: string;
  ownerId: string;
  farmerId: string;
  name: string;
  phone: string;
  location: string;
  acre: number;
  cropOrSeed: string;
  fertilizers?: string[];
  chemicals?: string[];
  soilType: string;
  waterType: string;
  marketLocation: string;
  marketCost: number;
  transport: number;
  labourCharge: number;
  investment: number;
  profit: number;
  loss: number;
  totalAmount: number;
  isPublic: boolean;
}

export default function FarmLogsPage() {
  const [logs, setLogs] = useState<FarmLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState<FarmLog | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("agritrust-user") || "{}")
      : {};
  const userId = user?.id;

  // FETCH LOGS
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("agritrust-auth");

        const res = await fetch("http://localhost:4000/api/farm-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch logs");

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError("Something went wrong while loading farm logs.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // TOGGLE VISIBILITY
  const toggleVisibility = async (logId: string, current: boolean) => {
    try {
      const token = localStorage.getItem("agritrust-auth");
      await fetch(`http://localhost:4000/api/farm-logs/${logId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublic: !current }),
      });

      setLogs((prev) =>
        prev.map((l) => (l._id === logId ? { ...l, isPublic: !current } : l))
      );
    } catch {
      alert("Update failed");
    }
  };

  // DELETE
  const deleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this farm log?")) return;

    try {
      const token = localStorage.getItem("agritrust-auth");

      const res = await fetch(`http://localhost:4000/api/farm-logs/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return alert("Delete failed");

      setLogs((prev) => prev.filter((l) => l._id !== logId));
    } catch {
      alert("Error deleting log");
    }
  };

  const iconMap: Record<string, any> = {
    "Farmer ID": Hash,
    Phone: Phone,
    Location: MapPin,
    Acre: Leaf,
    "Crop/Seed": Leaf,
    "Soil Type": Warehouse,
    "Water Type": Droplets,
    "Market Location": MapPin,
    "Market Cost": DollarSign,
    Transport: Truck,
    Labour: TrendingDown,
    Investment: DollarSign,
    Profit: TrendingUp,
    Loss: TrendingDown,
    "Total Amount": DollarSign,
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <PageHeader title="Farm Logs" />

      <div className="p-8">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {logs.map((log) => {
              const isOwner = log.ownerId === userId;

              return (
                <motion.div
                  key={log._id}
                  variants={cardVariants}
                  className="bg-white/70 p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all border"
                >
                  <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    <Hash /> {log.farmerId}
                  </h2>

                  <p className="text-gray-800 mt-1 flex items-center gap-2">
                    <User className="text-green-700" /> {log.name}
                  </p>

                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="text-green-700" /> {log.location}
                  </p>

                  {isOwner && (
                    <div className="flex justify-between mt-4">
                      <Button
                        className={`text-white ${
                          log.isPublic ? "bg-blue-500" : "bg-gray-600"
                        }`}
                        onClick={() => toggleVisibility(log._id, log.isPublic)}
                      >
                        {log.isPublic ? "Public" : "Private"}
                      </Button>

                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => deleteLog(log._id)}
                      >
                        <Trash2 /> Delete
                      </Button>
                    </div>
                  )}

                  <Button
                    className="bg-green-600 text-white w-full mt-4"
                    onClick={() => setSelectedLog(log)}
                  >
                    <Leaf /> More Details
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={modalVariants}
              className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
                {selectedLog.name}
              </h2>

              {/* DONUT CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                {/* Profit vs Loss */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4">💹 Profit vs Loss</h3>

                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Profit", value: selectedLog.profit },
                          { name: "Loss", value: selectedLog.loss },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4">📊 Cost Breakdown</h3>

                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Transport", value: selectedLog.transport },
                          { name: "Labour", value: selectedLog.labourCharge },
                          { name: "Investment", value: selectedLog.investment },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LINE GRAPH */}
              <div className="bg-white p-6 rounded-xl shadow mb-10">
                <h3 className="text-lg font-semibold mb-4">
                  📈 Farm Trend (Costs & Earnings)
                </h3>

                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={[
                      { label: "Investment", value: selectedLog.investment },
                      { label: "Labour", value: selectedLog.labourCharge },
                      { label: "Transport", value: selectedLog.transport },
                      { label: "Market Cost", value: selectedLog.marketCost },
                      { label: "Profit", value: selectedLog.profit },
                      { label: "Loss", value: selectedLog.loss },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 6, stroke: "#166534", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {[
                  ["Farmer ID", selectedLog.farmerId],
                  ["Phone", selectedLog.phone],
                  ["Location", selectedLog.location],
                  ["Acre", selectedLog.acre],
                  ["Crop/Seed", selectedLog.cropOrSeed],
                  ["Soil Type", selectedLog.soilType],
                  ["Water Type", selectedLog.waterType],
                  ["Market Location", selectedLog.marketLocation],
                  ["Market Cost", selectedLog.marketCost],
                  ["Transport", selectedLog.transport],
                  ["Labour", selectedLog.labourCharge],
                  ["Investment", selectedLog.investment],
                  ["Profit", selectedLog.profit],
                  ["Loss", selectedLog.loss],
                  ["Total Amount", selectedLog.totalAmount],
                ].map(([label, value], idx) => {
                  const Icon = iconMap[label as string];
                  return (
                    <div
                      key={idx}
                      className="flex items-center bg-white p-4 rounded-xl shadow"
                    >
                      <Icon className="text-green-700 w-6 h-6 mr-3" />
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p>{String(value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="absolute top-4 right-4 text-3xl"
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
