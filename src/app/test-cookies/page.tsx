'use client';

import { useEffect, useState } from 'react';

export default function TestCookies() {
  const [cookies, setCookies] = useState('');
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    setCookies(document.cookie);
    
    // Extract authToken specifically
    const match = document.cookie.match(/authToken=([^;]+)/);
    setAuthToken(match ? match[1] : 'Not found');
  }, []);

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@warehouse.com',
          password: 'test123'
        })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      // Refresh cookie display
      setTimeout(() => {
        setCookies(document.cookie);
        const match = document.cookie.match(/authToken=([^;]+)/);
        setAuthToken(match ? match[1] : 'Not found');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Test Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
      </div>
      
      <div className="mb-4">
        <h2 className="font-bold">All Cookies:</h2>
        <pre className="bg-gray-100 p-2 text-sm">{cookies || 'No cookies'}</pre>
      </div>
      
      <div className="mb-4">
        <h2 className="font-bold">AuthToken:</h2>
        <pre className="bg-gray-100 p-2 text-sm">{authToken}</pre>
      </div>
      
      <div>
        <a href="/dashboard" className="text-blue-500 underline">
          Try Dashboard
        </a>
      </div>
    </div>
  );
}
