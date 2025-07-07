import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Editor from './pages/Editor';
import EbayIntegration from './pages/EbayIntegration';
import AuthCallback from './components/EbayIntegration/AuthCallback';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { applyTheme } = useSettingsStore();

  // Apply theme on app load and when component mounts
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/ebay" element={<EbayIntegration />} />
            <Route path="/ebay/callback" element={<AuthCallback />} />
            {user?.role === 'admin' && (
              <Route path="/users" element={<UserManagement />} />
            )}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;