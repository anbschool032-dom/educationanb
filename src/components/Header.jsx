import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();
console.log("User Data in Header:", user);
  // 1. Get the name safely
  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Admin';

  // 2. Construct Image URL
  // Matches your backend server port (3000)
  const API_URL = 'http://localhost:3000'; 
  
  const profileImageUrl = user?.profile_image
    ? `${API_URL}/uploads/profiles/${user.profile_image}`
    : null;

  return (
    <header className="admin-header">
      <div className="header-title">
        {/* You can add a greeting based on time of day if you want */}
        Welcome, {fullName}
      </div>
      
      <div className="header-controls">
        <button className="btn-icon" title="Notifications">
          🔔
        </button>

        <div className="profile-badge" title="Profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* IMAGE LOGIC */}
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt="Profile" 
              className="profile-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none'; // Hide broken image
                e.target.nextSibling.style.display = 'block'; // Show fallback
              }}
            />
          ) : null}

          {/* FALLBACK ICON (Hidden if image exists) */}
          <div 
            className="profile-fallback-icon"
            style={{ 
              display: profileImageUrl ? 'none' : 'flex',
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#ddd', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            👤
          </div>

          <span className="role-badge">
            {user?.role_name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;