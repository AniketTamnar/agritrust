"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        setStep("otp");
      }
    } catch (err: any) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
      } else {
        // SAVE FULL USER
        saveAuth(data.token, data.user);

        router.push("/");
      }
    } catch (err: any) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <motion.div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <div className="flex justify-center mb-4">
          <Leaf className="h-12 w-12 text-green-700" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          {step === "login" ? "Login" : "Enter OTP"}
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-[36px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              {isLoading ? "Sending OTP..." : "Sign In"}
            </Button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label>Enter OTP</Label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-xl tracking-widest"
              />
            </div>

            <Button type="submit" className="w-full">
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("login")}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
