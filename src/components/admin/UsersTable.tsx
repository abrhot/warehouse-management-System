

export default function UsersTable() {
  return (
    <div className="px-4 py-3">
      <div className="overflow-x-auto rounded-xl border border-[#dbe2d4]">
        <table className="w-full bg-[#fafbf9]">
          <thead>
            <tr className="text-left text-sm font-medium text-[#141810] bg-[#fafbf9]">
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date Created</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3 text-[#708a5c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-t border-[#dbe2d4] text-sm">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2 text-[#708a5c]">{user.name}</td>
                <td className="px-4 py-2 text-[#708a5c]">{user.email}</td>
                <td className="px-4 py-2">
                  <button className="h-8 px-4 rounded-xl bg-[#edf1ea] text-sm text-[#141810]">{user.role}</button>
                </td>
                <td className="px-4 py-2">
                  <button className="h-8 px-4 rounded-xl bg-[#edf1ea] text-sm text-[#141810]">{user.status}</button>
                </td>
                <td className="px-4 py-2 text-[#708a5c]">{user.created}</td>
                <td className="px-4 py-2 text-[#708a5c]">{user.lastLogin}</td>
                <td className="px-4 py-2 text-[#708a5c] font-bold">Edit | Disable | Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
