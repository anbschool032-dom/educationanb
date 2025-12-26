import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import '../assets/css/components/settings.css';
import Swal from 'sweetalert2'; 

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // =========================================================
  // ✅ FIX: MIXED CONTENT ERROR (ដាក់ដូច Header ដែរ)
  // =========================================================
  const API_IMG_URL = '';
  
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      
      setProfileData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        // ✅ Link នឹងចេញជា Relative Path (ដើរ ១០០%)
        previewImage: data.profile_image 
          ? `${API_IMG_URL}/uploads/profiles/${data.profile_image}` 
          : null,
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
        if (value && !/^[0-9]*$/.test(value)) return;
    }
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('phone', profileData.phone);
    if (profileData.profile_image) formData.append('profile_image', profileData.profile_image);

    try {
      await api.put('/admin/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your information has been updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      fetchProfile();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Something went wrong.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Warning', 'Passwords do not match!', 'warning');
      return;
    }
    if (passwordData.newPassword.length < 8) {
        Swal.fire('Warning', 'New password must be at least 8 characters.', 'warning');
        return;
    }

    setLoading(true);
    try {
      await api.post('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      Swal.fire('Success', 'Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: user?.email });
      Swal.fire('Sent!', 'Reset link sent! Check your email.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from all devices.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            logout();
        }
    })
  };

  return (
    <div className="settings-page container py-4">
      <div className="settings-header mb-5">
        <h2 className="fw-bold">Settings</h2>
        <p className="text-muted">Manage your account, security, and preferences</p>
      </div>

      <ul className="nav nav-pills mb-5 justify-content-center">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <i className="bi bi-person-circle me-2"></i> Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <i className="bi bi-shield-lock me-2"></i> Security
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>
            <i className="bi bi-sliders me-2"></i> Preferences
          </button>
        </li>
      </ul>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <h5 className="card-title mb-4">Profile Information</h5>
            <div className="text-center mb-5">
              <div className="profile-pic-wrapper mx-auto position-relative d-inline-block">
                <img
                  src={
                    profileData.previewImage || 
                    `https://ui-avatars.com/api/?name=${profileData.first_name}+${profileData.last_name}&background=random&color=fff&size=150`
                  }
                  alt="Profile"
                  className="profile-pic rounded-circle shadow-sm"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://ui-avatars.com/api/?name=${profileData.first_name || 'User'}+${profileData.last_name || ''}&background=random&color=fff&size=150`;
                  }}
                />
                <label htmlFor="upload" className="upload-overlay">
                  <i className="bi bi-camera-fill"></i>
                </label>
                <input type="file" id="upload" accept="image/*" onChange={handleImageChange} hidden />
              </div>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" name="first_name" value={profileData.first_name} onChange={handleProfileInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" name="last_name" value={profileData.last_name} onChange={handleProfileInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" name="phone" value={profileData.phone} onChange={handleProfileInputChange} maxLength="15" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email (ReadOnly)</label>
                  <input type="email" className="form-control bg-light" value={user?.email || ''} disabled />
                </div>
              </div>
              <div className="text-end mt-5">
                <button type="submit" className="btn btn-primary px-5" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Change Password</h5>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <><i className="bi bi-eye-slash"></i> Hide</> : <><i className="bi bi-eye"></i> Show</>}
                </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="max-w-500">
              <div className="mb-4">
                <label className="form-label">Current Password</label>
                <input type={showPassword ? "text" : "password"} className="form-control" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label">New Password</label>
                <input type={showPassword ? "text" : "password"} className="form-control" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength="8" />
              </div>
              <div className="mb-5">
                <label className="form-label">Confirm New Password</label>
                <input type={showPassword ? "text" : "password"} className="form-control" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
                <button type="button" className="btn btn-link text-decoration-none text-muted" onClick={handleForgotPassword} disabled={loading}>Forgot password?</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <h5 className="card-title mb-4">Preferences</h5>
            <div className="setting-row d-flex justify-content-between align-items-center mb-4">
              <div><h6 className="mb-1">Dark Mode</h6></div>
              <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} /></div>
            </div>
            <div className="setting-row d-flex justify-content-between align-items-center mb-4">
              <div><h6 className="mb-1">Email Notifications</h6></div>
              <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} /></div>
            </div>
            <hr className="my-5" />
            <div>
              <h6 className="text-danger fw-bold">Danger Zone</h6>
              <button className="btn btn-outline-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i> Logout All Devices</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;