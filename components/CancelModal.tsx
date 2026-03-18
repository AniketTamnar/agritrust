// components/CancelModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onCancelled: (orderId: string) => void;
}

interface Reason {
  id: number;
  title: string;
  description: string;
}

export default function CancelModal({ open, onClose, orderId, onCancelled }: CancelModalProps) {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setFetching(true);

    fetch("http://localhost:4000/api/orders/cancel-reasons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReasons(data);
        else setReasons([]);
      })
      .catch(() => setReasons([]))
      .finally(() => setFetching(false));
  }, [open]);

  const handleConfirm = async () => {
    if (!selected) {
      setError("Please select a reason.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("agritrust-auth"); // ✅ CORRECT TOKEN NAME

      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          reasonId: selected,
          note, // ❌ removed userId
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "Cancel failed");

      onCancelled(orderId);
      onClose();
      alert("Order cancelled successfully!");
    } catch (err: any) {
      setError(err.message || "Error cancelling order");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cancel Order</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Select a reason:</p>

        <div className="grid gap-2 max-h-56 overflow-auto mb-4">
          {fetching ? (
            <div className="text-sm text-gray-500 p-3">Loading reasons…</div>
          ) : (
            reasons.map((r) => (
              <label
                key={r.id}
                className={`p-3 rounded border ${
                  selected === r.id ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r.id}
                    checked={selected === r.id}
                    onChange={() => setSelected(r.id)}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-gray-600">{r.description}</div>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        <textarea
          rows={3}
          className="w-full border rounded p-2 mb-3"
          placeholder="Additional note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            {loading ? "Cancelling..." : <><Trash2 size={16} className="mr-2" /> Confirm</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
