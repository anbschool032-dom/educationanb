// // src/pages/UserManagement.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable'; // This is crucial for the PDF table to work
// import '../assets/css/components/usermanagement.css';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]); // All users from DB
//   const [filteredUsers, setFilteredUsers] = useState([]); // Users after search/filter
//   const [loading, setLoading] = useState(false);
  
//   // Filter States
//   const [search, setSearch] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20); // Default 20

//   const navigate = useNavigate();

//   // 1. Fetch Users
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (startDate) params.append('startDate', startDate);
//       if (endDate) params.append('endDate', endDate);
//       // We fetch ALL users first, then filter client-side for smoother pagination
//       const response = await api.get(`/admin/users?${params.toString()}`);
      
//       setUsers(response.data);
//       setFilteredUsers(response.data); // Initially, filtered = all
//       setCurrentPage(1); // Reset to page 1 on new fetch
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 2. Handle Search (Client-Side for instant pagination updates)
//   useEffect(() => {
//     let result = users;

//     // Apply Search
//     if (search) {
//       const lowerSearch = search.toLowerCase();
//       result = result.filter(u => 
//         (u.name && u.name.toLowerCase().includes(lowerSearch)) ||
//         (u.email && u.email.toLowerCase().includes(lowerSearch)) ||
//         (u.role_name && u.role_name.toLowerCase().includes(lowerSearch))
//       );
//     }

//     setFilteredUsers(result);
//     setCurrentPage(1); // Reset to page 1 when search changes
//   }, [search, users]);

//   // 3. Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleRowsChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // 4. Export Functions
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(u => ({
//       ID: u.id,
//       Name: u.name,
//       Email: u.email,
//       Role: u.role_name,
//       Status: u.status,
//       'Created At': new Date(u.created_at).toLocaleDateString()
//     })));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//     XLSX.writeFile(workbook, "User_Report.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(18);
//     doc.text("User Management Report", 14, 20);
    
//     // Date
//     doc.setFontSize(11);
//     doc.setTextColor(100);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

//     // Table
//     const tableColumn = ["#", "Name", "Email", "Role", "Status", "Date"];
//     const tableRows = filteredUsers.map((u, index) => [
//       index + 1,
//       u.name,
//       u.email,
//       u.role_name,
//       u.status,
//       new Date(u.created_at).toLocaleDateString()
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 35,
//       theme: 'grid',
//       styles: { fontSize: 9 },
//       headStyles: { fillColor: [102, 126, 234] } // Matches your CSS purple
//     });

//     doc.save("User_Report.pdf");
//   };

//   // Badge Helpers
//   const getRoleBadge = (role) => {
//     switch(role) {
//       case 'admin': return 'admin';
//       case 'mentor': return 'mentor';
//       case 'user': return 'user';
//       default: return '';
//     }
//   };

//   const getStatusBadge = (status) => {
//     return status === 'active' ? 'active' : status === 'pending' ? 'pending' : 'inactive';
//   };

//   return (
//     <div className="user-management-container">
//       {/* Header */}
//       <div className="user-management-header">
//         <div>
//           <h2>User Management</h2>
//           <p>Manage all users, mentors, and admins</p>
//         </div>
//         <button className="user-create-button" onClick={() => navigate('/create-user')}>
//           <span>+</span> Create New User
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="user-table-container" style={{ marginBottom: '20px', padding: '1.5rem' }}>
//         <div className="filter-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
//           <div style={{ flex: 1, minWidth: '200px' }}>
//              <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Search Users</label>
//              <input 
//                 type="text" 
//                 className="form-control" 
//                 placeholder="Search by name, email..." 
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
//              />
//           </div>
//           <div>
//             <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Filter by Date</label>
//             <div style={{display:'flex', gap:'10px'}}>
//               <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
//               <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
//               <button onClick={fetchUsers} className="user-action-btn" style={{backgroundColor:'#2d3748', color:'white'}}>Filter</button>
//             </div>
//           </div>
//           <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
//              <button onClick={exportToExcel} className="user-create-button" style={{background:'#10B981', boxShadow:'none'}}>Excel</button>
//              <button onClick={exportToPDF} className="user-create-button" style={{background:'#EF4444', boxShadow:'none'}}>PDF</button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="user-table-container">
//         <table className="user-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Email</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan="7" style={{textAlign:'center', padding:'3rem'}}>Loading...</td></tr>
//             ) : currentItems.length === 0 ? (
//               <tr><td colSpan="7" style={{textAlign:'center', padding:'3rem'}}>No users found.</td></tr>
//             ) : (
//               currentItems.map((user, index) => (
//                 <tr key={user.id}>
//                   <td>{indexOfFirstItem + index + 1}</td>
//                   <td>{user.email}</td>
//                   <td>{user.name}</td>
//                   <td><span className={`user-role-badge ${getRoleBadge(user.role_name)}`}>{user.role_name}</span></td>
//                   <td><span className={`user-status-badge ${getStatusBadge(user.status)}`}>{user.status}</span></td>
//                   <td>{new Date(user.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <div className="user-table-actions">
//                       <button className="user-action-btn" title="View">👁️</button>
//                       <button className="user-action-btn" title="Edit">✏️</button>
//                       <button className="user-action-btn" title="Delete">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* --- PAGINATION CONTROLS --- */}
//         <div className="user-pagination-footer" style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center', 
//             marginTop: '20px', 
//             borderTop: '1px solid #f1f5f9', 
//             paddingTop: '20px' 
//         }}>
            
//             {/* Rows Per Page */}
//             <div className="rows-per-page">
//                 <span style={{ color: '#718096', fontSize: '0.9rem', marginRight: '10px' }}>Rows per page:</span>
//                 <select 
//                     value={itemsPerPage} 
//                     onChange={handleRowsChange}
//                     style={{ 
//                         padding: '5px 10px', 
//                         borderRadius: '6px', 
//                         border: '1px solid #e2e8f0',
//                         color: '#4a5568',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     <option value={20}>20</option>
//                     <option value={40}>40</option>
//                     <option value={60}>60</option>
//                 </select>
//             </div>

//             {/* Page Numbers */}
//             <div className="user-pagination">
//                 <button 
//                     className="user-page-btn" 
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
//                 >
//                     &lt;
//                 </button>
                
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                     // Show roughly 5 page numbers to save space
//                     (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) ? (
//                         <button
//                             key={number}
//                             onClick={() => handlePageChange(number)}
//                             className={`user-page-btn ${currentPage === number ? 'active-page' : ''}`}
//                         >
//                             {number}
//                         </button>
//                     ) : (number === currentPage - 2 || number === currentPage + 2) ? <span key={number} style={{padding:'0 5px'}}>...</span> : null
//                 ))}

//                 <button 
//                     className="user-page-btn" 
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
//                 >
//                     &gt;
//                 </button>
//             </div>

//             <div style={{ color: '#718096', fontSize: '0.9rem' }}>
//                 Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length}
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserManagement;



// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; 
// import Swal from "sweetalert2";
// import '../assets/css/components/createuser.css'; // Using the unified CSS file

// const UserManagement = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   // Search & Filter
//   const [search, setSearch] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);

//   // Modal Logic
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);

//   // 1. Fetch Users
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (startDate) params.append('startDate', startDate);
//       if (endDate) params.append('endDate', endDate);
      
//       const response = await api.get(`/admin/users?${params.toString()}`);
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//       setCurrentPage(1);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   // 2. Handle Search
//   useEffect(() => {
//     let result = users;
//     if (search) {
//       const lowerSearch = search.toLowerCase();
//       result = result.filter(u => 
//         (u.name && u.name.toLowerCase().includes(lowerSearch)) ||
//         (u.email && u.email.toLowerCase().includes(lowerSearch)) ||
//         (u.role_name && u.role_name.toLowerCase().includes(lowerSearch))
//       );
//     }
//     setFilteredUsers(result);
//     setCurrentPage(1);
//   }, [search, users]);

//   // 3. DELETE Action
//   const handleDelete = (userId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!"
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await api.delete(`/admin/user/${userId}`);
//           Swal.fire("Deleted!", "User has been deleted.", "success");
//           fetchUsers(); // Refresh list
//         } catch (error) {
//           Swal.fire("Error!", "Failed to delete user.", "error");
//         }
//       }
//     });
//   };

//   // 4. VIEW Action
//   const handleView = async (id) => {
//     setShowModal(true);
//     setModalLoading(true);
//     try {
//       const response = await api.get(`/admin/user/${id}`);
//       setSelectedUser(response.data);
//     } catch (error) {
//       Swal.fire("Error", "Could not fetch user details", "error");
//       setShowModal(false);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // 5. Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
//   const handleRowsChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // 6. Exports
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(u => ({
//       'Email': u.email, 'Name': u.name, 'Role': u.role_name, 'Status': u.status, 'Created By': u.created_by, 'Date': new Date(u.created_at).toLocaleDateString()
//     })));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//     XLSX.writeFile(workbook, "User_Report.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18); doc.text("User Management Report", 14, 20);
//     doc.setFontSize(11); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
//     autoTable(doc, {
//       head: [["#", "Email", "Name", "Role", "Created By", "Status", "Date"]],
//       body: filteredUsers.map((u, i) => [i + 1, u.email, u.name, u.role_name, u.created_by, u.status, new Date(u.created_at).toLocaleDateString()]),
//       startY: 35,
//     });
//     doc.save("User_Report.pdf");
//   };

//   // Helper function to show Profile Image
//   const renderProfileImage = (user) => {
//     // 1. Check if specific role has an image
//     const imageName = user.admin?.profile_image || user.mentor?.profile_image || user.accUser?.profile_image;
    
//     // 2. Construct URL (Adjust localhost:3000 if your backend runs on a different port)
//     const imageUrl = imageName ? `http://localhost:3000/uploads/profiles/${imageName}` : null;

//     if (imageUrl) {
//       return (
//         <img 
//           src={imageUrl} 
//           alt="Profile" 
//           style={{
//             width: '80px', 
//             height: '80px', 
//             borderRadius: '50%', 
//             objectFit: 'cover',
//             border: '3px solid #e2e8f0'
//           }} 
//           onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display='none'; }} // Hide if broken link
//         />
//       );
//     }

//     // 3. Default Icon if no image
//     return (
//       <div style={{width:'80px', height:'80px', borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'#cbd5e0'}}>
//         👤
//       </div>
//     );
//   };

//   return (
//     <div className="user-management-container">
//       {/* Header */}
//       <div className="user-management-header">
//         <div><h2>User Management</h2><p>Manage all users, mentors, and admins</p></div>
//         <button className="user-create-button" onClick={() => navigate('/create-user')}><span>+</span> Create New User</button>
//       </div>

//       {/* Filters */}
//       <div className="user-table-container" style={{ marginBottom: '20px', padding: '1.5rem' }}>
//         <div className="filter-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
//           <div style={{ flex: 1, minWidth: '200px' }}>
//              <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Search Users</label>
//              <input type="text" className="form-control" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
//           </div>
//           <div>
//             <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Filter by Date</label>
//             <div style={{display:'flex', gap:'10px'}}>
//               <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
//               <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
//               <button onClick={fetchUsers} className="user-action-btn" style={{backgroundColor:'#2d3748', color:'white'}}>Filter</button>
//             </div>
//           </div>
//           <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
//              <button onClick={exportToExcel} className="user-create-button" style={{background:'#10B981', boxShadow:'none'}}>Excel</button>
//              <button onClick={exportToPDF} className="user-create-button" style={{background:'#EF4444', boxShadow:'none'}}>PDF</button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="user-table-container">
//         <table className="user-table">
//           <thead>
//             <tr><th>#</th><th>Email</th><th>Name</th><th>Role</th><th>Created By</th><th>Status</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {loading ? <tr><td colSpan="7" style={{textAlign:'center', padding:'3rem'}}>Loading...</td></tr> :
//              currentItems.map((user, index) => (
//                 <tr key={user.id}>
//                   <td>{indexOfFirstItem + index + 1}</td>
//                   <td>{user.email}</td>
//                   <td>{user.name}</td>
//                   <td><span className={`user-role-badge ${user.role_name}`}>{user.role_name}</span></td>
//                   <td><span style={{color: user.created_by === '-' ? '#cbd5e0' : '#4a5568', fontWeight: 500}}>{user.created_by}</span></td>
//                   <td><span className={`user-status-badge ${user.status}`}>{user.status}</span></td>
//                   <td>
//                     <div className="user-table-actions">
//                       <button onClick={() => handleView(user.id)} className="user-action-btn" title="View">👁️</button>
//                       <button className="user-action-btn" title="Edit (Coming Soon)" style={{opacity:0.5}}>✏️</button>
//                       <button onClick={() => handleDelete(user.id)} className="user-action-btn" title="Delete">🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="user-pagination-footer">
//             <div className="rows-per-page">
//                 <span style={{ marginRight: '10px' }}>Rows:</span>
//                 <select value={itemsPerPage} onChange={handleRowsChange}><option value={20}>20</option><option value={40}>40</option></select>
//             </div>
//             <div className="user-pagination">
//                 <button className="user-page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
//                 <span style={{margin:'0 10px'}}>Page {currentPage} of {totalPages}</span>
//                 <button className="user-page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
//             </div>
//         </div>
//       </div>

//       {/* Modal View Details */}
//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header"><h3>User Details</h3><button onClick={() => setShowModal(false)} className="close-btn">&times;</button></div>
//             <div className="modal-body">
//               {modalLoading ? <p>Loading...</p> : selectedUser && (
//                 <div className="details-grid">
                  
//                   {/* 🔥 PROFILE IMAGE & HEADER SECTION */}
//                   <div className="detail-item full-width" style={{textAlign:'center', paddingBottom:'20px', borderBottom:'1px solid #f1f5f9'}}>
//                      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
//                         {renderProfileImage(selectedUser)}
//                         <h2 style={{margin:'5px 0 0 0', fontSize:'1.5rem', color:'#1e293b'}}>
//                           {selectedUser.name || 'Unknown'}
//                         </h2>
//                         <p style={{margin:0, color:'#64748b'}}>{selectedUser.email}</p>
//                         <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
//                            <span className={`user-role-badge ${selectedUser.role_name}`}>{selectedUser.role_name}</span>
//                            <span className={`user-status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
//                         </div>
//                      </div>
//                   </div>

//                   {/* Common Details */}
//                   <div className="detail-item"><label>Phone</label> <span>{selectedUser.admin?.phone || selectedUser.mentor?.phone || selectedUser.accUser?.phone || 'N/A'}</span></div>
//                   <div className="detail-item"><label>Gender</label> <span style={{textTransform:'capitalize'}}>{selectedUser.mentor?.gender || selectedUser.accUser?.gender || 'N/A'}</span></div>
//                   <div className="detail-item"><label>Joined Date</label> <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span></div>

//                   {/* Mentor Specific */}
//                   {selectedUser.role_name === 'mentor' && selectedUser.mentor && (
//                     <>
//                       <div className="detail-item full-width"><hr style={{borderColor:'#f1f5f9'}}/></div>
//                       <div className="detail-item"><label>Job Title</label> <span>{selectedUser.mentor.job_title}</span></div>
//                       <div className="detail-item"><label>Company</label> <span>{selectedUser.mentor.company_name}</span></div>
//                       <div className="detail-item full-width"><label>Education</label> 
//                          <ul style={{paddingLeft:'20px', margin:'5px 0', color:'#475569'}}>
//                             {selectedUser.mentor.education?.map((edu, idx) => (
//                                <li key={idx}><b>{edu.degree_name}</b> at {edu.university_name}</li>
//                             ))}
//                          </ul>
//                       </div>
//                     </>
//                   )}

//                   {/* Student Specific */}
//                   {selectedUser.role_name === 'user' && selectedUser.accUser && (
//                     <>
//                        <div className="detail-item full-width"><hr style={{borderColor:'#f1f5f9'}}/></div>
//                        <div className="detail-item"><label>Type</label> <span>{selectedUser.accUser.types_user}</span></div>
//                        <div className="detail-item"><label>Institution</label> <span>{selectedUser.accUser.institution_name}</span></div>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;


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

  // 3. DELETE
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
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        } catch (error) {
          Swal.fire("Error!", "Failed to delete user.", "error");
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
    const imageUrl = imageName ? `http://localhost:3000/uploads/profiles/${imageName}` : null;

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
                  <td><span className={`user-role-badge ${user.role_name}`}>{user.role_name}</span></td>
                  <td><span style={{color: user.created_by === '-' ? '#cbd5e0' : '#4a5568', fontWeight: 500}}>{user.created_by}</span></td>
                  <td><span className={`user-status-badge ${user.status}`}>{user.status}</span></td>
                  <td>
                    <div className="user-table-actions">
                      <button onClick={() => handleView(user.id)} className="user-action-btn" title="View">👁️</button>
                      <button onClick={() => handleDelete(user.id)} className="user-action-btn" title="Delete">🗑️</button>
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
              {/* 🔥 DYNAMIC TITLE HERE */}
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
                        {/* 🔥 FIXED NAME DISPLAY HERE */}
                        <h2 style={{margin:'5px 0 0 0', fontSize:'1.5rem', color:'#1e293b'}}>
                          {getFullName(selectedUser)} 
                        </h2>
                        <p style={{margin:0, color:'#64748b'}}>{selectedUser.email}</p>
                        <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                           <span className={`user-role-badge ${selectedUser.role_name}`}>{selectedUser.role_name}</span>
                           <span className={`user-status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
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