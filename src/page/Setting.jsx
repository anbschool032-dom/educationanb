// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import '../assets/css/components/settings.css'; // Updated CSS below

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    profile_image: null,
    previewImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

const API_IMG_URL = 'http://localhost:3000'; 

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      
      setProfileData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        
        // 2. COMBINE THEM: Server URL + Folder Path + Filename
        previewImage: data.profile_image 
          ? `${API_IMG_URL}/uploads/profiles/${data.profile_image}` 
          : null, // or a placeholder image URL
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };
  fetchProfile();
}, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profile_image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('phone', profileData.phone);
    if (profileData.profile_image) formData.append('profile_image', profileData.profile_image);

    try {
      await api.put('/admin/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'danger' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to change password', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: user?.email });
      setMessage({ text: 'Reset link sent! Check your email.', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to send reset link', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page container py-4">
      <div className="settings-header mb-5">
        <h2 className="fw-bold">Settings</h2>
        <p className="text-muted">Manage your account, security, and preferences</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills mb-5 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle me-2"></i> Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="bi bi-shield-lock me-2"></i> Security
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="bi bi-sliders me-2"></i> Preferences
          </button>
        </li>
      </ul>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <h5 className="card-title mb-4">Profile Information</h5>
            <p className="text-muted mb-5">Update your personal details and profile picture</p>

            <div className="text-center mb-5">
              <div className="profile-pic-wrapper mx-auto position-relative d-inline-block">
                <img
                  src={profileData.previewImage || 'https://via.placeholder.com/150?text=Admin'}
                  alt="Profile"
                  className="profile-pic rounded-circle"
                />
                <label htmlFor="upload" className="upload-overlay">
                  <i className="bi bi-camera-fill"></i>
                </label>
                <input type="file" id="upload" accept="image/*" onChange={handleImageChange} hidden />
              </div>
              <p className="text-muted small mt-2">Click to change picture</p>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email (cannot be changed)</label>
                  <input type="email" className="form-control" value={user?.email || ''} disabled />
                </div>
              </div>

              <div className="text-end mt-5">
                <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <h5 className="card-title mb-4">Change Password</h5>
            <p className="text-muted mb-5">Keep your account secure with a strong password</p>

            <form onSubmit={handlePasswordUpdate} className="max-w-500">
              <div className="mb-4">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
              </div>
              <div className="mb-5">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
              </div>

              <button type="submit" className="btn btn-primary me-4" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <button type="button" className="btn btn-link text-decoration-none" onClick={handleForgotPassword} disabled={loading}>
                Forgot your password?
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <h5 className="card-title mb-4">Preferences</h5>

            <div className="setting-row">
              <div>
                <h6>Dark Mode</h6>
                <p className="text-muted small">Switch to dark theme (coming soon)</p>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </div>
            </div>

            <div className="setting-row">
              <div>
                <h6>Email Notifications</h6>
                <p className="text-muted small">Get updates on new mentors, bookings, etc.</p>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
              </div>
            </div>

            <hr className="my-5" />

            <div>
              <h6 className="text-danger">Danger Zone</h6>
              <p className="text-muted small mb-3">This will log you out from all devices</p>
              <button className="btn btn-outline-danger" onClick={() => window.confirm('Log out everywhere?') && logout()}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout All Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;