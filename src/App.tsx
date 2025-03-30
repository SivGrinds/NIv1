import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/layout/Layout';
import CityDirectoryPage from './pages/CityDirectoryPage';
import StateDirectoryPage from './pages/StateDirectoryPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<div>Search Page Coming Soon</div>} />
            <Route path="/dental-implants" element={<div>All States Directory Coming Soon</div>} />
            <Route path="/dental-implants/:state" element={<StateDirectoryPage />} />
            <Route path="/dental-implants/:state/:city" element={<CityDirectoryPage />} />
            <Route path="/dental-implants/:state/:city/:providerSlug" element={<ProviderProfilePage />} />
            <Route path="/locations/:city" element={<CityDirectoryPage />} />
            <Route path="/for-dentists" element={<div>For Dentists Page Coming Soon</div>} />
            <Route path="/education" element={<div>Education Page Coming Soon</div>} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            
            {/* Redirect root to home page */}
            <Route path="/" element={<Navigate to="/dental-implants" replace />} />
          </Routes>
        </Router>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;