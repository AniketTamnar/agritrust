"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getToken } from "@/lib/auth";

export default function Checkout() {
  const token = getToken();

  // -----------------------------
  // STATE OPTIONS
  // -----------------------------
  const stateOptions: Record<string, string[]> = {
    Maharashtra: ["Mumbai", "Pune"],
    Karnataka: ["Bengaluru"],
    Gujarat: ["Ahmedabad"],
  };

  // -----------------------------
  // STATE
  // -----------------------------
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState<"ONLINE" | "COD">("ONLINE");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  // -----------------------------
  // LOAD RAZORPAY SCRIPT
  // -----------------------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // -----------------------------
  // LOAD CART
  // -----------------------------
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:4000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // -----------------------------
  // GUARDS
  // -----------------------------
  if (!token) {
    return <div className="p-10 text-center">Please login to continue</div>;
  }

  if (loading) {
    return <div className="p-10 text-center">Loading checkout...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        Your cart is empty. Please add products.
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  // -----------------------------
  // OTP
  // -----------------------------
  const sendOtp = async () => {
    const res = await fetch("http://localhost:4000/api/payment/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    const data = await res.json();
    if (data.success) setOtpSent(true);
    else alert("Failed to send OTP");
  };

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:4000/api/payment/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp }),
    });

    const data = await res.json();
    if (data.success) setOtpVerified(true);
    else alert("Invalid OTP");
  };

  // -----------------------------
  // PLACE COD ORDER
  // -----------------------------
  const placeCodOrder = async () => {
    const res = await fetch("http://localhost:4000/api/orders/cod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ form }),
    });

    const data = await res.json();
    if (data.success) window.location.href = "/orders";
    else alert(data.message || "COD failed");
  };

  // -----------------------------
  // ONLINE PAYMENT
  // -----------------------------
  const payOnline = async () => {
    const orderRes = await fetch(
      "http://localhost:4000/api/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      }
    );

    const order = await orderRes.json();

    if (!(window as any).Razorpay) {
      alert("Payment SDK not loaded");
      return;
    }

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: "INR",
      name: "AgriTrust",
      order_id: order.id,
      handler: async (response: any) => {
        const verifyRes = await fetch(
          "http://localhost:4000/api/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...response, form }),
          }
        );

        const data = await verifyRes.json();
        if (data.success) window.location.href = "/orders";
        else alert("Payment failed");
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#16a34a" },
    });

    rzp.open();
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <motion.div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700">Checkout</h1>

      <div className="bg-white p-8 mt-6 rounded-2xl shadow border">
        {/* ADDRESS FORM */}
        <div className="grid grid-cols-2 gap-4">
          {["name", "email", "phone", "pincode"].map((f) => (
            <input
              key={f}
              placeholder={f}
              className="border p-3 rounded"
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            />
          ))}

          <select
            className="border p-3 rounded"
            onChange={(e) =>
              setForm({ ...form, state: e.target.value, city: "" })
            }
          >
            <option value="">State</option>
            {Object.keys(stateOptions).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="border p-3 rounded"
            disabled={!form.state}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            <option value="">City</option>
            {form.state &&
              stateOptions[form.state].map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>

          <textarea
            placeholder="Address"
            className="border p-3 rounded col-span-2"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* PAYMENT METHOD */}
        <div className="mt-6 space-y-2">
          <h3 className="font-bold">Payment Method</h3>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
        </div>

        <h2 className="text-xl font-bold mt-6">Total: ₹{total}</h2>

        {/* OTP + PAY */}
        {!otpVerified ? (
          <>
            <button
              onClick={sendOtp}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded"
            >
              Send OTP
            </button>

            {otpSent && (
              <>
                <input
                  className="border p-3 mt-4 w-full rounded"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp}
                  className="w-full mt-2 py-3 bg-green-600 text-white rounded"
                >
                  Verify OTP
                </button>
              </>
            )}
          </>
        ) : (
          <button
            onClick={paymentMethod === "COD" ? placeCodOrder : payOnline}
            className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl text-lg"
          >
            {paymentMethod === "COD" ? "Place COD Order" : "Pay Now"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
