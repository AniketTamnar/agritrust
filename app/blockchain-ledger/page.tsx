"use client";

import { useEffect, useState } from "react";
import { FileDown, FileText, LineChart as LineIcon, Clock } from "lucide-react";
import { getToken } from "@/lib/auth";

// jsPDF + AutoTable (CORRECT)
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Charts
import {
  LineChart as ReLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  // --------------------------------------------------------
  // FETCH TRANSACTIONS
  // --------------------------------------------------------
  const loadTransactions = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transactions/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch transactions");

      const data = await res.json();
      setTransactions(data);
      calculateMonthlyGraph(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadTransactions();
  }, [token]);

  // --------------------------------------------------------
  // MONTHLY GRAPH
  // --------------------------------------------------------
  const calculateMonthlyGraph = (txs: any[]) => {
    const map: any = {};

    txs.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
      map[key] = (map[key] || 0) + tx.amount;
    });

    setMonthlyStats(
      Object.keys(map).map((k) => ({
        month: k,
        total: map[k],
      }))
    );
  };

  // --------------------------------------------------------
  // EXPORT CSV
  // --------------------------------------------------------
  const exportCSV = () => {
    const rows = [
      ["TxID", "Order ID", "Amount", "Method", "Date"],
      ...transactions.map((t) => [
        t.txId,
        t.orderId,
        t.amount,
        t.paymentMethod,
        new Date(t.date).toLocaleString("en-IN"),
      ]),
    ];

    const blob = new Blob(
      [rows.map((r) => r.join(",")).join("\n")],
      { type: "text/csv" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  };

  // --------------------------------------------------------
  // EXPORT PDF (FIXED + ALIGNED)
  // --------------------------------------------------------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AgriTrust – Blockchain Ledger", 14, 18);

    autoTable(doc, {
      startY: 28,
      head: [["Tx ID", "Order ID", "Amount", "Method", "Date"]],
      body: transactions.map((t) => [
        t.txId,
        t.orderId,
        `₹${t.amount}`,
        t.paymentMethod,
        new Date(t.date).toLocaleString("en-IN"),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 4,
        valign: "middle",
      },
      headStyles: {
        fillColor: [22, 163, 74],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 38 },
        2: { halign: "right" },
        3: { halign: "center" },
        4: { cellWidth: 42 },
      },
    });

    doc.save("transactions.pdf");
  };

  // --------------------------------------------------------
  // UI STATES
  // --------------------------------------------------------
  if (!token)
    return (
      <div className="p-8 text-center text-red-600">
        Login to view blockchain transactions.
      </div>
    );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">
        Loading blockchain ledger...
      </div>
    );

  if (!transactions.length)
    return (
      <div className="p-8 text-center text-gray-600">
        No blockchain transactions yet.
      </div>
    );

  // --------------------------------------------------------
  // CHART DATA
  // --------------------------------------------------------
  const COLORS = ["#22c55e", "#3b82f6"];

  const paymentBreakdown = [
    {
      name: "Razorpay",
      value: transactions.filter(
        (t) => t.paymentMethod === "Razorpay"
      ).length,
    },
    {
      name: "COD",
      value: transactions.filter((t) => t.paymentMethod === "COD").length,
    },
  ];

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8">
        🌿 Blockchain Ledger
      </h1>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={exportCSV}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <FileDown /> Export CSV
        </button>

        <button
          onClick={exportPDF}
          className="px-5 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
        >
          <FileText /> Export PDF
        </button>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Payment Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={paymentBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
              >
                {paymentBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <LineIcon /> Monthly Spending
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <ReLineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock /> Transaction Timeline
        </h2>

        <div className="relative border-l-2 border-green-500 pl-8 space-y-8">
          {transactions.map((tx, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[9px] top-2 w-4 h-4 bg-green-600 rounded-full ring-4 ring-green-100" />

              <p className="text-lg font-bold text-green-700">
                ₹{tx.amount}
              </p>

              <p className="text-gray-800">
                {tx.items
                  .map((i: any) => `${i.name} × ${i.quantity}`)
                  .join(", ")}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(tx.date).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">TxID</th>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.txId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{tx.txId}</td>
                <td className="px-4 py-3">{tx.orderId}</td>
                <td className="px-4 py-3">
                  {tx.items.map((i: any, idx: number) => (
                    <div key={idx}>
                      {i.name} × {i.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 font-bold text-green-700">
                  ₹{tx.amount}
                </td>
                <td className="px-4 py-3">{tx.paymentMethod}</td>
                <td className="px-4 py-3">
                  {new Date(tx.date).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
