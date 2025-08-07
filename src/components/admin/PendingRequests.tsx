'use client';

import React, { useState, useEffect } from 'react';

// Define a type for the detailed request data
interface PendingRequest {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
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
      // Remove the processed request from the list
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));

    } catch (err: any) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading pending requests...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Pending Stock Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li key={req.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">
                    {req.product.name} -{' '}
                    <span className={req.type === 'IN' ? 'text-green-600' : 'text-red-600'}>
                       {req.type} ({req.quantity})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Stock: {req.product.quantity} | Requested by: {req.requester.name || req.requester.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcessRequest(req.id, 'APPROVED')}
                    className="bg-green-500 text-white px-3 py-1 rounded-md font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcessRequest(req.id, 'REJECTED')}
                    className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold"
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