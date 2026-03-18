"use client";
import Razorpay from "razorpay";
import { useState } from "react";

export default function PayButton({ amount }: any) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // ✅ 1. Create Razorpay order
      const res = await fetch("http://localhost:4000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      // ✅ 2. Open Razorpay payment window
      const options = {
        key: "YOUR_PUBLIC_RAZORPAY_KEY", // Use test key here
        amount: order.amount,
        currency: order.currency,
        name: "AgriTrust",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // ✅ 3. Verify payment & save order
          const verifyRes = await fetch("http://localhost:4000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: "user123",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("✅ Order placed successfully!");
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
