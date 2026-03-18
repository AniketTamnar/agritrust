"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface FarmLog {
  _id: string
  farmerId: string
  name: string
  phone: string
  location: string
  acre: number
  cropOrSeed: string
  fertilizers?: string[]
  chemicals?: string[]
  soilType: string
  waterType: string
  marketLocation: string
  marketCost: number
  transport: number
  labourCharge: number
  investment: number
  profit: number
  loss: number
  totalAmount: number
}

export default function FarmLogDetailPage() {
  const { id } = useParams()
  const [log, setLog] = useState<FarmLog | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const token = localStorage.getItem("agritrust-auth")
        const res = await fetch(`http://localhost:4000/api/farm-logs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) setLog(data)
        else console.error(data.message)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLog()
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!log) return <p className="text-center mt-10">Farm log not found.</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* Animated card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          className="p-6 rounded-xl shadow-lg border-l-4 border-green-500 bg-white
                     hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            {log.name}
          </h2>

          {/* Grid layout for farm details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {[
              ["Farmer ID", log.farmerId],
              ["Phone", log.phone],
              ["Location", log.location],
              ["Soil Type", log.soilType],
              ["Crop/Seed", log.cropOrSeed],
              ["Acre", log.acre],
              ["Water Type", log.waterType],
              ["Market Location", log.marketLocation],
              ["Market Cost", log.marketCost],
              ["Transport", log.transport],
              ["Labour", log.labourCharge],
              ["Investment", log.investment],
              ["Profit", log.profit],
              ["Loss", log.loss],
              ["Total Amount", log.totalAmount],
              ["Fertilizers", log.fertilizers?.join(", ") || "—"],
              ["Chemicals", log.chemicals?.join(", ") || "—"],
            ].map(([label, value], i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="bg-green-50 p-2 rounded hover:bg-green-100 transition"
              >
                <span className="font-semibold">{label}:</span> {value}
              </motion.p>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
