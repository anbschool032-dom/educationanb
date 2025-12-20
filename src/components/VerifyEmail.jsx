// // src/pages/VerifyEmail.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import api from '../api/axiosConfig';

// const VerifyEmail = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState('verifying'); // verifying, success, error
//   const [message, setMessage] = useState('Verifying your email...');

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const token = searchParams.get('token');
//       const role = searchParams.get('role');

//       if (!token) {
//         setStatus('error');
//         setMessage('Invalid verification link');
//         return;
//       }

//       try {
//         const res = await api.get(`/auth/verify-email?token=${token}&role=${role}`);
//         setStatus('success');
//         setMessage(res.data.message || 'Email verified successfully!');
        
//         // Redirect to login after 3 seconds
//         setTimeout(() => {
//           navigate('/login');
//         }, 3000);
        
//       } catch (error) {
//         setStatus('error');
//         setMessage(error.response?.data?.message || 'Verification failed');
//       }
//     };

//     verifyEmail();
//   }, [searchParams, navigate]);

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center"
//          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
//       <div className="card p-5 shadow-lg" style={{ maxWidth: '500px', borderRadius: '15px' }}>
//         <div className="text-center">
//           {status === 'verifying' && (
//             <>
//               <div className="spinner-border text-primary mb-3" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <h3 className="mb-3">Verifying Email...</h3>
//               <p className="text-muted">Please wait while we verify your email address.</p>
//             </>
//           )}

//           {status === 'success' && (
//             <>
//               <div className="text-success mb-3">
//                 <i className="bi bi-check-circle-fill" style={{ fontSize: '64px' }}></i>
//               </div>
//               <h3 className="mb-3 text-success">Success!</h3>
//               <p className="text-dark">{message}</p>
//               <p className="text-muted">Redirecting to login page...</p>
//             </>
//           )}

//           {status === 'error' && (
//             <>
//               <div className="text-danger mb-3">
//                 <i className="bi bi-x-circle-fill" style={{ fontSize: '64px' }}></i>
//               </div>
//               <h3 className="mb-3 text-danger">Verification Failed</h3>
//               <p className="text-dark">{message}</p>
//               <button 
//                 className="btn btn-primary mt-3"
//                 onClick={() => navigate('/login')}
//               >
//                 Go to Login
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;



// src/pages/VerifyEmail.jsx
import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('Verifying your email...');
  
  // 1. Create a ref to track if we have already called the API
  const effectRan = useRef(false);

  useEffect(() => {
    // 2. Check if the effect has already run
    if (effectRan.current === true) {
        return; 
    }

    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const role = searchParams.get('role');

      // 3. Mark as run so it doesn't run again
      effectRan.current = true; 

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}&role=${role}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
      } catch (error) {
        // Optional: If the error says "User already verified", treat it as success
        if (error.response?.data?.message?.includes("already verified")) {
             setStatus('success');
             setMessage('Email already verified. Redirecting...');
             setTimeout(() => navigate('/login'), 3000);
        } else {
             setStatus('error');
             setMessage(error.response?.data?.message || 'Verification failed');
        }
      }
    };

    verifyEmail();
    
    // Cleanup function (optional, but good practice in some cases)
    return () => {
        // effectRan.current = true; // Usually not needed here for this specific fix
    };

  }, [searchParams, navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      <div className="card p-5 shadow-lg" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h3 className="mb-3">Verifying Email...</h3>
              <p className="text-muted">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-success mb-3">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '64px' }}></i>
              </div>
              <h3 className="mb-3 text-success">Success!</h3>
              <p className="text-dark">{message}</p>
              <p className="text-muted">Redirecting to login page...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-danger mb-3">
                <i className="bi bi-x-circle-fill" style={{ fontSize: '64px' }}></i>
              </div>
              <h3 className="mb-3 text-danger">Verification Failed</h3>
              <p className="text-dark">{message}</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;