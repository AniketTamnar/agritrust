import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import ThemeLangProvider from "@/components/ThemeLangProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AgriTrust",
  description: "Agricultural Management Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* ThemeLangProvider handles dark mode globally */}
      <body className="bg-gray-50 dark:bg-gray-900 antialiased transition-colors duration-300">
        <ThemeLangProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeLangProvider>
      </body>
    </html>
  );
}
