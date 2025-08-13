// src/components/admin/UsersHeader.tsx
import { SearchIcon, PlusIcon } from '@heroicons/react/solid'; // Assumed icons from Heroicons

interface UsersHeaderProps {
  userCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const UsersHeader = ({ userCount, searchQuery, onSearchChange }: UsersHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">All users {userCount}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-50"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md shadow-sm hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add user
        </button>
      </div>
    </div>
  );
};