// src/components/admin/UsersHeader.tsx
import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';

interface UsersHeaderProps {
  userCount: number;
}

export default function UsersHeader({ userCount }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold">Users ({userCount})</h2>
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
        <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded">
          <PlusIcon className="w-4 h-4" />
          Add User
        </button>
      </div>
    </div>
  );
}
