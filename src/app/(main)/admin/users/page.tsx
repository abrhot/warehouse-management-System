import UsersHeader from '@/components/admin/UsersHeader'
import UsersSearchBar from '@/components/admin/UsersSearchBar'
import UsersFilterBar from '@/components/admin/UsersFilterBar'
import UsersTable from '@/components/admin/UsersTable'
import UsersPagination from '@/components/admin/UsersPagination'
import Link from "next/link";

export default function UsersPage() {
  return (
    <div className="px-40 flex justify-center py-5 bg-[#fafbf9] min-h-screen">
      <div className="w-full max-w-[960px] flex flex-col">
        
        {/* We wrap the header and the button in a flex container */}
        <div className="flex justify-between items-center mb-4">
          <UsersHeader />

          {/* === 👇 ADD THIS BUTTON 👇 === */}
          <Link 
            href="/admin/users/create"
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-full hover:bg-green-700 whitespace-nowrap"
          >
            + Add New User
          </Link>
          {/* ============================== */}

        </div>

        <UsersSearchBar />
        <UsersFilterBar />
        <UsersTable />
        <UsersPagination />
        <p className="text-[#708a5c] text-sm font-normal px-4 pb-3 pt-1">Total Users: 100</p>
      </div>
    </div>
  )
}