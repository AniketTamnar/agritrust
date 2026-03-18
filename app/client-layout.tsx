"use client";

import type React from "react";
import Sidebar from "@/components/sidebar";
import { AuthProvider } from "@/components/auth-provider";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebar = pathname === "/login" || pathname === "/signup";

  return (
    <AuthProvider>
      <div className="flex h-screen">
        {!noSidebar && <Sidebar />}
        <main className={`flex-1 overflow-auto ${noSidebar ? "w-full" : ""}`}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
