import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import Swal from "sweetalert2";
import '../assets/css/components/createuser.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Modal Logic
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ✅ យក User បច្ចុប្បន្ន (ដើម្បីការពារលុបខ្លួនឯង)
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // ✅ Logic សម្រាប់រូបភាព
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const API_IMG_URL = API_BASE_URL.replace('/api/v1', '');

  // --- HELPER FUNCTIONS (STYLE) ---

  // 1. Role Badge (ឱ្យចេញពណ៌តាម Role)
  const getRoleBadge = (role) => {
    const roleName = role ? role.toLowerCase() : 'user';
    return <span className={`user-role-badge ${roleName}`}>{role || 'User'}</span>;
  };

  // 2. Status Badge (កុំឱ្យចេញពណ៌សពេល Null)
  const getStatusBadge = (status) => {
    const statusClass = status ? status.toLowerCase() : 'unknown';
    const statusText = status || 'Unknown';
    return <span className={`user-status-badge ${statusClass}`}>{statusText}</span>;
  };

  // 1. Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Search Logic
  useEffect(() => {
    let result = users;
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(u => 
        (u.name && u.name.toLowerCase().includes(lowerSearch)) ||
        (u.email && u.email.toLowerCase().includes(lowerSearch)) ||
        (u.role_name && u.role_name.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [search, users]);

  // 3. DELETE (With IMPROVED ALERT) 🔥
  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/user/${userId}`);
          
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted successfully.",
            confirmButtonColor: "#4F46E5"
          });
          
          fetchUsers();
        } catch (error) {
          // 🔥 NEW: Professional Warning Alert (ជំនួស Error ក្រហម)
          Swal.fire({
            icon: "warning", // ប្រើ Warning ពណ៌លឿង
            title: "Action Restricted",
            text: error.response?.data?.message || "You don't have permission to delete this user.",
            confirmButtonText: "Understood",
            confirmButtonColor: "#4F46E5", // Indigo Color
            iconColor: "#F59E0B", // Amber Color
          });
        }
      }
    });
  };

  // 4. VIEW
  const handleView = async (id) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const response = await api.get(`/admin/user/${id}`);
      setSelectedUser(response.data);
    } catch (error) {
      Swal.fire("Error", "Could not fetch details", "error");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowsChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Exports
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(u => ({
      'Email': u.email, 'Name': u.name, 'Role': u.role_name, 'Status': u.status, 'Created By': u.created_by, 'Date': new Date(u.created_at).toLocaleDateString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "User_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("User Report", 14, 20);
    autoTable(doc, {
      head: [["#", "Email", "Name", "Role", "Created By", "Status"]],
      body: filteredUsers.map((u, i) => [i + 1, u.email, u.name, u.role_name, u.created_by, u.status]),
      startY: 30,
    });
    doc.save("User_Report.pdf");
  };

  // --- HELPER: GET CORRECT NAME ---
  const getFullName = (user) => {
    if (user.admin) return `${user.admin.first_name} ${user.admin.last_name}`;
    if (user.mentor) return `${user.mentor.first_name} ${user.mentor.last_name}`;
    if (user.accUser) return `${user.accUser.first_name} ${user.accUser.last_name}`;
    return 'Unknown User';
  };

  // --- HELPER: GET DYNAMIC TITLE ---
  const getModalTitle = (role) => {
    if (role === 'mentor') return 'Mentor Detail';
    if (role === 'admin') return 'Admin Detail';
    return 'Student Detail';
  };

  const renderProfileImage = (user) => {
    const imageName = user.admin?.profile_image || user.mentor?.profile_image || user.accUser?.profile_image;
    // ✅ Use API_IMG_URL
    const imageUrl = imageName ? `${API_IMG_URL}/uploads/profiles/${imageName}` : null;

    if (imageUrl) {
      return <img src={imageUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }} />;
    }
    return <div style={{width:'80px', height:'80px', borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'#cbd5e0'}}>👤</div>;
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div><h2>User Management</h2><p>Manage all users, mentors, and admins</p></div>
        <button className="user-create-button" onClick={() => navigate('/create-user')}><span>+</span> Create New User</button>
      </div>

      <div className="user-table-container" style={{ marginBottom: '20px', padding: '1.5rem' }}>
        <div className="filter-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
             <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Search Users</label>
             <input type="text" className="form-control" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
             <button onClick={exportToExcel} className="user-create-button" style={{background:'#10B981', boxShadow:'none'}}>Excel</button>
             <button onClick={exportToPDF} className="user-create-button" style={{background:'#EF4444', boxShadow:'none'}}>PDF</button>
          </div>
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead><tr><th>#</th><th>Email</th><th>Name</th><th>Role</th><th>Created By</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign:'center', padding:'3rem'}}>Loading...</td></tr> :
             currentItems.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  
                  {/* ✅ FIX 1: Role Badge */}
                  <td>{getRoleBadge(user.role_name)}</td>
                  
                  <td><span style={{color: user.created_by === '-' ? '#cbd5e0' : '#4a5568', fontWeight: 500}}>{user.created_by}</span></td>
                  
                  {/* ✅ FIX 2: Status Badge (Correct Color) */}
                  <td>{getStatusBadge(user.status)}</td>
                  
                  <td>
                    <div className="user-table-actions">
                      <button onClick={() => handleView(user.id)} className="user-action-btn" title="View">👁️</button>
                      
                      {/* ✅ FIX 3: Hide Delete for Self */}
                      {user.id !== currentUser.id && (
                        <button onClick={() => handleDelete(user.id)} className="user-action-btn" title="Delete">🗑️</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="user-pagination-footer">
            <div className="rows-per-page">
                <span style={{ marginRight: '10px' }}>Rows:</span>
                <select value={itemsPerPage} onChange={handleRowsChange}><option value={20}>20</option><option value={40}>40</option></select>
            </div>
            <div className="user-pagination">
                <button className="user-page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                <span style={{margin:'0 10px'}}>Page {currentPage} of {totalPages}</span>
                <button className="user-page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser ? getModalTitle(selectedUser.role_name) : 'User Details'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-body">
              {modalLoading ? <p>Loading...</p> : selectedUser && (
                <div className="details-grid">
                  
                  {/* Header with Image & Name */}
                  <div className="detail-item full-width" style={{textAlign:'center', paddingBottom:'20px', borderBottom:'1px solid #f1f5f9'}}>
                     <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                        {renderProfileImage(selectedUser)}
                        <h2 style={{margin:'5px 0 0 0', fontSize:'1.5rem', color:'#1e293b'}}>
                          {getFullName(selectedUser)} 
                        </h2>
                        <p style={{margin:0, color:'#64748b'}}>{selectedUser.email}</p>
                        <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                           {/* ✅ Modal Badges */}
                           {getRoleBadge(selectedUser.role_name)}
                           {getStatusBadge(selectedUser.status)}
                        </div>
                     </div>
                  </div>

                  {/* Common Details */}
                  <div className="detail-item"><label>Phone</label> <span>{selectedUser.admin?.phone || selectedUser.mentor?.phone || selectedUser.accUser?.phone || 'N/A'}</span></div>
                  <div className="detail-item"><label>Gender</label> <span style={{textTransform:'capitalize'}}>{selectedUser.mentor?.gender || selectedUser.accUser?.gender || 'N/A'}</span></div>
                  <div className="detail-item"><label>Joined Date</label> <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span></div>

                  {/* Mentor Specific */}
                  {selectedUser.role_name === 'mentor' && selectedUser.mentor && (
                    <>
                      <div className="detail-item full-width"><hr style={{borderColor:'#f1f5f9'}}/></div>
                      <div className="detail-item"><label>Job Title</label> <span>{selectedUser.mentor.job_title}</span></div>
                      <div className="detail-item"><label>Company</label> <span>{selectedUser.mentor.company_name}</span></div>
                      <div className="detail-item full-width"><label>Education</label> 
                         <ul style={{paddingLeft:'20px', margin:'5px 0', color:'#475569'}}>
                            {selectedUser.mentor.education?.map((edu, idx) => (
                               <li key={idx}><b>{edu.degree_name}</b> at {edu.university_name}</li>
                            ))}
                         </ul>
                      </div>
                    </>
                  )}

                  {/* Student Specific */}
                  {selectedUser.role_name === 'user' && selectedUser.accUser && (
                    <>
                       <div className="detail-item full-width"><hr style={{borderColor:'#f1f5f9'}}/></div>
                       <div className="detail-item"><label>Type</label> <span>{selectedUser.accUser.types_user}</span></div>
                       <div className="detail-item"><label>Institution</label> <span>{selectedUser.accUser.institution_name}</span></div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;