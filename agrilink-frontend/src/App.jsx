import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Import Layouts/Pages
import Login from './pages/LoginPage.jsx'; 
import Register from './pages/RegisterPage.jsx'; // 👈 Added registration component import
import FarmerDashboard from './pages/FarmerDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import SupplierDashboard from './pages/SupplierDashboard.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Gates */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* 👈 Added public register route */}

          {/* Secure Farmer Route Space */}
          <Route path="/farmer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Secure Buyer Route Space */}
          <Route 
            path="/buyer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Secure Supplier Route Space */}
          <Route 
            path="/supplier-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['supplier']}>
                <SupplierDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;