// src/pages/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import '../assets/css/components/createuser.css';

const CreateUser = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [industries, setIndustries] = useState([]);
  const [position, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form data for different roles
  const [formData, setFormData] = useState({
    // Common fields (Users table)
    email: '',
    password: '',
    
    // Admin fields
    admin_first_name: '',
    admin_last_name: '',
    admin_phone: '',
    admin_profile_image: null,
    
    // Acc_User fields
    user_first_name: '',
    user_last_name: '',
    user_phone: '',
    user_gender: '',
    user_dob: '',
    user_types: '',
    user_institution_name: '',
    user_profile_image: null,
    
    // Mentor fields
    mentor_first_name: '',
    mentor_last_name: '',
    mentor_gender: '',
    mentor_dob: '',
    mentor_phone: '',
    mentor_position_id: '',
    mentor_industry_id: '',
    mentor_job_title: '',
    mentor_expertise_areas: '',
    mentor_experience_years: '',
    mentor_company_name: '',
    mentor_social_media: '',
    mentor_about_mentor: '',
    mentor_profile_image: null,
    
    // Education (for mentor)
    education: [{
      university_name: '',
      degree_name: '',
      field_of_study: '',
      year_graduated: '',
      grade_gpa: '',
      activities: ''
    }]
  });

  // Fetch industries and position for mentor
  useEffect(() => {
    if (selectedRole === 'mentor') {
      fetchIndustries();
    }
  }, [selectedRole]);

  const fetchIndustries = async () => {
    try {
      // const response = await api.get('/industries');
       const response = await api.get('/admin/industry');
      setIndustries(response.data);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const fetchPositions = async (industryId) => {
    try {
      const response = await api.get(`/admin/position?industry_id=${industryId}`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching position:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // // Fetch position when industry changes
    // if (name === 'mentor_industry_id' && value) {
    //   fetchPositions(value);
    // }
      if (name === 'mentor_industry_id' && value) {
    fetchPositions(value);
    setFormData(prev => ({ ...prev, mentor_position_id: '' }));
      }

  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
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
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role_name', selectedRole);

      // Add role-specific data
          if (selectedRole === 'admin') {
            submitData.append('first_name', formData.admin_first_name);
            submitData.append('last_name', formData.admin_last_name);
            submitData.append('phone', formData.admin_phone);
            if (formData.admin_profile_image) {
              submitData.append('profile_image', formData.admin_profile_image);
            }
        }else if (selectedRole === 'user') {
        submitData.append('first_name', formData.user_first_name);
        submitData.append('last_name', formData.user_last_name);  
        submitData.append('phone', formData.user_phone);
        submitData.append('gender', formData.user_gender);
        submitData.append('dob', formData.user_dob);  
        submitData.append('types_user', formData.user_types);
        submitData.append('institution_name', formData.user_institution_name);
        if (formData.user_profile_image) {
          submitData.append('profile_image', formData.user_profile_image);
        }
      } else if (selectedRole === 'mentor') { 
        submitData.append('first_name', formData.mentor_first_name);
        submitData.append('last_name', formData.mentor_last_name);
        submitData.append('gender', formData.mentor_gender);
        submitData.append('dob', formData.mentor_dob);
        submitData.append('phone', formData.mentor_phone);
        submitData.append('position_id', formData.mentor_position_id);
        submitData.append('industry_id', formData.mentor_industry_id);
        submitData.append('job_title', formData.mentor_job_title);
        submitData.append('expertise_areas', formData.mentor_expertise_areas);
        submitData.append('experience_years', formData.mentor_experience_years);
        submitData.append('company_name', formData.mentor_company_name);
        submitData.append('social_media', formData.mentor_social_media);
        submitData.append('about_mentor', formData.mentor_about_mentor);
        submitData.append('education', JSON.stringify(formData.education));
        if (formData.mentor_profile_image) {
          submitData.append('profile_image', formData.mentor_profile_image);
        }
      }

      const response = await api.post('/admin/create-user', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('User created successfully!');
      // Reset form or redirect
      // window.location.href = 'admin/user-management';
      // window.location.href = '/user-management';
        if (selectedRole === 'mentor') {
          window.location.href = '/mentor-approval';
        } else {
          window.location.href = '/user-management';
        }

    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + (error.response?.data?.message || error.message));
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
            <span>User</span>
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

      {/* Form based on selected role */}
      {selectedRole && (
        <form onSubmit={handleSubmit} className="user-form-card">
          {/* Common Account Information */}
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
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Admin Fields */}
          {selectedRole === 'admin' && (
            <div className="form-section">
              <h3>Admin Information</h3>
             <div className="form-row">
  <div className="form-group">
    <label>First Name</label>
    <input
      type="text"
      name="admin_first_name"           // <-- change here
      value={formData.admin_first_name}
      onChange={handleInputChange}
      placeholder="First Name"
    />
  </div>
  <div className="form-group">
    <label>Last Name</label>
    <input
      type="text"
      name="admin_last_name"            // <-- change here
      value={formData.admin_last_name}
      onChange={handleInputChange}
      placeholder="Last Name"
    />
  </div>
  <div className="form-group">
    <label>Phone Number</label>
    <input
      type="tel"
      name="admin_phone"
      value={formData.admin_phone}
      onChange={handleInputChange}
      placeholder="+1 (555) 000-0000"
    />
  </div>
</div>
<div className="form-group">
  <label>Profile Image</label>
  <input
    type="file"
    name="admin_profile_image"
    onChange={handleFileChange}
    accept="image/*"
  />
</div>

            </div>
          )}

          {/* User Fields */}
          {selectedRole === 'user' && (
            <>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="user_first_name"
                      value={formData.user_first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="user_last_name"
                      value={formData.user_last_name}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="user_phone"
                      value={formData.user_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="user_dob"
                      value={formData.user_dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender <span className="required">*</span></label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="user_gender"
                          value="male"
                          checked={formData.user_gender === 'male'}
                          onChange={handleInputChange}
                          required
                        />
                        Male
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="user_gender"
                          value="female"
                          checked={formData.user_gender === 'female'}
                          onChange={handleInputChange}
                          required
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Current Status <span className="required">*</span></label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="user_types"
                          value="student"
                          checked={formData.user_types === 'student'}
                          onChange={handleInputChange}
                          required
                        />
                        Student
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="user_types"
                          value="working"
                          checked={formData.user_types === 'working'}
                          onChange={handleInputChange}
                          required
                        />
                        Working
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Institution Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="user_institution_name"
                    value={formData.user_institution_name}
                    onChange={handleInputChange}
                    placeholder="Enter school/company name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image <span className="required">*</span></label>
                  <input
                    type="file"
                    name="user_profile_image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Mentor Fields */}
          {selectedRole === 'mentor' && (
            <>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="mentor_first_name"
                      value={formData.mentor_first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="mentor_last_name"
                      value={formData.mentor_last_name}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="mentor_phone"
                      value={formData.mentor_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="mentor_dob"
                      value={formData.mentor_dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Gender <span className="required">*</span></label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="mentor_gender"
                        value="male"
                        checked={formData.mentor_gender === 'male'}
                        onChange={handleInputChange}
                        required
                      />
                      Male
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="mentor_gender"
                        value="female"
                        checked={formData.mentor_gender === 'female'}
                        onChange={handleInputChange}
                        required
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Industry <span className="required">*</span></label>
                    <select
                      name="mentor_industry_id"
                      value={formData.mentor_industry_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose Industry</option>
                      {industries.map(industry => (
                        <option key={industry.id} value={industry.id}>
                          {industry.industry_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Position <span className="required">*</span></label>
                    <select
                      name="mentor_position_id"
                      value={formData.mentor_position_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.mentor_industry_id}
                    >
                      <option value="">Choose Position</option>
                      {position.map(position => (
                        <option key={position.id} value={position.id}>
                          {position.position_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title <span className="required">*</span></label>
                    <input
                      type="text"
                      name="mentor_job_title"
                      value={formData.mentor_job_title}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Developer"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="mentor_experience_years"
                      value={formData.mentor_experience_years}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="mentor_company_name"
                      value={formData.mentor_company_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Google, Freelance"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="url"
                      name="mentor_social_media"
                      value={formData.mentor_social_media}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Expertise Areas</label>
                  <input
                    type="text"
                    name="mentor_expertise_areas"
                    value={formData.mentor_expertise_areas}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Development, AI"
                  />
                </div>
                <div className="form-group">
                  <label>About You</label>
                  <textarea
                    name="mentor_about_mentor"
                    value={formData.mentor_about_mentor}
                    onChange={handleInputChange}
                    placeholder="Tell mentees about your background, experience, and what you can help them with..."
                    rows="5"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    name="mentor_profile_image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="education-entry">
                    <div className="education-header">
                      <h4>Degree {index + 1}</h4>
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>University Name</label>
                        <input
                          type="text"
                          value={edu.university_name}
                          onChange={(e) => handleEducationChange(index, 'university_name', e.target.value)}
                          placeholder="Stanford University"
                        />
                      </div>
                      <div className="form-group">
                        <label>Degree Name</label>
                        <input
                          type="text"
                          value={edu.degree_name}
                          onChange={(e) => handleEducationChange(index, 'degree_name', e.target.value)}
                          placeholder="B.S."
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Field of Study</label>
                        <input
                          type="text"
                          value={edu.field_of_study}
                          onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year Graduated</label>
                        <input
                          type="number"
                          value={edu.year_graduated}
                          onChange={(e) => handleEducationChange(index, 'year_graduated', e.target.value)}
                          placeholder="2020"
                          min="1950"
                          max="2030"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>GPA</label>
                        <input
                          type="text"
                          value={edu.grade_gpa}
                          onChange={(e) => handleEducationChange(index, 'grade_gpa', e.target.value)}
                          placeholder="3.8"
                        />
                      </div>
                      <div className="form-group">
                        <label>Activities</label>
                        <input
                          type="text"
                          value={edu.activities}
                          onChange={(e) => handleEducationChange(index, 'activities', e.target.value)}
                          placeholder="Clubs, organizations, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEducation} className="btn-add">
                  + Add Another Degree
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateUser;