"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Ensure this code runs on client only
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const checkAuth = () => {
      try {
        const token = localStorage.getItem("agritrust-auth")
        const userData = localStorage.getItem("agritrust-user")

        if (token && userData) {
          setUser(JSON.parse(userData))
        } else if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router, isClient])

  const logout = () => {
    localStorage.removeItem("agritrust-auth")
    localStorage.removeItem("agritrust-user")
    setUser(null)
    router.push("/login")
  }

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-green-600">🌱 AgriTrust</h1>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
