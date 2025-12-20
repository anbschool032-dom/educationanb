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



// src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct import for v3+
import '../assets/css/components/usermanagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const navigate = useNavigate();

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

  // Search Logic
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowsChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- EXPORT TO EXCEL ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(u => ({
      'Email': u.email,
      'Name': u.name,
      'Role': u.role_name,
      'Status': u.status,
      'Created By': u.created_by, // ✅ Added
      'Date': new Date(u.created_at).toLocaleDateString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "User_Report.xlsx");
  };

  // --- EXPORT TO PDF (FIXED) ---
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("User Management Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Table Data
    const tableColumn = ["#", "Email", "Name", "Role", "Created By", "Status", "Date"];
    const tableRows = filteredUsers.map((u, index) => [
      index + 1,
      u.email,
      u.name,
      u.role_name,
      u.created_by, // ✅ Added
      u.status,
      new Date(u.created_at).toLocaleDateString()
    ]);

    // Generate Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [102, 126, 234] }
    });

    doc.save("User_Report.pdf");
  };

  // Helper Styles
  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return 'admin';
      case 'mentor': return 'mentor';
      case 'user': return 'user';
      default: return '';
    }
  };
  const getStatusBadge = (status) => {
    return status === 'active' ? 'active' : status === 'pending' ? 'pending' : 'inactive';
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all users, mentors, and admins</p>
        </div>
        <button className="user-create-button" onClick={() => navigate('/create-user')}>
          <span>+</span> Create New User
        </button>
      </div>

      <div className="user-table-container" style={{ marginBottom: '20px', padding: '1.5rem' }}>
        <div className="filter-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
             <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Search Users</label>
             <input type="text" className="form-control" placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>
          <div>
            <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600', color:'#4a5568'}}>Filter by Date</label>
            <div style={{display:'flex', gap:'10px'}}>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #e2e8f0'}} />
              <button onClick={fetchUsers} className="user-action-btn" style={{backgroundColor:'#2d3748', color:'white'}}>Filter</button>
            </div>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
             <button onClick={exportToExcel} className="user-create-button" style={{background:'#10B981', boxShadow:'none'}}>Excel</button>
             <button onClick={exportToPDF} className="user-create-button" style={{background:'#EF4444', boxShadow:'none'}}>PDF</button>
          </div>
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created By</th> {/* ✅ New Header */}
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{textAlign:'center', padding:'3rem'}}>Loading...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign:'center', padding:'3rem'}}>No users found.</td></tr>
            ) : (
              currentItems.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td><span className={`user-role-badge ${getRoleBadge(user.role_name)}`}>{user.role_name}</span></td>
                  <td><span style={{color: user.created_by === '-' ? '#cbd5e0' : '#4a5568', fontWeight: 500}}>{user.created_by}</span></td> {/* ✅ Data */}
                  <td><span className={`user-status-badge ${getStatusBadge(user.status)}`}>{user.status}</span></td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="user-table-actions">
                      <button className="user-action-btn" title="View">👁️</button>
                      <button className="user-action-btn" title="Edit">✏️</button>
                      <button className="user-action-btn" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="user-pagination-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div className="rows-per-page">
                <span style={{ color: '#718096', fontSize: '0.9rem', marginRight: '10px' }}>Rows per page:</span>
                <select value={itemsPerPage} onChange={handleRowsChange} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                </select>
            </div>
            <div className="user-pagination">
                <button className="user-page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) ? (
                        <button key={number} onClick={() => handlePageChange(number)} className={`user-page-btn ${currentPage === number ? 'active-page' : ''}`}>{number}</button>
                    ) : (number === currentPage - 2 || number === currentPage + 2) ? <span key={number} style={{padding:'0 5px'}}>...</span> : null
                ))}
                <button className="user-page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            </div>
            <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;