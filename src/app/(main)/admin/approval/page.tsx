// src/app/(admin)/approval/page.tsx

'use client'
import { useEffect, useState } from "react"

type StockRequest = {
  id: string
  type: "IN" | "OUT"
  quantity: number
  status: string
  product: { name: string }
  requester: { name: string }
  createdAt: string
}

export default function ApprovalPage() {
  const [requests, setRequests] = useState<StockRequest[]>([])

  const fetchRequests = async () => {
    const res = await fetch("/api/stock/request/pending")
    const data = await res.json()
    setRequests(data)
  }

  const handleAction = async (id: string, approved: boolean) => {
    const res = await fetch("/api/stock/request/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, approved }),
    })

    if (res.ok) {
      alert(approved ? "✅ Approved!" : "❌ Rejected!")
      fetchRequests()
    } else {
      const err = await res.json()
      alert("Error: " + err.error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛠 Admin Approval Dashboard</h1>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Requested By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-center border-t">
                <td className="p-2">{req.product.name}</td>
                <td>{req.type}</td>
                <td>{req.quantity}</td>
                <td>{req.requester.name}</td>
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleAction(req.id, true)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, false)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
