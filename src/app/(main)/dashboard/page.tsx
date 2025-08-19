'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalStockItems: number;
  pendingRequests: number;
}

interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalStockItems: 0,
    pendingRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard summary
      const summaryRes = await fetch('/api/dashboard/summery');
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setStats({
          totalProducts: summaryData.totalProducts || 0,
          totalCategories: summaryData.totalCategories || 0,
          totalStockItems: summaryData.totalStockItems || 0,
          pendingRequests: summaryData.pendingRequests || 0,
        });
      }

      // Fetch recent activity
      const activityRes = await fetch('/api/dashboard/activity');
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.slice(0, 5)); // Show only last 5 activities
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your warehouse.</p>
        </div>

        {/* Stats Cards with Line Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            {/* Simple Line Chart */}
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M0,50 L20,45 L40,35 L60,40 L80,25 L100,30"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,50 L20,45 L40,35 L60,40 L80,25 L100,30 L100,60 L0,60 Z"
                  fill="url(#blueGradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            {/* Simple Line Chart */}
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M0,40 L20,35 L40,45 L60,30 L80,35 L100,25"
                  stroke="#10B981"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,40 L20,35 L40,45 L60,30 L80,35 L100,25 L100,60 L0,60 Z"
                  fill="url(#greenGradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Total Stock Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStockItems}</p>
              </div>
              <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
                </svg>
              </div>
            </div>
            {/* Simple Line Chart */}
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M0,45 L20,40 L40,35 L60,45 L80,30 L100,35"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,45 L20,40 L40,35 L60,45 L80,30 L100,35 L100,60 L0,60 Z"
                  fill="url(#purpleGradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
              <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {/* Simple Line Chart */}
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M0,35 L20,40 L40,30 L60,35 L80,25 L100,30"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,35 L20,40 L40,30 L60,35 L80,25 L100,30 L100,60 L0,60 Z"
                  fill="url(#orangeGradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Categories Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories Distribution</h3>
            <div className="h-64">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Sample pie chart for categories */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
                <path d="M100,100 L100,20 A80,80 0 0,1 180,100 Z" fill="#3B82F6"/>
                <path d="M100,100 L180,100 A80,80 0 0,1 100,180 Z" fill="#10B981"/>
                <path d="M100,100 L100,180 A80,80 0 0,1 20,100 Z" fill="#8B5CF6"/>
                <path d="M100,100 L20,100 A80,80 0 0,1 100,20 Z" fill="#F59E0B"/>
                
                {/* Labels */}
                <text x="140" y="80" className="text-xs font-medium" fill="#374151">Electronics</text>
                <text x="140" y="140" className="text-xs font-medium" fill="#374151">Clothing</text>
                <text x="60" y="140" className="text-xs font-medium" fill="#374151">Books</text>
                <text x="60" y="80" className="text-xs font-medium" fill="#374151">Tools</text>
              </svg>
            </div>
          </div>

          {/* Stock Status Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status Overview</h3>
            <div className="h-64">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Sample bar chart for stock status */}
                <rect x="20" y="120" width="30" height="60" fill="#3B82F6" rx="2"/>
                <rect x="60" y="80" width="30" height="100" fill="#10B981" rx="2"/>
                <rect x="100" y="100" width="30" height="80" fill="#8B5CF6" rx="2"/>
                <rect x="140" y="60" width="30" height="120" fill="#F59E0B" rx="2"/>
                
                {/* Labels */}
                <text x="35" y="190" className="text-xs font-medium" fill="#374151">In Stock</text>
                <text x="75" y="190" className="text-xs font-medium" fill="#374151">Reserved</text>
                <text x="115" y="190" className="text-xs font-medium" fill="#374151">Shipped</text>
                <text x="155" y="190" className="text-xs font-medium" fill="#374151">Low Stock</text>
                
                {/* Y-axis labels */}
                <text x="10" y="130" className="text-xs" fill="#6B7280">0</text>
                <text x="10" y="100" className="text-xs" fill="#6B7280">25</text>
                <text x="10" y="70" className="text-xs" fill="#6B7280">50</text>
                <text x="10" y="40" className="text-xs" fill="#6B7280">75</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{activity.action}</span>
                  <span className="text-xs text-gray-400 ml-auto">{activity.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}