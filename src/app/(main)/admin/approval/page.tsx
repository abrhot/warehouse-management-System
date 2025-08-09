// C:\Users\USER\Desktop\warehouse-management\src\app\(main)\admin\approval\page.tsx

'use client'
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"; 

// --- Helper Icon Components for a cleaner look ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);


type StockRequest = {
  id: string
  type: "IN" | "OUT"
  quantity: number
  status: string
  product: { name: string }
  requester: { name:string; email?: string }
  createdAt: string
}

export default function ApprovalPage() {
  const [requests, setRequests] = useState<StockRequest[]>([])
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // All logic functions are unchanged.
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/stock/pending");
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  }

  const handleAction = async (id: string, approved: boolean) => {
    setLoadingActionId(id);
    try {
      const res = await fetch("/api/stock/approve", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, approved }),
      })

      if (res.ok) {
        alert(approved ? "✅ Approved!" : "❌ Rejected!")
        fetchRequests()
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "An unknown error occurred"));
      }
    } catch (error) {
      alert("An unexpected error occurred.")
    } finally {
      setLoadingActionId(null);
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Approval Dashboard"
          subtitle="Review and process all pending stock requests."
        />

        <div className="mt-8">
          {requests.length === 0 ? (
            // --- Empty State (Unchanged) ---
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending requests</h3>
              <p className="mt-1 text-sm text-gray-500">All requests have been processed. Good job!</p>
            </div>
          ) : (
            // --- New Timeline/Feed Layout ---
            <div className="flow-root">
              <ul className="-mb-8">
                {requests.map((req, reqIdx) => (
                  <li key={req.id}>
                    <div className="relative pb-8">
                      {/* Timeline line */}
                      {reqIdx !== requests.length - 1 ? (
                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        {/* Event Icon */}
                        <div>
                          <span className={`flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-white ${
                              req.type === 'IN' ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {req.type === 'IN' ? 
                              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> : 
                              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                            }
                          </span>
                        </div>
                        {/* Event Content */}
                        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="p-4">
                            <div className="flex justify-between">
                              <p className="text-lg font-bold text-gray-900">{req.product.name}</p>
                              <p className="flex-shrink-0 text-sm font-medium text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              <span className="font-semibold">{req.quantity} units</span> requested by <span className="font-semibold">{req.requester.name}</span>
                            </p>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-x-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
                              <button
                                onClick={() => handleAction(req.id, false)}
                                disabled={loadingActionId === req.id}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <XMarkIcon />
                                Reject
                              </button>
                              <button
                                onClick={() => handleAction(req.id, true)}
                                disabled={loadingActionId === req.id}
                                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckIcon />
                                Approve
                              </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}