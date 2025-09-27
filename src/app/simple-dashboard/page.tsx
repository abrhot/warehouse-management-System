"use client";

export default function SimpleDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Dashboard (No Auth Required)</h1>
      <p>If you can see this page, the redirect is working!</p>
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p><strong>Success!</strong> Login redirect is functioning properly.</p>
      </div>
      <div className="mt-4">
        <p><strong>Current cookies:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
          {typeof document !== 'undefined' ? document.cookie || 'No cookies' : 'Loading...'}
        </pre>
      </div>
    </div>
  );
}
