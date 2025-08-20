
interface PendingRequest {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
  notes: string | null;
  product?: { // Marking as optional for safety
    name: string;
    quantity: number;
  };
  requester?: { // Marking as optional for safety
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


export default function PendingRequests() {
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
                          {/* --- FIX #1: Added optional chaining for product name --- */}
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
                            {/* --- FIX #2: Added optional chaining for requester name/email --- */}
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
                            {/* --- FIX #3: Added optional chaining and nullish coalescing for product quantity --- */}
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