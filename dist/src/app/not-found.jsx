"use strict";
// app/not-found.tsx
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
function NotFound() {
    return (<div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>);
}
