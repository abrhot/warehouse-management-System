const logs = [
  { timestamp: "2024-01-15 10:30 AM", action: "Profile Updated", device: "Desktop / 192.168.1.100" },
  { timestamp: "2024-01-10 02:45 PM", action: "Logged In", device: "Mobile / 192.168.1.105" },
];

export default function ActivityLogs() {
  return (
    <div>
      <h2 className="text-xl font-semibold pt-6 pb-2">Activity Logs</h2>
      <table className="w-full border border-[#dbe2d4] rounded-xl overflow-hidden">
        <thead className="bg-[#fafbf9]">
          <tr className="text-left text-sm font-medium text-[#141810]">
            <th className="p-3">Timestamp</th>
            <th className="p-3">Action</th>
            <th className="p-3">Device/IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className="border-t border-[#dbe2d4] text-sm text-[#708a5c]">
              <td className="p-3">{log.timestamp}</td>
              <td className="p-3">{log.action}</td>
              <td className="p-3">{log.device}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
