"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersSearchBar;
function UsersSearchBar() {
    return (<div className="px-4 py-3">
      <label className="block h-12 w-full">
        <div className="flex h-full w-full rounded-xl overflow-hidden">
          <div className="bg-[#edf1ea] flex items-center px-4 text-[#708a5c]">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34...Z"/>
            </svg>
          </div>
          <input placeholder="Search by username, email, or full name" className="w-full h-full px-4 text-[#141810] bg-[#edf1ea] placeholder:text-[#708a5c] text-base outline-none"/>
        </div>
      </label>
    </div>);
}
