import { useState } from 'react'
import AdminLogin from './page/Login'
import Layout from './components/Layout';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  const [count, setCount] = useState(0)

  return (
 <BrowserRouter>

      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          {/* 2. Protected Admin Routes (Role: 'admin') */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            
            {/* All protected pages use the Layout (Sidebar + Content) */}
            <Route element={<Layout />}>

             <Route path="/" element={< DashboardPage/>} />
              {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
              <Route path="/mentor-approval" element={<MentorApprovalPage />} />
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/position-management" element={<PositionManagement />} />

              {/* NEW ROUTE - Create User */}
              <Route path="/create-user" element={<CreateUser />} />
              <Route path='/booking-management' element={<BookingManagement />} />
              <Route path='/invoice-management' element={<InvoiceManagement />} />
              <Route path='/certificate-management' element={<CertificateManagement />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Route>
            
          </Route>
          
          {/* 3. Catch All */}
          <Route path="*" element={<div>404 Not Found</div>} />
          
        </Routes>
      </AuthProvider>
 </BrowserRouter>
   
  
  );
}

export default App

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './routes/ProtectedRoute';

// import AdminLogin from './pages/AdminLogin';
// import DashboardPage from './pages/DashboardPage';
// import MentorApprovalPage from './pages/MentorApprovalPage';
// import UserManagementPage from './pages/UserManagementPage';
// import PositionManagement from './pages/PositionManagement';
// import CreateUser from './pages/CreateUser';
// import Layout from './components/Layout';

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* PUBLIC */}
//           <Route path="/login" element={<AdminLogin />} />

//           {/* PROTECTED ADMIN */}
//           <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
//             <Route element={<Layout />}>
//               <Route path="/dashboard" element={<DashboardPage />} />
//               <Route path="/mentor-approval" element={<MentorApprovalPage />} />
//               <Route path="/user-management" element={<UserManagementPage />} />
//               <Route path="/position-management" element={<PositionManagement />} />
//               <Route path="/create-user" element={<CreateUser />} />
//             </Route>
//           </Route>
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
