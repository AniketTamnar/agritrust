"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import { getUser } from "@/lib/auth";

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const user = getUser();

  const loadProducts = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
        🌿 AgriTrust Marketplace
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onDeleted={handleDelete} />
        ))}
      </div>
    </div>
  );
}
