import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Import useNavigate
import api from '../api/axiosConfig'; 
import '../assets/css/components/header.css'; 

const Header = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);
  const navigate = useNavigate(); // ✅ 2. ប្រើសម្រាប់ចុចទៅ Page ផ្សេង

  // Fetch User Data
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        if (user?.id) {
          // បើ route /auth/me មិនដើរ សូមប្តូរទៅ route ដែលបងមាន
          const res = await api.get('/auth/me'); 
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching header profile:", err);
      }
    };
    if (user) fetchLatestProfile();
  }, [user]);

  // Setup Image URLs
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const API_IMG_URL = API_BASE_URL.replace('/api/v1', '');

  const fullName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
    : 'Admin User';

  const profileSrc = currentUser?.profile_image 
    ? `${API_IMG_URL}/uploads/profiles/${currentUser.profile_image}`
    : null;

  const fallbackSrc = `https://ui-avatars.com/api/?name=${fullName}&background=4f46e5&color=fff&size=128&bold=true`;

  return (
    <header className="admin-header">
      {/* ផ្នែកខាងឆ្វេង: Welcome Text */}
      <div className="header-title">
        <span className="text-muted">Welcome back,</span> <br className="d-md-none" />
        <strong>{fullName}</strong> 👋
      </div>
      
      {/* ផ្នែកខាងស្តាំ: Controls & Profile */}
      <div className="header-controls">
        
        {/* ==================================================== */}
        {/* 🔥 3. ដាក់ ICON NOTIFICATION នៅទីនេះផ្ទាល់តែម្ដង!    */}
        {/* ==================================================== */}
        <div 
          className="position-relative d-inline-block me-4" 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/notifications')} // ចុចទៅបើក Page (បើមាន)
        >
          {/* រូបកណ្ដឹង */}
          <i className="bi bi-bell" style={{ fontSize: '1.5rem', color: '#64748b' }}></i>
          
          {/* ចំណុចក្រហម (Static Badge) - បង្ហាញថាលម្អ */}
          <span 
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ width: '10px', height: '10px' }}
          ></span>
        </div>
        {/* ==================================================== */}


        {/* Profile Section */}
        <div className="profile-container">
          <div className="profile-info d-none d-md-flex">
            <span className="profile-name">{currentUser?.first_name || 'Admin'}</span>
            <span className="profile-role">{currentUser?.role_name || 'Administrator'}</span>
          </div>

          <div className="profile-img-wrapper">
            <img 
              src={profileSrc || fallbackSrc} 
              alt="Profile" 
              className="profile-avatar"
              onError={(e) => {
                if (e.target.src !== fallbackSrc) {
                    e.target.src = fallbackSrc;
                }
              }} 
            />
            <span className="status-indicator"></span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;