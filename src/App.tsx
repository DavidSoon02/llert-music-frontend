import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Songs from './components/Songs';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import AdminSongs from './components/AdminSongs';
import AdminClients from './components/AdminClients';
import ServiceDebug from './components/ServiceDebug';
import AuthDebug from './components/AuthDebug';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/songs" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminSongs />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/clients" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminClients />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="songs" element={<Songs />} />
                <Route path="cart" element={<Cart />} />
                <Route path="library" element={<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-white mb-4">Your Library</h1><p className="text-gray-400">Coming Soon - Your purchased music will appear here</p></div></div>} />
                <Route path="profile" element={<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-white mb-4">Profile</h1><p className="text-gray-400">Coming Soon - Manage your profile settings</p></div></div>} />
                <Route path="settings" element={<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-white mb-4">Settings</h1><p className="text-gray-400">Coming Soon - Customize your experience</p></div></div>} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Debug components - solo en desarrollo */}
            <ServiceDebug />
            <AuthDebug />
          </Router>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
