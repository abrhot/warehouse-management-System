// src/app/(main)/admin/users/page.tsx
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
        <UsersHeader />
        <UsersSearchBar />
        <UsersFilterBar />
        <UsersTable />
        <UsersPagination />
        <p className="text-[#708a5c] text-sm font-normal px-4 pb-3 pt-1">Total Users: 100</p>
      </div>
    </div>
  )
}
