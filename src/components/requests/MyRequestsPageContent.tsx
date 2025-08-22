

// Define the type for the summary data
interface SummaryData {
  total: number;
  rejected: number;
  pending: number;
}

// Update the component's props to accept initialRequests and summary
export function MyRequestsPageContent({
  initialRequests,
  summary
}: {
  initialRequests: UserRequestWithRelations[];
  summary: SummaryData;
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState<'table' | 'board'>('table');

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/my-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete request');
      }

      toast.success('Request deleted successfully!');
      setRequests(prev => prev.filter(req => req.id !== requestId));

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Safety check to prevent crash if stockItem or product is null
      const productName = req.stockItem?.product?.name || '';
      const serialNumber = req.stockItem?.serialNumber || '';

      const matchesSearch = serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 justify-center bg-[#fafbf8] py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col space-y-6">
        <RequestsHeader
          onStatusChange={setStatusFilter}
          currentFilter={statusFilter}
          view={view}
          onViewChange={setView}
        />

        {/* The summary component is now below the header */}
        <RequestsSummary summary={summary} />
        {view === 'table' ? (
          <RequestsTable
            requests={filteredRequests}
            onSearchChange={setSearchTerm}
            onDeleteRequest={handleDeleteRequest}
          />
        ) : (
          <RequestsBoardView requests={filteredRequests} />
        )}
      </div>
    </div>
  );
}

