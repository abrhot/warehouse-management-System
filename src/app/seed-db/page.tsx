'use client';

import { useState } from 'react';

export default function SeedDatabasePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const seedDatabase = async () => {
    setLoading(true);
    setResult('Seeding database... This may take 30-60 seconds...');

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ SUCCESS!

Database seeded successfully!

Data Created:
- Categories: ${data.data.categories}
- Products: ${data.data.products}
- Stock Items: ${data.data.stockItems}
- Sample Requests: ${data.data.requests}

Users:
${data.data.users.map((u: any) => `- ${u.email} (${u.role})`).join('\n')}

🎉 Your dashboard should now show products and pending requests!`);
      } else {
        setResult(`❌ Error: ${data.error || data.message}`);
      }
    } catch (error: any) {
      setResult(`❌ Network Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '50px', 
      textAlign: 'center', 
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        maxWidth: '600px', 
        margin: '0 auto' 
      }}>
        <h1>🌱 Seed Production Database</h1>
        <p>This will populate your production database with:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>7 Categories (Routers, Switches, Firewalls, etc.)</li>
          <li>50 Products with realistic data</li>
          <li>Stock items with serial numbers</li>
          <li>5 Sample pending requests</li>
          <li>Admin and test user accounts</li>
        </ul>
        
        <button 
          onClick={seedDatabase} 
          disabled={loading}
          style={{
            padding: '20px 40px',
            fontSize: '18px',
            background: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '20px'
          }}
        >
          {loading ? '⏳ Seeding...' : '🚀 Seed Database Now'}
        </button>

        {result && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '5px',
            textAlign: 'left',
            background: result.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
            color: result.includes('SUCCESS') ? '#155724' : '#721c24',
            border: result.includes('SUCCESS') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            whiteSpace: 'pre-wrap'
          }}>
            {result}
          </div>
        )}

        {result.includes('SUCCESS') && (
          <div style={{ marginTop: '20px' }}>
            <a 
              href="/" 
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              → Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
