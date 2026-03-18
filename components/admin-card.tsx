"use client"

import { Button } from "@/components/ui/button"

interface AdminCardProps {
  title: string
  description: string
  iconName: string
  buttonText: string
  buttonAction: () => void
}

const getIcon = (iconName: string) => {
  const iconMap: Record<string, string> = {
    users: "👥",
    upload: "📤",
    download: "📊",
    settings: "⚙️",
  }
  return iconMap[iconName] || "📋"
}

export default function AdminCard({ title, description, iconName, buttonText, buttonAction }: AdminCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
          <span className="text-2xl">{getIcon(iconName)}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">{description}</p>

      <Button
        onClick={buttonAction}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {buttonText}
      </Button>
    </div>
  )
}
