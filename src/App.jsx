import { useState } from 'react'
import AdminLogin from './page/Login'
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import PositionManagement from './components/PositionManagement';
import DashboardPage from './page/Dashboard';
import MentorApprovalPage from './page/MentorApprovalPage';
import UserManagementPage from './page/UserManagementPage';
import CreateUser from './page/CreateUser';
import ProtectedRoute from './routes/ProtectedRoute';
import { BrowserRouter, Route,  Routes } from 'react-router-dom';
import BookingManagement from './page/BookingManagement';
import InvoiceManagement from './page/InvoicManagement';
import CertificateManagement from './page/CertificateManagement';
import SettingsPage from './page/Setting';
import VerifyEmail from './components/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ========================================= */}
          {/* 1. PUBLIC ROUTES (Admin ចូលបានដោយមិនបាច់ Login) */}
          {/* ========================================= */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* ✅ ដាក់ Forgot/Reset នៅទីនេះ ដើម្បីឱ្យ Admin ប្រើបានពេលភ្លេចលេខ */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ========================================= */}
          {/* 2. PROTECTED ADMIN ROUTES (ទាល់តែ Login សិន) */}
          {/* ========================================= */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/mentor-approval" element={<MentorApprovalPage />} />
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/position-management" element={<PositionManagement />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path='/booking-management' element={<BookingManagement />} />
              <Route path='/invoice-management' element={<InvoiceManagement />} />
              <Route path='/certificate-management' element={<CertificateManagement />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Route>
          </Route>
          
          {/* 3. Catch All (Page 404) */}
          <Route path="*" element={<div className="text-center mt-5"><h1>404 Not Found</h1></div>} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;