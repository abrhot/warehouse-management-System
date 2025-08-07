'use client';

import React, { useState, useEffect } from 'react';

// Update the interface to include the 'notes' field
interface PendingRequest {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
  notes: string | null; // The new optional notes field
  product: {
    name: string;
    quantity: number;
  };
  requester: {
    name: string | null;
    email: string;
  };
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stock/pending');
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcessRequest = async (requestId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/stock/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }
      alert(`✅ Request successfully ${newStatus.toLowerCase()}!`);
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
    } catch (err: any) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading pending requests...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Pending Stock Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li key={req.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                  <p className="font-bold text-lg">
                    {req.product.name}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className={req.type === 'IN' ? 'text-green-600' : 'text-red-600'}>
                       {req.type} ({req.quantity} units)
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Requested by: <strong>{req.requester.name || req.requester.email}</strong>
                  </p>
                  
                  {/* Display notes if they exist */}
                  {req.notes && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 border-l-4 border-gray-300">
                      <strong>Notes:</strong> {req.notes}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 pt-2">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleProcessRequest(req.id, 'APPROVED')}
                    className="bg-green-500 text-white px-3 py-1 text-sm rounded-md font-semibold hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcessRequest(req.id, 'REJECTED')}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded-md font-semibold hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}