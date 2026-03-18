"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

export default function ProductCard({ product, onDeleted }: any) {
  const router = useRouter();
  const user = getUser();

  if (!product || !product._id) return null;

  const isOwner = user?.id === product.farmerId;

  // -----------------------------
  // STATE
  // -----------------------------
  const [qty, setQty] = useState<number>(product.quantity);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 🔁 Sync with backend updates
  useEffect(() => {
    setQty(product.quantity);
  }, [product.quantity]);

  const outOfStock = qty === 0;
  const lowStock = qty > 0 && qty <= 5;

  // --------------------------------------------------
  // 🛒 ADD TO CART (BUYER)
  // --------------------------------------------------
  const addToCart = async () => {
    if (outOfStock || isOwner) return;

    const token = localStorage.getItem("agritrust-auth");
    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add to cart");
        return;
      }

      // ✅ Optimistic UI update
      setQty((q) => q - 1);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // ⚡ BUY NOW
  // --------------------------------------------------
  const buyNow = async () => {
    if (outOfStock) return;
    await addToCart();
    router.push("/checkout");
  };

  // --------------------------------------------------
  // ➕ ADD QUANTITY (OWNER ONLY)
  // --------------------------------------------------
  const addQuantity = async () => {
    const token = localStorage.getItem("agritrust-auth");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: qty + 1, // increase by 1
          }),
        }
      );

      if (!res.ok) {
        alert("Failed to update quantity");
        return;
      }

      // ✅ Instant UI update
      setQty((q) => q + 1);
    } catch (err) {
      console.error("Add quantity error:", err);
    }
  };

  // --------------------------------------------------
  // ❌ DELETE PRODUCT (OWNER)
  // --------------------------------------------------
  const deleteProduct = async () => {
    if (!confirm("Delete this product permanently?")) return;

    const token = localStorage.getItem("agritrust-auth");
    if (!token) return;

    const res = await fetch(
      `http://localhost:4000/api/products/${product._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      onDeleted(product._id);
    } else {
      alert("Failed to delete product");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border p-4"
    >
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover rounded-xl"
      />

      {/* INFO */}
      <h3 className="mt-3 text-xl font-bold text-gray-800">
        {product.name}
      </h3>

      <p className="text-green-700 font-bold text-lg">
        ₹{product.price}
      </p>

      {/* STOCK */}
      <p className="text-sm mt-1">
        Stock:{" "}
        <span
          className={
            outOfStock
              ? "text-red-600 font-bold"
              : lowStock
              ? "text-orange-600 font-bold"
              : "text-gray-700"
          }
        >
          {outOfStock ? "Out of Stock" : qty}
        </span>
      </p>

      {lowStock && !outOfStock && (
        <p className="text-xs text-orange-600 font-semibold">
          ⚠ Hurry! Only {qty} left
        </p>
      )}

      {/* DETAILS */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 text-sm underline mt-1"
      >
        {showDetails ? "Hide details" : "More details"}
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-600 mt-2"
          >
            {product.description || "No description available."}
          </motion.p>
        )}
      </AnimatePresence>

      {/* BUYER ACTIONS */}
      {!isOwner && (
        <div className="flex gap-3 mt-4">
          <button
            disabled={outOfStock || loading}
            onClick={addToCart}
            className={`flex-1 py-2 rounded-lg text-white font-semibold ${
              outOfStock || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            disabled={outOfStock}
            onClick={buyNow}
            className={`flex-1 py-2 rounded-lg text-white font-semibold ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Buy Now
          </button>
        </div>
      )}

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="mt-4 space-y-2">
          <button
            onClick={addQuantity}
            className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            ➕ Add Quantity
          </button>

          <button
            onClick={deleteProduct}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            ❌ Delete Product
          </button>
        </div>
      )}
    </motion.div>
  );
}
