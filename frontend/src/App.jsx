import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <Routes>
      {/* Redirect to feed if already logged in */}
      <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/feed" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/feed" replace /> : <Register />} />
      
      {/* Protected Routes */}
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
