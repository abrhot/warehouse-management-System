"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersHeader;
function UsersHeader() {
    return (<div className="flex flex-wrap justify-between gap-3 p-4">
      <h1 className="text-[32px] font-bold text-[#141810]">User Management</h1>
      <button className="h-8 px-4 bg-[#edf1ea] rounded-xl text-sm font-medium text-[#141810]">
        Add User
      </button>
    </div>);
}
