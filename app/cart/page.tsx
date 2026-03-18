// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { getToken } from "@/lib/auth";

type CartItemType = { productId: string; name: string; price: number; quantity: number; image?: string; };

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItemType[] } | null>(null);
  const token = getToken();

  const loadCart = async () => {
    const res = await fetch("http://localhost:4000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // if unauthorized, clear UI
      setCart({ items: [] });
      return;
    }
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    if (!token) return;
    loadCart();
  }, [token]);

  const updateQuantity = async (productId: string, change: number) => {
    await fetch("http://localhost:4000/api/cart/update-qty", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, change }),
    });
    loadCart();
  };

  const deleteItem = async (productId: string) => {
    await fetch("http://localhost:4000/api/cart/delete-item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    loadCart();
  };

  if (!token) return <p className="p-4 text-red-600">You must login first.</p>;
  if (!cart) return <p>Loading cart...</p>;

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8">🛒 Your Cart</h1>
      {cart.items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <div className="space-y-5">
            {cart.items.map((item) => (
              <motion.div key={item.productId} className="flex items-center gap-5 p-5 rounded-2xl bg-white/70 shadow-xl">
                <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <p className="text-xl font-semibold">{item.name}</p>
                  <p className="text-green-700 text-lg font-bold">₹{item.price}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-2 rounded-full bg-gray-200"><Minus size={18} /></button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-2 rounded-full bg-gray-200"><Plus size={18} /></button>
                  </div>
                </div>
                <button onClick={() => deleteItem(item.productId)} className="p-3 rounded-xl bg-red-500 text-white"><Trash2 size={20} /></button>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-green-100/60 rounded-2xl shadow-md border">
            <div className="flex justify-between text-2xl font-bold text-green-900"><span>Total</span><span>₹{total}</span></div>
            <a href="/checkout" className="mt-5 block text-center bg-green-600 text-white py-3 rounded-xl font-semibold">Proceed to Checkout</a>
          </div>
        </>
      )}
    </motion.div>
  );
}
