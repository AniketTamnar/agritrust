"use client"

import PageHeader from "@/components/page-header"
import AdminCard from "@/components/admin-card"

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Admin Panel" />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AdminCard
            title="Manage Users"
            description="Add, remove, or modify user roles and permissions. Control access levels and monitor user activities across the platform."
            iconName="users"
            buttonText="Go to User Management"
            buttonAction={() => console.log("Navigate to user management")}
          />

          <AdminCard
            title="Bulk Data Upload"
            description="Upload CSV files for bulk farmer or log data entry. Streamline data import processes with validation and error handling."
            iconName="upload"
            buttonText="Upload CSV"
            buttonAction={() => console.log("Open file upload")}
          />

          <AdminCard
            title="Export Reports"
            description="Generate and download comprehensive reports on various metrics. Access analytics, trends, and performance insights."
            iconName="download"
            buttonText="Export Reports"
            buttonAction={() => console.log("Generate reports")}
          />

          <div className="md:col-span-2 xl:col-span-1">
            <AdminCard
              title="System Settings"
              description="Configure application settings, integrations, and system preferences. Manage API keys and external connections."
              iconName="settings"
              buttonText="Configure Settings"
              buttonAction={() => console.log("Open settings")}
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600">1,234</div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
              <div className="text-xs text-green-600 mt-2">↗ +12% this month</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">10,456</div>
              <div className="text-sm text-gray-600 mt-1">Total Transactions</div>
              <div className="text-xs text-blue-600 mt-2">↗ +8% this month</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-600 mt-1">System Uptime</div>
              <div className="text-xs text-green-600 mt-2">✓ Excellent</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">2.3TB</div>
              <div className="text-sm text-gray-600 mt-1">Data Storage</div>
              <div className="text-xs text-gray-500 mt-2">75% capacity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
