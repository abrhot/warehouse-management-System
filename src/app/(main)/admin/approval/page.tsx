// C:\Users\USER\Desktop\warehouse-management\src\app\(main)\admin\approval\page.tsx

'use client'
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"; // Assuming you have this component

type StockRequest = {
  id: string
  type: "IN" | "OUT"
  quantity: number
  status: string
  product: { name: string }
  requester: { name: string; email?: string } // email is optional
  createdAt: string
}

export default function ApprovalPage() {
  const [requests, setRequests] = useState<StockRequest[]>([])
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // This function remains unchanged
  const fetchRequests = async () => {
    const res = await fetch("/api/stock/request/pending")
    const data = await res.json()
    setRequests(data)
  }

  // This function is enhanced with a loading state
  const handleAction = async (id: string, approved: boolean) => {
    setLoadingActionId(id); // Set loading state for this specific row
    try {
      const res = await fetch("/api/stock/request/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, approved }),
      })

      if (res.ok) {
        alert(approved ? "✅ Approved!" : "❌ Rejected!")
        fetchRequests() // Refresh the list
      } else {
        const err = await res.json()
        alert("Error: " + err.error)
      }
    } catch (error) {
      alert("An unexpected error occurred.")
    } finally {
      setLoadingActionId(null); // Clear loading state
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Approval Dashboard"
          subtitle="Review and process all pending stock requests."
        />

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending requests</h3>
                  <p className="mt-1 text-sm text-gray-500">All requests have been processed. Good job!</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Requested By</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {requests.map((req) => (
                        <tr key={req.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{req.product.name}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              req.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {req.type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{req.quantity}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{req.requester.name}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-x-2">
                              <button
                                onClick={() => handleAction(req.id, true)}
                                disabled={loadingActionId === req.id}
                                className="inline-flex items-center justify-center gap-1 rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-200 transition-all hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                ✔️ Approve
                              </button>
                              <button
                                onClick={() => handleAction(req.id, false)}
                                disabled={loadingActionId === req.id}
                                className="inline-flex items-center justify-center gap-1 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}