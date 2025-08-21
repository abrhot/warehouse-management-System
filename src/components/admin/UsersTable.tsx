
// src/components/admin/users/UsersTable.tsx

const users = [
  { username: 'abera_123', name: 'Abera Kebede', email: 'abera.kebede@example.com', role: 'Admin', status: 'Active', created: '2023-01-15', lastLogin: '2024-05-20' },
  { username: 'chaltu_456', name: 'Chaltu Bekele', email: 'chaltu.bekele@example.com', role: 'Supervisor', status: 'Active', created: '2023-03-22', lastLogin: '2024-05-21' },
  { username: 'dani_789', name: 'Daniel Tesfaye', email: 'daniel.tesfaye@example.com', role: 'Clerk', status: 'Inactive', created: '2023-05-10', lastLogin: '2024-04-30' },
  { username: 'eleni_012', name: 'Eleni Alemayehu', email: 'eleni.alemayehu@example.com', role: 'Admin', status: 'Active', created: '2023-07-05', lastLogin: '2024-05-22' },
  { username: 'fikru_345', name: 'Fikru Tadesse', email: 'fikru.tadesse@example.com', role: 'Supervisor', status: 'Active', created: '2023-09-12', lastLogin: '2024-05-19' },
  { username: 'genet_678', name: 'Genet Hailu', email: 'genet.hailu@example.com', role: 'Clerk', status: 'Active', created: '2023-11-20', lastLogin: '2024-05-23' },
  { username: 'hagos_901', name: 'Hagos Gebre', email: 'hagos.gebre@example.com', role: 'Admin', status: 'Inactive', created: '2024-01-08', lastLogin: '2024-03-15' },
  { username: 'idris_234', name: 'Idris Mohammed', email: 'idris.mohammed@example.com', role: 'Supervisor', status: 'Active', created: '2024-03-18', lastLogin: '2024-05-24' },
  { username: 'jafar_567', name: 'Jafar Ali', email: 'jafar.ali@example.com', role: 'Clerk', status: 'Active', created: '2024-05-01', lastLogin: '2024-05-25' },
  { username: 'kalkidan_890', name: 'Kalkidan Assefa', email: 'kalkidan.assefa@example.com', role: 'Admin', status: 'Active', created: '2024-06-10', lastLogin: '2024-06-11' },
  { username: 'leul_777', name: 'Leul Desta', email: 'leul.desta@example.com', role: 'Supervisor', status: 'Active', created: '2023-02-14', lastLogin: '2024-03-01' },
  { username: 'mihret_666', name: 'Mihret Wolde', email: 'mihret.wolde@example.com', role: 'Clerk', status: 'Inactive', created: '2023-08-30', lastLogin: '2024-02-15' },
  { username: 'nati_321', name: 'Natnael Tesema', email: 'natnael.tesema@example.com', role: 'Admin', status: 'Active', created: '2024-02-12', lastLogin: '2024-07-01' },
  { username: 'osman_123', name: 'Osman Said', email: 'osman.said@example.com', role: 'Clerk', status: 'Active', created: '2024-05-10', lastLogin: '2024-07-25' },
  { username: 'paulos_222', name: 'Paulos Getachew', email: 'paulos.getachew@example.com', role: 'Supervisor', status: 'Inactive', created: '2023-06-03', lastLogin: '2024-01-05' },
  { username: 'ruth_333', name: 'Ruth Melaku', email: 'ruth.melaku@example.com', role: 'Admin', status: 'Active', created: '2024-01-01', lastLogin: '2024-06-30' },
]
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
