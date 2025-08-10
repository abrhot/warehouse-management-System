"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationList;
const notifications = [
    { message: 'Stock-in completed for Modem X', time: '2 min ago', type: 'success' },
    { message: 'Low stock alert for Switch B', time: '10 min ago', type: 'warning' },
    { message: 'Stock-out completed for Router Y', time: '30 min ago', type: 'success' },
    { message: 'New product added: Cable Z', time: '1 hour ago', type: 'success' },
    { message: 'Stock adjustment for Server A', time: '2 hours ago', type: 'success' },
];
function NotificationList() {
    return (<div className="flex flex-col w-full">
      <h2 className="text-[22px] font-bold text-[#141810] px-4 pb-3 pt-5">Notifications</h2>
      {notifications.map((n, i) => (<div key={i} className="flex gap-4 px-4 py-2 items-center bg-[#fafbf9] min-h-[72px]">
          <div className="flex items-center justify-center size-12 rounded-lg bg-[#edf1ea] text-[#141810]">
            {/* icon based on type */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="..."/>
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-base font-medium">{n.message}</p>
            <p className="text-sm text-[#708a5c]">{n.time}</p>
          </div>
        </div>))}
      <p className="text-sm text-[#708a5c] text-center underline pt-1 pb-3 px-4">View All Notifications</p>
    </div>);
}
