"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersPage;
const UsersHeader_1 = __importDefault(require("@/components/admin/UsersHeader"));
const UsersSearchBar_1 = __importDefault(require("@/components/admin/UsersSearchBar"));
const UsersFilterBar_1 = __importDefault(require("@/components/admin/UsersFilterBar"));
const UsersTable_1 = __importDefault(require("@/components/admin/UsersTable"));
const UsersPagination_1 = __importDefault(require("@/components/admin/UsersPagination"));
const link_1 = __importDefault(require("next/link"));
function UsersPage() {
    return (<div className="px-40 flex justify-center py-5 bg-[#fafbf9] min-h-screen">
      <div className="w-full max-w-[960px] flex flex-col">
        
        {/* We wrap the header and the button in a flex container */}
        <div className="flex justify-between items-center mb-4">
          <UsersHeader_1.default />

          {/* === 👇 ADD THIS BUTTON 👇 === */}
          <link_1.default href="/admin/users/create" className="bg-green-600 text-white font-bold px-4 py-2 rounded-full hover:bg-green-700 whitespace-nowrap">
            + Add New User
          </link_1.default>
          {/* ============================== */}

        </div>

        <UsersSearchBar_1.default />
        <UsersFilterBar_1.default />
        <UsersTable_1.default />
        <UsersPagination_1.default />
        <p className="text-[#708a5c] text-sm font-normal px-4 pb-3 pt-1">Total Users: 100</p>
      </div>
    </div>);
}
