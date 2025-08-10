"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersPagination;
function UsersPagination() {
    return (<div className="flex items-center justify-center p-4 gap-1">
      <button className="text-[#141810] size-10 flex items-center justify-center">←</button>
      {[1, 2, 3, '...', 10].map((pg, i) => (<button key={i} className={`size-10 flex items-center justify-center rounded-full ${pg === 1 ? 'bg-[#edf1ea] font-bold' : ''} text-[#141810] text-sm`}>
          {pg}
        </button>))}
      <button className="text-[#141810] size-10 flex items-center justify-center">→</button>
    </div>);
}
