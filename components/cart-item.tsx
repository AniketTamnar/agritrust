"use client";

export default function CartItem({ item }: any) {
  return (
    <div className="flex items-center border p-4 rounded-lg shadow-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover mr-4"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-gray-600">
          ₹{item.price} × {item.quantity}
        </p>
      </div>
      <p className="text-green-700 font-bold">
        ₹{item.price * item.quantity}
      </p>
    </div>
  );
}
