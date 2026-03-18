import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number; // allow number too
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down"; // optional trend
}

export default function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  // Determine color based on trend
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && <p className={`text-sm mt-2 ${trendColor}`}>{change}</p>}
        </div>
        <div className={`p-3 rounded-lg ${trend === "up" ? "bg-green-100" : trend === "down" ? "bg-red-100" : "bg-gray-50"}`}>
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
