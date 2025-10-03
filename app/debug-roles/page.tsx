'use client';

import { useAuth } from '@/lib/nextauth';
import { getPrimaryRole, isAdmin } from '@/lib/sts';
import { useState, useEffect } from 'react';

export default function DebugRolesPage() {
  const { user, isLoading } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userRoles = user?.roles || [];
  const primaryRole = getPrimaryRole(userRoles);
  const userIsAdmin = isAdmin(userRoles);

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/session');
      const data = await response.json();
      setSessionData(data);
      console.log('🔍 DEBUG PAGE: Session data from API:', data);
    } catch (error) {
      console.error('❌ DEBUG PAGE: Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessionData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Roles</h1>
            <p className="text-gray-600">Please sign in to view role information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Roles & STS Integration</h1>
          
          {/* Client-side user data */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Client-side User Data</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>User ID:</strong> {user.id || 'N/A'}
                </div>
                <div>
                  <strong>Name:</strong> {user.name || 'N/A'}
                </div>
                <div>
                  <strong>Email:</strong> {user.email || 'N/A'}
                </div>
                <div>
                  <strong>Roles Array:</strong> {JSON.stringify(userRoles)}
                </div>
                <div>
                  <strong>Primary Role:</strong> {primaryRole}
                </div>
                <div>
                  <strong>Is Admin:</strong> {userIsAdmin ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* Server-side session data */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Server-side Session Data</h2>
            <button
              onClick={fetchSessionData}
              disabled={loading}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Session Data'}
            </button>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {sessionData ? JSON.stringify(sessionData, null, 2) : 'Click refresh to load session data'}
              </pre>
            </div>
          </div>

          {/* Raw user object */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Raw User Object</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          {/* Role badges preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Role Badge Preview</h2>
            <div className="flex flex-wrap gap-2">
              {userRoles.length > 0 ? (
                userRoles.map((role, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No roles to display</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
