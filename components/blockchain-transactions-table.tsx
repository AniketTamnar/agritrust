"use client"

const transactions = [
  {
    id: "tx_3a4b5c",
    timestamp: "2023-11-10 09:15:33",
    farmerId: "FARM_001",
    action: "CROP_PLANTED",
    details: "Wheat planted on Plot A",
    actionType: "planted",
  },
  {
    id: "tx_9d8e7f",
    timestamp: "2023-11-12 14:30:05",
    farmerId: "FARM_002",
    action: "FERTILIZER_APPLIED",
    details: "Urea applied to Rice field",
    actionType: "fertilizer",
  },
  {
    id: "tx_1g2h3i",
    timestamp: "2023-11-15 11:05:45",
    farmerId: "FARM_001",
    action: "PESTICIDE_USED",
    details: "Neem oil sprayed on Wheat",
    actionType: "pesticide",
  },
  {
    id: "tx_6j7k8l",
    timestamp: "2023-11-18 16:20:10",
    farmerId: "FARM_003",
    action: "CROP_HARVESTED",
    details: "Sugarcane harvested, 50 tons",
    actionType: "harvested",
  },
  {
    id: "tx_4m5n6o",
    timestamp: "2023-11-20 08:00:00",
    farmerId: "FARM_002",
    action: "CROP_SOLD",
    details: "Rice sold to AgriCorp, 20 tons",
    actionType: "sold",
  },
]

const getActionBadge = (action: string, actionType: string) => {
  const badgeStyles: { [key: string]: string } = {
    planted: "bg-green-100 text-green-800",
    fertilizer: "bg-blue-100 text-blue-800",
    pesticide: "bg-yellow-100 text-yellow-800",
    harvested: "bg-red-100 text-red-800",
    sold: "bg-gray-100 text-gray-800",
  }

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badgeStyles[actionType] || "bg-gray-100 text-gray-800"}`}
    >
      {action}
    </span>
  )
}

export default function BlockchainTransactionsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Farmer ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.timestamp}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.farmerId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getActionBadge(transaction.action, transaction.actionType)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{transaction.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
