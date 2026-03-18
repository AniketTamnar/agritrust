"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Truck, Package, CheckCircle, Home, XCircle } from "lucide-react";

// =====================
// TYPES
// =====================
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  paymentId: string;
  paymentMethod: "COD" | "Razorpay";
  amount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
  deliveryStage?: number;
}

interface CancelReason {
  id: number;
  title: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReasons, setCancelReasons] = useState<CancelReason[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reasonId, setReasonId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // =====================
  // AUTH
  // =====================
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("agritrust-auth")
      : null;

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("agritrust-user") || "{}")
      : null;

  // =====================
  // FETCH ORDERS
  // =====================
  useEffect(() => {
    if (!token || !user?.id) return;

    fetch(`http://localhost:4000/api/orders/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setOrders(data))
      .catch(console.error);
  }, [token, user?.id]);

  // =====================
  // FETCH CANCEL REASONS
  // =====================
  const loadReasons = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/orders/cancel-reasons",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCancelReasons(Array.isArray(data) ? data : []);
    } catch {
      setCancelReasons([]);
    }
  };

  const openCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    loadReasons();
  };

  // =====================
  // CANCEL ORDER (🔥 FIXED)
  // =====================
  const cancelOrder = async () => {
    if (!selectedOrderId || reasonId === "") {
      alert("Please select a reason");
      return;
    }

    setCancelLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/${selectedOrderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reasonId, note }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Cancel failed");
        return;
      }

      alert(data.message);

      // ✅ REMOVE ORDER INSTANTLY
      setOrders((prev) =>
        prev.filter((o) => o._id !== selectedOrderId)
      );

      setCancelModal(false);
      setReasonId("");
      setNote("");
    } finally {
      setCancelLoading(false);
    }
  };

  // =====================
  // GUARDS
  // =====================
  if (!token || !user?.id) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Please login to view orders
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-10 text-center text-gray-600">
        No active orders.
      </div>
    );
  }

  // =====================
  // DELIVERY STAGES
  // =====================
  const deliveryStages = [
    { label: "Packed", icon: <Package size={22} /> },
    { label: "Shipped", icon: <Truck size={22} /> },
    { label: "Out", icon: <Home size={22} /> },
    { label: "Delivered", icon: <CheckCircle size={22} /> },
  ];

  // =====================
  // UI
  // =====================
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-green-800">
        My Orders
      </h1>

      {orders.map((order, index) => {
        const stageIndex = Math.min(order.deliveryStage ?? 0, 3);

        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-700">
                Order #{order._id.slice(-6)}
              </h2>

              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {order.paymentMethod}
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <p>
                <b>Date:</b>{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
              <p>
                <b>Amount:</b> ₹{order.amount}
              </p>
              <p>
                <b>Payment ID:</b> {order.paymentId}
              </p>
            </div>

            {/* ITEMS */}
            <ul className="list-disc ml-6 mb-6 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.quantity} — ₹
                  {i.price * i.quantity}
                </li>
              ))}
            </ul>

            {/* DELIVERY TRACK */}
            <div className="flex justify-between mb-6">
              {deliveryStages.map((s, i) => {
                const done = i <= stageIndex;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        done
                          ? "bg-green-500 text-white border-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className="text-xs mt-1">{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() =>
                  window.open(
                    `http://localhost:4000/api/orders/${order._id}/invoice`,
                    "_blank"
                  )
                }
                className="bg-green-600 text-white"
              >
                Invoice
              </Button>

              <Button
                onClick={() => openCancelModal(order._id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle size={18} className="mr-1" />
                Cancel
              </Button>
            </div>
          </motion.div>
        );
      })}

      {/* CANCEL MODAL */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Cancel Order
            </h2>

            <select
              className="w-full border p-2 rounded"
              value={reasonId}
              onChange={(e) => setReasonId(Number(e.target.value))}
            >
              <option value="">Select reason</option>
              {cancelReasons.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>

            <textarea
              className="w-full border rounded p-2 mt-3"
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-5">
              <Button onClick={() => setCancelModal(false)}>
                Close
              </Button>
              <Button
                onClick={cancelOrder}
                disabled={cancelLoading}
                className="bg-red-600 text-white"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
