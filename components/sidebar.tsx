"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FileText,
  LinkIcon,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Flower2,
  Calendar1,
  FileTextIcon,
  Calendar,
  ShoppingCart,
  Carrot,
  ListOrdered,
  ShoppingBag,
  ShellIcon,
  
} from "lucide-react";

import { useAuth } from "./auth-provider";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Farmer Logs", href: "/farmer-logs", icon: FileText },
  { name: "Our Farm", href: "/ourfarm", icon: Flower2 },
  { name: "ChatbotLLM", href: "/llm", icon: FileText },
  { name: "Calendar", href: "/calendar", icon: Calendar1 },
  { name: "Price Forecast", href: "/price-forecast", icon: TrendingUp },
  { name: "Blockchain Ledger", href: "/blockchain-ledger", icon: Shield },
  { name: "Gov Help", href: "/government", icon: Calendar },
  { name: "Sell Item", href: "/add-product", icon: ShellIcon },
  { name: "Buy Items", href: "/marketplace", icon: ShoppingBag },
  { name: "Add to Cart", href: "/cart", icon: ShoppingCart },
  { name: "Order", href: "/orders", icon: ListOrdered },
  { name: "Cancel Order", href: "/cancelled-orders", icon: FileText },
  { name: "Support", href: "/support", icon: LinkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: isOpen ? 280 : 72 }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-lg"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      {/* Logo + Toggle */}
      <motion.div
        className={`flex items-center p-4 cursor-pointer ${
          isOpen ? "justify-start" : "flex-col justify-center"
        }`}
        layout
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-2xl"
          layout
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="text-white font-bold text-xl">A</span>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="ml-4 flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-2xl font-bold text-green-900">AgriTrust</span>
              {user?.name && (
                <span className="text-sm font-medium text-green-700">
                  {user.name}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-4 mb-8">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.li key={item.name} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                      : "text-green-700 hover:bg-green-50 hover:text-green-900 hover:shadow-lg"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto px-2 pb-4 space-y-2">
        {isOpen && (
          <>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 hover:text-green-900 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 hover:text-green-900 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </motion.div>
          </>
        )}

        {!isOpen && user?.name && (
          <div className="flex flex-col items-center mt-4 space-y-1">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-green-900">{user.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
