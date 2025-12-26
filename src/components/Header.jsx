import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/axiosConfig'; 
import '../assets/css/components/header.css'; 

const Header = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);
  const navigate = useNavigate();

  // Fetch User Data
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        if (user?.id) {
          const res = await api.get('/auth/me'); 
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching header profile:", err);
      }
    };
    if (user) fetchLatestProfile();
  }, [user]);

  // =========================================================
  // ✅ FIX: MIXED CONTENT ERROR
  // ដាក់ទទេ ('') ដើម្បីឱ្យ Browser ប្រើ Domain បច្ចុប្បន្ន (HTTPS) ស្វ័យប្រវត្តិ
  // =========================================================
  const API_IMG_URL = '';

  const fullName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
    : 'Admin User';

  // ពេលនេះ Link នឹងចេញជា: "/uploads/profiles/..." (Relative Path) -> ដើរគ្រប់កន្លែង!
  const profileSrc = currentUser?.profile_image 
    ? `${API_IMG_URL}/uploads/profiles/${currentUser.profile_image}`
    : null;

  const fallbackSrc = `https://ui-avatars.com/api/?name=${fullName}&background=4f46e5&color=fff&size=128&bold=true`;

  return (
    <header className="admin-header">
      <div className="header-title">
        <span className="text-muted">Welcome back,</span> <br className="d-md-none" />
        <strong>{fullName}</strong> 👋
      </div>
      
      <div className="header-controls">
        {/* Notification Icon */}
        <div 
          className="position-relative d-inline-block me-4" 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/notifications')} 
        >
          <i className="bi bi-bell" style={{ fontSize: '1.5rem', color: '#64748b' }}></i>
          <span 
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ width: '10px', height: '10px' }}
          ></span>
        </div>

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