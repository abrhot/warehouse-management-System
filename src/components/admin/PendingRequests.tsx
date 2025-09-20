'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// --- Helper Icons (No change needed here) ---
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-5 w-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);
const ArrowUpTrayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);
const ArrowDownTrayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
);
const NoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
);

interface PendingRequest {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
  notes: string | null;
  product?: {
    name: string;
    quantity: number;
  };
  requester?: {
    name: string | null;
    email: string;
  };
}

const RejectionModal = ({ isOpen, onClose, onSubmit, remark, setRemark }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  remark: string;
  setRemark: (remark: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      <div className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Reason for Rejection</h2>
        <p className="mb-4 text-sm text-gray-600">Please provide a remark for rejecting this request. This will be visible to the requester.</p>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          rows={4}
          placeholder="e.g., Insufficient stock, duplicate request, etc."
        />
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            type="button"
            className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Submit Rejection
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ApprovalPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [requestToRejectId, setRequestToRejectId] = useState<string | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stock/pending');
      if (!res.ok) {
        let errorMessage = 'Failed to fetch requests due to a server error.';
        try {
          // Attempt to parse a more specific error from the API response body
          const errorData = await res.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // The response was not JSON, stick with the generic server error message.
          console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An unexpected error occurred while fetching requests.');
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcessRequest = async (
    requestId: string,
    newStatus: 'APPROVED' | 'REJECTED',
    remark?: string
  ) => {
    try {
      const body: { requestId: string; newStatus: string; remark?: string } = {
        requestId,
        newStatus,
      };
      if (newStatus === 'REJECTED' && remark) {
        body.remark = remark;
      }
      const res = await fetch('/api/stock/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }
      toast.success(`Request successfully ${newStatus.toLowerCase()}!`);
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleToggleDetails = (requestId: string) => {
    setExpandedRequestId(prevId => (prevId === requestId ? null : requestId));
  };

  const handleOpenRejectionModal = (requestId: string) => {
    setRequestToRejectId(requestId);
    setIsRejectionModalOpen(true);
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false);
    setRequestToRejectId(null);
    setRejectionRemark('');
  };

  const handleRejectSubmit = async () => {
    if (!requestToRejectId) return;
    if (!rejectionRemark.trim()) {
      toast.error('Rejection remark cannot be empty.');
      return;
    }
    await handleProcessRequest(requestToRejectId, 'REJECTED', rejectionRemark);
    handleCloseRejectionModal();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-lg font-medium text-gray-600">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Requests</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        <RejectionModal
          isOpen={isRejectionModalOpen}
          onClose={handleCloseRejectionModal}
          onSubmit={handleRejectSubmit}
          remark={rejectionRemark}
          setRemark={setRejectionRemark}
        />
        {requests.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm mt-8">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Pending Requests</h3>
            <p className="text-gray-500">All requests have been processed or there are no new requests at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 rounded-lg p-2 ${ req.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' }`}>
                        {req.type === 'IN' ? <ArrowDownTrayIcon /> : <ArrowUpTrayIcon />}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1.5 flex items-center space-x-3">
                          <h3 className="text-md font-semibold text-gray-900">{req.product?.name || 'Unknown Product'}</h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ req.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>
                            {req.type === 'IN' ? 'Stock In' : 'Stock Out'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-medium text-gray-900">{req.quantity}</span>
                            <span>units</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <UserIcon />
                            <span>by <span className="font-medium text-gray-900">{req.requester?.name || req.requester?.email || 'Unknown User'}</span></span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <ClockIcon />
                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center space-x-2">
                      <button
                        onClick={() => handleOpenRejectionModal(req.id)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Reject
                      </button>
                      <button
                        onClick={() => handleProcessRequest(req.id, 'APPROVED')}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleToggleDetails(req.id)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <ChevronDownIcon className={`transition-transform duration-200 ${expandedRequestId === req.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                {expandedRequestId === req.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {req.notes && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2"><NoteIcon /><h4 className="text-xs font-semibold uppercase text-gray-700">Notes</h4></div>
                          <p className="rounded-md border border-gray-200 bg-white p-2.5 text-sm text-gray-600">{req.notes}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2"><ClockIcon /><h4 className="text-xs font-semibold uppercase text-gray-700">Request Details</h4></div>
                        <div className="space-y-1.5 rounded-md border border-gray-200 bg-white p-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Requested On:</span><span className="font-medium text-gray-900">{new Date(req.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Current Stock:</span>
                            <span className="font-medium text-gray-900">{req.product?.quantity ?? 'N/A'} units</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Request ID:</span><span className="font-mono text-xs text-gray-500">{req.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

