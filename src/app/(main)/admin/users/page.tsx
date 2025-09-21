'use client';

import { useState, ChangeEvent } from 'react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample users (replace with API data later)
  const users = [
    { name: 'Florence Shaw', email: 'florence@untitledui.com', access: 'Admin', lastActive: 'Mar 4, 2024', dateAdded: 'July 4, 2022' },
    { name: 'Amélie Laurent', email: 'amelie@untitledui.com', access: 'Admin', lastActive: 'Mar 4, 2024', dateAdded: 'July 4, 2022' },
    { name: 'Ammar Foley', email: 'ammar@untitledui.com', access: 'Data Export', lastActive: 'Mar 2, 2024', dateAdded: 'July 4, 2022' },
    { name: 'Caitlyn King', email: 'caitlyn@untitledui.com', access: 'Data Import', lastActive: 'Mar 6, 2024', dateAdded: 'July 4, 2022' },
    { name: 'Sienna Hewitt', email: 'sienna@untitledui.com', access: 'Data Export', lastActive: 'Mar 8, 2024', dateAdded: 'July 4, 2022' },
    { name: 'Olly Schroeder', email: 'olly@untitledui.com', access: 'Data Import', lastActive: 'Mar 6, 2024', dateAdded: 'July 4, 2022' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="px-40 py-5 bg-gray-100 min-h-screen font-sans text-gray-800">
      <div className="w-full max-w-[960px] flex flex-col mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1">User management</h2>
          <p className="text-gray-500">Manage your team members and their account permissions here.</p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">All users {filteredUsers.length}</h3>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Add User */}
            <a
              href="/admin/users/create"
              className="bg-white text-black font-bold px-4 py-2 rounded-full border border-gray-300 hover:bg-indigo-600 hover:text-white whitespace-nowrap transition-colors"
            >
              + Add New User
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-indigo-600" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date added</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4"><input type="checkbox" className="rounded text-indigo-600" /></td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.access}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.lastActive}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.dateAdded}</td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">Page 1 of 6</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-lg border text-gray-600 hover:bg-gray-200">Previous</button>
            <button className="px-3 py-1 rounded-lg border text-gray-600 hover:bg-gray-200">Next</button>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">Total Users: {users.length}</p>
      </div>
    </div>
  );
}
