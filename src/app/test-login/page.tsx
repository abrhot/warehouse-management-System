"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCookies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();
      setResult({ type: 'Cookie Test', data });
    } catch (error) {
      setResult({ type: 'Error', data: error });
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@warehouse.com',
          password: 'test123'
        })
      });
      const data = await response.json();
      setResult({ type: 'Login Test', data, status: response.status });
      
      // If login successful, set cookie manually
      if (data.success && data.token) {
        document.cookie = `authToken=${data.token}; path=/; max-age=86400`;
        console.log('Cookie set manually:', data.token);
      }
    } catch (error) {
      setResult({ type: 'Login Error', data: error });
    }
    setLoading(false);
  };

  const testSetCookie = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      const data = await response.json();
      setResult({ type: 'Set Cookie Test', data });
    } catch (error) {
      setResult({ type: 'Set Cookie Error', data: error });
    }
    setLoading(false);
  };

  const testRedirect = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={testCookies} disabled={loading}>
              Test Cookies
            </Button>
            <Button onClick={testLogin} disabled={loading}>
              Test Login API
            </Button>
            <Button onClick={testSetCookie} disabled={loading}>
              Test Set Cookie
            </Button>
            <Button onClick={testRedirect} disabled={loading}>
              Test Redirect to Dashboard
            </Button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">{result.type} Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h4 className="font-semibold mb-2">Current Cookies:</h4>
            <p className="text-sm font-mono">
              {typeof window !== 'undefined' ? document.cookie || 'No cookies' : 'Loading...'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
