import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import Swal from 'sweetalert2'; // ✅ Import SweetAlert

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;

    const verifyEmail = async () => {
      const token = searchParams.get('token');
      effectRan.current = true;

      if (!token) {
        setStatus('error');
        Swal.fire({
            icon: 'error',
            title: 'Invalid Link',
            text: 'This verification link is invalid or missing.',
        });
        return;
      }

      try {
        // ហៅទៅ Backend
        const res = await api.get(`/auth/verify-email?token=${token}`);
        const { role_name, accessToken } = res.data;

        setStatus('success');

        // ===========================================
        // 🔥 LOGIC: ADMIN & USER -> AUTO LOGIN
        // ===========================================
        
        if ((role_name === 'admin' || role_name === 'user') && accessToken) {
            
            // 1. Save Token (Auto Login)
            localStorage.setItem('accessToken', accessToken);
            
            // 2. Show Success Alert
            Swal.fire({
                icon: 'success',
                title: 'Email Verified!',
                text: `Welcome back, ${role_name === 'admin' ? 'Admin' : 'User'}! Logging you in...`,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // 3. Redirect to Dashboard / Home
                window.location.href = '/'; 
            });

        } else if (role_name === 'mentor') {
            // ===========================================
            // 🚫 MENTOR -> PENDING APPROVAL (NO LOGIN)
            // ===========================================
            Swal.fire({
                icon: 'info',
                title: 'Email Verified',
                text: 'Your email is verified! However, your account is pending Admin approval. You will be notified once approved.',
                confirmButtonText: 'Go to Login'
            }).then(() => {
                navigate('/login');
            });

        } else {
            // Fallback (ករណីផ្សេងៗ)
            navigate('/login');
        }

      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || 'Verification failed';
        
        setStatus('error');

        // Check if already verified
        if (errorMsg.includes('already verified') || error.response?.status === 400) {
             Swal.fire({
                icon: 'info',
                title: 'Already Verified',
                text: 'Your email is already verified. Please login.',
                confirmButtonText: 'Login Now'
             }).then(() => navigate('/login'));
        } else {
             Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: errorMsg,
             });
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      
      <div className="card p-5 shadow-lg text-center" style={{ maxWidth: '500px', borderRadius: '15px' }}>
          
          {status === 'verifying' && (
            <>
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
              <h3 className="fw-bold">Verifying Email...</h3>
              <p className="text-muted">Please wait while we secure your account.</p>
            </>
          )}

          {/* Success និង Error នឹងបង្ហាញតាមរយៈ Swal ប៉ុន្តែយើងទុក UI នេះជា Background */}
          {status === 'success' && (
             <div className="text-success">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
                <h3 className="mt-3">Verified!</h3>
             </div>
          )}

          {status === 'error' && (
             <div className="text-danger">
                <i className="bi bi-x-circle-fill" style={{ fontSize: '4rem' }}></i>
                <h3 className="mt-3">Failed</h3>
             </div>
          )}
      </div>
    </div>
  );
};

export default VerifyEmail;