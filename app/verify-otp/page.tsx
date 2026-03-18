"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyOtp() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email"); // from URL
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp.trim()) return alert("Enter OTP");

    setLoading(true);

    const res = await fetch("http://localhost:4000/api/payment/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("OTP Verified!");

      // Redirect back to checkout page with verification flag
      router.push("/checkout?verified=true");
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold">Verify OTP</h1>
      <p className="mt-2 text-gray-600">OTP sent to: {email}</p>

      <input
        placeholder="Enter OTP"
        className="border p-3 mt-6 w-full rounded-lg"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        type="button"
        onClick={verifyOtp}
        disabled={loading}
        className={`w-full mt-6 py-3 rounded-xl text-white text-lg 
          ${loading ? "bg-gray-400" : "bg-green-600"}`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
