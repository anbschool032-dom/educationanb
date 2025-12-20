// src/pages/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import '../assets/css/components/createuser.css';
import Swal from "sweetalert2";

const CreateUser = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [industries, setIndustries] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: '',
    dob: '',
    types_user: '',
    institution_name: '',
    position_id: '',
    industry_id: '',
    job_title: '',
    expertise_areas: '',
    experience_years: '',
    company_name: '',
    social_media: '',
    about_mentor: '',
    profile_image: null,
    education: [{
      university_name: '',
      degree_name: '',
      field_of_study: '',
      year_graduated: '',
      grade_gpa: '',
      activities: ''
    }]
  });

  useEffect(() => {
    if (selectedRole === 'mentor') {
      fetchIndustries();
    } else {
      setIndustries([]);
      setPositions([]);
    }
  }, [selectedRole]);

  const fetchIndustries = async () => {
    try {
      const response = await api.get('/admin/industry');
      setIndustries(response.data);
    } catch (error) {
      console.error('Error fetching industries:', error);
      alert('Failed to load industries');
    }
  };

  const fetchPositions = async (industryId) => {
    if (!industryId) {
      setPositions([]);
      return;
    }
    try {
      const response = await api.get(`/admin/position?industry_id=${industryId}`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'industry_id' && value) {
      fetchPositions(value);
      setFormData(prev => ({ ...prev, position_id: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profile_image: e.target.files[0]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = field === 'grade_gpa' ? parseFloat(value) || null : value;
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        university_name: '',
        degree_name: '',
        field_of_study: '',
        year_graduated: '',
        grade_gpa: '',
        activities: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate first name
    if (!formData.first_name.trim() || /\d/.test(formData.first_name)) {
      alert('First name is required and cannot contain numbers');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role_name', selectedRole);

      // Common fields
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('phone', formData.phone || '');

      // Role-specific
      if (selectedRole === 'user') {
        submitData.append('gender', formData.gender);
        submitData.append('dob', formData.dob);
        submitData.append('types_user', formData.types_user);
        submitData.append('institution_name', formData.institution_name);


        
      } else if (selectedRole === 'mentor') {
        submitData.append('gender', formData.gender);
        submitData.append('dob', formData.dob);
        submitData.append('position_id', formData.position_id);
        submitData.append('industry_id', formData.industry_id);
        submitData.append('job_title', formData.job_title || '');
        submitData.append('expertise_areas', formData.expertise_areas);
        submitData.append('experience_years', formData.experience_years);
        submitData.append('company_name', formData.company_name);
        submitData.append('social_media', formData.social_media);
        submitData.append('about_mentor', formData.about_mentor);
        submitData.append('education', JSON.stringify(formData.education));
      }
      // Admin has only common fields + profile_image

      if (formData.profile_image) {
        submitData.append('profile_image', formData.profile_image);
      }

      await api.post('/admin/create-user', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // alert(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} created successfully!`);
      Swal.fire({
      icon: "success",
      title: "Success!",
      text: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} created successfully!`,
      confirmButtonColor: "#4F46E5"
    });

      
      // Redirect
      if (selectedRole === 'mentor') {
        window.location.href = '/mentor-approval';
      } else {
        window.location.href = '/user-management';
      }

    } catch (error) {
      console.error(error);
          Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.response?.data?.message || "Failed to create user",
        confirmButtonColor: "#EF4444"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      <div className="create-user-header">
        <h2>Create New Account</h2>
        <p>Select role and fill in the required information</p>
      </div>

      {/* Role Selection */}
      <div className="role-selection-card">
        <h3>Select User Role</h3>
        <div className="role-buttons">
          <button
            type="button"
            className={`role-btn ${selectedRole === 'user' ? 'active' : ''}`}
            onClick={() => setSelectedRole('user')}
          >
            <span className="role-icon">👤</span>
            <span>User (Student)</span>
          </button>
          <button
            type="button"
            className={`role-btn ${selectedRole === 'mentor' ? 'active' : ''}`}
            onClick={() => setSelectedRole('mentor')}
          >
            <span className="role-icon">🧑‍🏫</span>
            <span>Mentor</span>
          </button>
          <button
            type="button"
            className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            <span className="role-icon">⚙️</span>
            <span>Admin</span>
          </button>
        </div>
      </div>

      {selectedRole && (
        <form onSubmit={handleSubmit} className="user-form-card">
          {/* Account Info */}
          <div className="form-section">
            <h3>Account Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@domain.com"
                />
              </div>
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                />
              </div>
            </div>
          </div>

          {/* Personal Info – All Roles */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {(selectedRole === 'user' || selectedRole === 'mentor') && (
                <>
                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender <span className="required">*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* User Specific */}
          {selectedRole === 'user' && (
            <div className="form-section">
              <h3>Student Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Status <span className="required">*</span></label>
                  <select name="types_user" value={formData.types_user} onChange={handleInputChange} required>
                    <option value="">Select</option>
                    <option value="student">Student</option>
                    <option value="working">Working Professional</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Institution/Company Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mentor Specific */}
          {selectedRole === 'mentor' && (
            <>
              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Industry <span className="required">*</span></label>
                    <select name="industry_id" value={formData.industry_id} onChange={handleInputChange} required>
                      <option value="">Choose Industry</option>
                      {industries.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.industry_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Position <span className="required">*</span></label>
                    <select name="position_id" value={formData.position_id} onChange={handleInputChange} required disabled={!formData.industry_id}>
                      <option value="">Choose Position</option>
                      {positions.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.position_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Company</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn / Social</label>
                    <input
                      type="url"
                      name="social_media"
                      value={formData.social_media}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Expertise Areas</label>
                  <textarea
                    name="expertise_areas"
                    value={formData.expertise_areas}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="e.g. React, Node.js, System Design"
                  />
                </div>
                <div className="form-group">
                  <label>About You</label>
                  <textarea
                    name="about_mentor"
                    value={formData.about_mentor}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Tell students about your experience..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Education Background</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="education-block">
                    <div className="d-flex justify-content-between mb-2">
                      <h5>Education {index + 1}</h5>
                      {formData.education.length > 1 && (
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEducation(index)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>University</label>
                        <input type="text" value={edu.university_name} onChange={(e) => handleEducationChange(index, 'university_name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Degree</label>
                        <input type="text" value={edu.degree_name} onChange={(e) => handleEducationChange(index, 'degree_name', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Field of Study</label>
                        <input type="text" value={edu.field_of_study} onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Year Graduated</label>
                        <input type="number" value={edu.year_graduated} onChange={(e) => handleEducationChange(index, 'year_graduated', e.target.value)} min="1950" max="2030" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>GPA</label>
                        <input type="text" value={edu.grade_gpa} onChange={(e) => handleEducationChange(index, 'grade_gpa', e.target.value)} placeholder="e.g. 3.8" />
                      </div>
                      <div className="form-group">
                        <label>Activities/Clubs</label>
                        <input type="text" value={edu.activities} onChange={(e) => handleEducationChange(index, 'activities', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-primary mt-3" onClick={addEducation}>
                  + Add Another Education
                </button>
              </div>
            </>
          )}

          {/* Profile Image – All Roles */}
          <div className="form-section">
            <h3>Profile Image</h3>
            <div className="form-group">
              <input type="file" name="profile_image" onChange={handleFileChange} accept="image/*" />
              <small className="text-muted">Recommended: square image, max 2MB</small>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateUser;