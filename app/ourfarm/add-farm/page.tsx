"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Hash, MapPin, Leaf, Droplets, DollarSign, Truck, TrendingUp, TrendingDown, Wheat, CheckCircle } from "lucide-react";

// Variants for container & cards
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.03, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" },
};

export default function AddFarmPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    farmerId: "",
    name: "",
    phone: "",
    location: "",
    acre: "",
    cropOrSeed: "",
    fertilizers: [""],
    chemicals: [""],
    soilType: "",
    waterType: "",
    marketLocation: "",
    marketCost: "",
    transport: "",
    labourCharge: "",
    investment: "",
    profit: "",
    loss: "",
    totalAmount: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index: number, value: string, field: "fertilizers" | "chemicals") => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field: "fertilizers" | "chemicals") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("agritrust-auth");
      const res = await fetch("http://localhost:4000/api/farm-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); // Tick shows for 3 seconds
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <motion.form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-5xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1 className="text-3xl font-bold text-green-700 text-center mb-4" variants={cardVariants}>
          Add New Farm Log
        </motion.h1>

        {/* Basic Info Card */}
        <AnimatedCard>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-700" /> Basic Info
              </CardTitle>
              <CardDescription>Farmer details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Farmer ID" name="farmerId" value={formData.farmerId} onChange={handleChange} icon={<Hash />} />
              <InputField label="Name" name="name" value={formData.name} onChange={handleChange} icon={<User />} />
              <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} icon={<Leaf />} />
              <InputField label="Location" name="location" value={formData.location} onChange={handleChange} icon={<MapPin />} />
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Farm Details Card */}
        <AnimatedCard>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-700" /> Farm Details
              </CardTitle>
              <CardDescription>Acreage, Crop/Seed</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Acre" type="number" name="acre" value={formData.acre} onChange={handleChange} icon={<Leaf />} />
              <InputField label="Crop/Seed" name="cropOrSeed" value={formData.cropOrSeed} onChange={handleChange} icon={<Leaf />} />
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Fertilizers Card */}
        <AnimatedCard>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-700" /> Fertilizers
              </CardTitle>
              <CardDescription>Add multiple fertilizers</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.fertilizers.map((f, i) => (
                <Input key={i} value={f} onChange={(e) => handleArrayChange(i, e.target.value, "fertilizers")} placeholder="Fertilizer" className="mb-2" />
              ))}
              <Button type="button" onClick={() => addArrayField("fertilizers")} className="mt-2">
                + Add Fertilizer
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Chemicals Card */}
        <AnimatedCard>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-700" /> Chemicals
              </CardTitle>
              <CardDescription>Add multiple chemicals</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.chemicals.map((c, i) => (
                <Input key={i} value={c} onChange={(e) => handleArrayChange(i, e.target.value, "chemicals")} placeholder="Chemical" className="mb-2" />
              ))}
              <Button type="button" onClick={() => addArrayField("chemicals")} className="mt-2">
                + Add Chemical
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Other Details Card */}
        <AnimatedCard>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-green-500">
            <CardHeader>
              <CardTitle>Other Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Soil Type" name="soilType" value={formData.soilType} onChange={handleChange} icon={<Wheat />} />
              <InputField label="Water Type" name="waterType" value={formData.waterType} onChange={handleChange} icon={<Droplets />} />
              <InputField label="Market Location" name="marketLocation" value={formData.marketLocation} onChange={handleChange} icon={<MapPin />} />
              <InputField label="Market Cost" type="number" name="marketCost" value={formData.marketCost} onChange={handleChange} icon={<DollarSign />} />
              <InputField label="Transport" type="number" name="transport" value={formData.transport} onChange={handleChange} icon={<Truck />} />
              <InputField label="Labour Charge" type="number" name="labourCharge" value={formData.labourCharge} onChange={handleChange} icon={<TrendingDown />} />
              <InputField label="Investment" type="number" name="investment" value={formData.investment} onChange={handleChange} icon={<DollarSign />} />
              <InputField label="Profit" type="number" name="profit" value={formData.profit} onChange={handleChange} icon={<TrendingUp />} />
              <InputField label="Loss" type="number" name="loss" value={formData.loss} onChange={handleChange} icon={<TrendingDown />} />
              <InputField label="Total Amount" type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} icon={<DollarSign />} />
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Save Button + Tick */}
        <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} className="relative">
          {!saved ? (
            <Button
              type="button"
              onClick={handleSaveClick}
              className="w-full bg-green-600 text-white py-3 text-lg shadow-lg hover:bg-green-700 transition-all duration-200"
            >
              Save Farm Log
            </Button>
          ) : (
            <AnimatePresence>
              <motion.div
                key="tick"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="flex items-center justify-center text-green-600 absolute inset-0"
              >
                <CheckCircle size={64} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.form>
    </div>
  );
}

// InputField helper
function InputField({ label, name, value, onChange, type = "text", icon }: any) {
  return (
    <div className="flex flex-col">
      <Label className="mb-1 flex items-center gap-2">
        {icon} {label}
      </Label>
      <Input type={type} name={name} value={value} onChange={onChange} className="border p-2 rounded shadow-sm" />
    </div>
  );
}

// AnimatedCard wrapper
function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={cardVariants} whileHover="hover">
      {children}
    </motion.div>
  );
}
