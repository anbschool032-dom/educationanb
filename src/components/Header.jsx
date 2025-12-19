// import React from 'react';
// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//   const { user } = useAuth();
//   const fullName = user?.first_name
//     ? `${user.first_name} ${user.last_name || ''}`.trim()
//     : user?.email?.split('@')[0] || 'Admin'; // Better fallback if no name

//   return (
//     <header className="admin-header">
//       <div className="header-title">
//         Welcome, {fullName}
//       </div>
//       <div className="header-controls">
//         <button className="btn-icon" title="Notifications">
//           🔔
//         </button>
//         <div className="profile-badge" title="Admin Profile">
//           <span>👤</span>
//           <span style={{ marginLeft: '0.5rem' }}>
//             {user?.role_name || 'Admin'}
//           </span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email
    ? user.email.split('@')[0]
    : 'Admin';

  // This will now correctly use port 3000
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const profileImageUrl = user?.profile_image
    ? `${apiUrl}/uploads/profiles/${user.profile_image}`
    : null;

  return (
    <header className="admin-header">
      <div className="header-title">
        Welcome, {fullName}
      </div>
      <div className="header-controls">
        <button className="btn-icon" title="Notifications">
          🔔
        </button>

        <div className="profile-badge" title="Admin Profile">
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="profile-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          )}

          <span
            className="profile-fallback"
            style={{ display: profileImageUrl ? 'none' : 'flex' }}
          >
            👤
          </span>

          <span style={{ marginLeft: '0.8rem' }}>
            {user?.role_name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;