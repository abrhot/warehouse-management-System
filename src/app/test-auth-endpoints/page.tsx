'use client';

import { useState } from 'react';

export default function TestAuthEndpoints() {
  const [results, setResults] = useState<any[]>([]);

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      setResults(prev => [...prev, {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        endpoint,
        method,
        status: 'ERROR',
        success: false,
        data: { error: (error as Error).message },
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const runTests = async () => {
    setResults([]);
    
    // Test endpoints that should work with JWT authentication
    await testEndpoint('/api/debug-auth');
    await testEndpoint('/api/categories');
    await testEndpoint('/api/my-requests');
    
    // Test creating a category (admin only)
    await testEndpoint('/api/categories', 'POST', {
      name: 'Test Category',
      description: 'Test category created from auth test'
    });
    
    // Test creating a user (admin only)
    await testEndpoint('/api/users/create', 'POST', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpass123',
      role: 'USER'
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Authentication Tests
        </button>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className={`p-4 border rounded ${
              result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="font-bold">
              {result.method} {result.endpoint} - Status: {result.status}
            </div>
            <div className="text-sm text-gray-600 mb-2">{result.timestamp}</div>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-gray-500 italic">
          Click "Run Authentication Tests" to test the API endpoints
        </div>
      )}
    </div>
  );
}
