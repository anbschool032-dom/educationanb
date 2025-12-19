// import React, { useState } from 'react';
// // FIX: Use the useAuth hook from the correct path. If it's in a hook file, use that.
// // Based on your previous context setup, let's assume '../hooks/useAuth' is the final wrapper.
// import { useAuth } from '../hooks/useAuth'; 
// import { Navigate } from 'react-router-dom'; // Required for redirection

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); // New state for loading/button disabling
//   const { login, isAuthenticated, role } = useAuth(); 

//   // --- Conditional Redirection ---
//   // If already authenticated and IS the Admin role, redirect to Dashboard
//   if (isAuthenticated && role === 'admin') {
//       return <Navigate to="/" replace />;
//       // return <Navigate to="/" replace />;
//   }
//   // Optional: If authenticated but NOT admin (e.g., user/mentor logged into admin FE), redirect them away
//   if (isAuthenticated && role !== 'admin') {
//       // You should send them back to the public domain or show an access denied page
//       // For now, let's redirect them to the public login page as a fallback.
//       return <Navigate to="http://localhost:5173" replace={true} />; 
//   }

//   // --- Submission Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       // The login function (from AuthContext) calls the backend /auth/login
//       await login(email, password);
      
//       // AuthContext handles successful redirect to /dashboard
      
//     } catch (err) {
//       // Error message is caught from the AuthContext throw new Error()
//       setError(err.message || 'Login failed. Check Admin credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-wrapper">
//         <div className="admin-login-card">
//             <div className="logo-section">
//                 {/* Logo from the UI design */}
//                 <span className="careersync-logo">CAREERSYNC</span> 
//             </div>

//             <form onSubmit={handleSubmit} className="login-form">
//                 <div className="form-group">
//                     <label htmlFor="email">Email Address *</label>
//                     <input
//                         type="email"
//                         id="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="form-control"
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="password">Password *</label>
//                     <input
//                         type="password"
//                         id="password"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="form-control"
//                     />
//                 </div>

//                 <div className="form-group remember-me">
//                     <input type="checkbox" id="remember" />
//                     <label htmlFor="remember">Remember me</label>
//                 </div>

//                 {error && <div className="error-message">{error}</div>}

//                 <button type="submit" disabled={loading} className="btn-sign-in">
//                     {loading ? 'Signing In...' : 'Sign In'}
//                 </button>
//             </form>
//         </div>
//         {/* Footer content from the UI design would go here */}
//     </div>
//   );
// };

// export default AdminLogin;



// import React, { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Navigate } from 'react-router-dom';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const { login, isAuthenticated, role } = useAuth();

//   // Redirect if already logged in as admin
//   if (isAuthenticated && role === 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // Optional: Redirect non-admins if somehow they land here
//   if (isAuthenticated && role !== 'admin') {
//     return <Navigate to="/" replace />;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await login(email, password);
//       // Success: useAuth context will handle role check and redirect
//     } catch (err) {
//       setError(err.message || 'Invalid credentials. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-md-6 col-lg-5 col-xl-4">
//             <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
//               {/* Optional Header with Logo */}
//               <div className="card-header bg-primary text-white text-center py-4">
//                 <h3 className="mb-0 fw-bold">CAREERSYNC</h3>
//                 <small className="opacity-75">Admin Portal</small>
//               </div>

//               <div className="card-body p-4 p-md-5">
//                 <h4 className="text-center mb-4 fw-semibold text-dark">Sign In</h4>

//                 {error && (
//                   <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                     <small>{error}</small>
//                     <button
//                       type="button"
//                       className="btn-close btn-close-sm"
//                       onClick={() => setError(null)}
//                     ></button>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label htmlFor="email" className="form-label fw-medium">
//                       Email Address <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       className="form-control form-control-lg"
//                       placeholder="admin@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       autoFocus
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="password" className="form-label fw-medium">
//                       Password <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="password"
//                       id="password"
//                       className="form-control form-control-lg"
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="remember"
//                       />
//                       <label className="form-check-label text-muted" htmlFor="remember">
//                         Remember me
//                       </label>
//                     </div>
//                     <a href="#" className="text-decoration-none small text-primary">
//                       Forgot password?
//                     </a>
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn btn-primary btn-lg w-100 fw-semibold rounded-3 shadow-sm"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Signing In...
//                       </>
//                     ) : (
//                       'Sign In'
//                     )}
//                   </button>
//                 </form>

//                 <div className="text-center mt-4">
//                   <small className="text-muted">
//                     © 2025 CareerSync. All rights reserved.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;






// import React, { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Navigate } from 'react-router-dom';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const { login, isAuthenticated, role, loading } = useAuth();

//   if (!loading && isAuthenticated && role === 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSubmitting(true);

//     try {
//       await login(email, password);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     // 👇 keep your UI as-is, only button uses submitting
//     <form onSubmit={handleSubmit}>
//       {/* UI unchanged */}
//       <button disabled={submitting}>
//         {submitting ? 'Signing in…' : 'Sign In'}
//       </button>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };

// export default AdminLogin;




import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false); // ✅ Remember me
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, role, loading } = useAuth();

  if (!loading && isAuthenticated && role === 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);

    try {
      const user = await login(email, password, remember); // Pass remember flag if needed
      if (user.role_name !== 'admin') {
        setError('You do not have admin access.');
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        {/* --- Logo Section --- */}
        <div className="text-center mb-4">
          <img
            src="/assets/images/logo.png" // replace with your logo path
            alt="CAREERSYNC Logo"
            style={{ width: '150px', height: 'auto' }}
          />
        </div>

        <h3 className="text-center mb-3">Admin Portal</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          {/* --- Remember Me --- */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
