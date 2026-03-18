"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Cancelled {
  _id: string;
  orderId: string;
  reasonId: number;
  reasonText: string;
  note?: string;
  cancelledAt: string;
  refundAmount?: number;
}

export default function CancelledOrdersPage() {
  const [cancelled, setCancelled] = useState<Cancelled[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("agritrust-auth")
      : null;

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("agritrust-user") || "{}")
      : {};

  const userId = user.id;

  useEffect(() => {
    if (!token || !userId) return;

    fetch(`http://localhost:4000/api/orders/cancelled/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCancelled(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token, userId]);

  if (!token || !userId) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-700">
          You must login first.
        </h1>
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">Loading...</div>
    );

  if (!cancelled.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Cancelled Orders
        </h1>
        <p className="text-gray-500">You have no cancelled orders.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">Cancelled Orders</h1>

      {cancelled.map((c) => (
        <div
          key={c._id}
          className="bg-white p-4 rounded-lg shadow border border-red-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="font-medium">#{c.orderId}</div>

              <div className="text-xs text-gray-600 mt-1">
                {new Date(c.cancelledAt).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-red-600">
                {c.reasonText}
              </div>

              {c.note && (
                <div className="text-xs text-gray-600 mt-1">{c.note}</div>
              )}

              {typeof c.refundAmount === "number" && (
                <div className="text-xs text-gray-600 mt-1">
                  Refund: ₹{c.refundAmount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
