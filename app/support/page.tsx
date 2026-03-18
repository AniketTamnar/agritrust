"use client";

import { useState } from "react";

export default function SupportPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const sendSupport = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:4000/api/support/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName, customerEmail, issue }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.message) {
      setShowPopup(true);

      // Auto close popup & refresh page
      setTimeout(() => {
        setShowPopup(false);
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="bg-white w-full max-w-xl shadow-xl p-8 rounded-2xl border border-green-200">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          🌾 AgriTrust Support
        </h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
            placeholder="Your Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <textarea
            className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
            placeholder="Describe your issue..."
            rows={5}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          ></textarea>

          <button
            onClick={sendSupport}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-lg"
          >
            {loading ? "Sending..." : "Send Support Request"}
          </button>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center animate-popup">
            <div className="text-green-600 text-6xl mb-3">✔</div>
            <h2 className="text-xl font-semibold text-green-700">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 mt-2">
              We received your issue. Our team will contact you soon.
            </p>
          </div>
        </div>
      )}

      {/* POPUP ANIMATION */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-popup {
          animation: popup 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popup {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
