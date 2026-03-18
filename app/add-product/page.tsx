"use client";

import { useState } from "react";
import { getToken } from "@/lib/auth";

export default function AddProduct() {
  const token = getToken();

  const [form, setForm] = useState({
    name: "",
    grainType: "",
    price: "",
    quantity: "",
    location: "",
    image: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------------
  // SUBMIT
  // ---------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.grainType ||
      !form.price ||
      !form.quantity ||
      !form.location ||
      !form.image
    ) {
      setError("⚠ Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
        body: JSON.stringify({
          name: form.name,
          grainType: form.grainType,
          price: Number(form.price),
          quantity: Number(form.quantity),
          location: form.location,
          image: form.image, // ✅ ONLY URL
          description: form.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("✅ Product added successfully!");

      // RESET FORM
      setForm({
        name: "",
        grainType: "",
        price: "",
        quantity: "",
        location: "",
        image: "",
        description: "",
      });
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Product creation failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // UI
  // ---------------------------------
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-green-700">
        📦 Add New Product
      </h1>

      <div className="bg-white shadow-lg border rounded-2xl p-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          {/* NAME */}
          <div className="col-span-2">
            <label className="font-semibold">Product Name</label>
            <input
              className="border p-3 w-full rounded-lg mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* GRAIN */}
          <div>
            <label className="font-semibold">Grain Type</label>
            <select
              className="border p-3 w-full rounded-lg mt-1"
              value={form.grainType}
              onChange={(e) =>
                setForm({ ...form, grainType: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Wheat</option>
              <option>Rice</option>
              <option>Maize</option>
              <option>Bajra</option>
              <option>Vegetables</option>
              <option>Fruits</option>
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="font-semibold">Price (₹)</label>
            <input
              type="number"
              className="border p-3 w-full rounded-lg mt-1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className="font-semibold">Quantity</label>
            <input
              type="number"
              className="border p-3 w-full rounded-lg mt-1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="font-semibold">Location</label>
            <input
              className="border p-3 w-full rounded-lg mt-1"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* IMAGE URL */}
          <div className="col-span-2">
            <label className="font-semibold">Image URL</label>
            <input
              className="border p-3 w-full rounded-lg mt-1"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-span-2">
            <label className="font-semibold">Description</label>
            <textarea
              className="border p-3 w-full rounded-lg mt-1"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <div className="col-span-2">
            <button
              disabled={loading}
              className="bg-green-600 text-white p-3 w-full rounded-xl hover:bg-green-700 font-semibold"
            >
              {loading ? "Adding..." : "✔ Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
