// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axiosConfig';
// import '../assets/css/components/usermanagement.css';

// const UserManagementPage = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10;

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get('/admin/users');
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Fetch users error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDisplayName = (user) => {
//     if (user.role_name === 'admin') return `${user.admin_first_name || ''} ${user.admin_last_name || ''}`.trim();
//     if (user.role_name === 'mentor') return `${user.mentor_first_name || ''} ${user.mentor_last_name || ''}`.trim();
//     if (user.role_name === 'user') return `${user.user_first_name || ''} ${user.user_last_name || ''}`.trim();
//     return '-';
//   };

//   const handleUpdate = (userId) => navigate(`/update-user/${userId}`);
  
//   const handleDelete = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     try {
//       await api.delete(`/admin/users/${userId}`);
//       alert('User deleted successfully');
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to delete user');
//     }
//   };
  
//   const handleDetails = async (userId) => {
//     try {
//       const res = await api.get(`/admin/users/${userId}`);
//       const user = res.data;
//       alert(`Email: ${user.email}\nName: ${getDisplayName(user)}\nRole: ${user.role_name}\nStatus: ${user.status}`);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to fetch user details');
//     }
//   };

//   // Pagination
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(users.length / usersPerPage);

//   return (
//     <div className="user-management-container">
//       <div className="user-management-header">
//         <div>
//           <h2>User Management</h2>
//           <p>Manage all users, mentors, and admins</p>
//         </div>
//         <button className="user-create-button" onClick={() => navigate('/create-user')}>
//           + Create New User
//         </button>
//       </div>

//       <div className="user-table-container">
//         {loading ? (
//           <p>Loading...</p>
//         ) : users.length === 0 ? (
//           <p>No users found</p>
//         ) : (
//           <>
//             <table className="user-table">
//              <thead>
//               <tr>
//                 <th>Number</th>
//                 <th>Email</th>
//                 <th>Name</th>
//                 <th>Role</th>
//                 <th>Status</th>
//                 <th>Created By</th> {/* ✅ NEW */}
//                 <th>Created</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//               <tbody>
//                 {currentUsers.map((user, index) => (
//                   <tr key={user.id}>
//                     <td>{indexOfFirstUser + index + 1}</td>
//                     <td>{user.email}</td>
//                     <td>{getDisplayName(user)}</td>
//                     <td>
//                       <span className={`user-role-badge ${user.role_name}`}>
//                         {user.role_name}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`user-status-badge ${user.status}`}>
//                         {user.status}
//                       </span>
//                     </td>

//                     <td>{user.created_by_name || '-'}</td>
//                     <td>{new Date(user.created_at).toLocaleDateString()}</td>
//                     <td className="user-table-actions">
//                       <button 
//                         className="user-action-btn" 
//                         onClick={() => handleUpdate(user.id)} 
//                         title="Update"
//                       >
//                         ✏️
//                       </button>
//                       <button 
//                         className="user-action-btn" 
//                         onClick={() => handleDelete(user.id)} 
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                       <button 
//                         className="user-action-btn" 
//                         onClick={() => handleDetails(user.id)} 
//                         title="Details"
//                       >
//                         🔍
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {totalPages > 1 && (
//               <div className="user-pagination">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     className={`user-page-btn ${page === currentPage ? 'active-page' : ''}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagementPage;






import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../assets/css/components/usermanagement.css';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (user) => {
    if (user.role_name === 'admin') return `${user.admin_first_name || ''} ${user.admin_last_name || ''}`.trim();
    if (user.role_name === 'mentor') return `${user.mentor_first_name || ''} ${user.mentor_last_name || ''}`.trim();
    if (user.role_name === 'user') return `${user.user_first_name || ''} ${user.user_last_name || ''}`.trim();
    return '-';
  };

  const handleUpdate = (userId) => navigate(`/update-user/${userId}`);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const handleDetails = async (userId) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      const user = res.data;
      alert(`Email: ${user.email}\nName: ${getDisplayName(user)}\nRole: ${user.role_name}\nStatus: ${user.status}`);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch user details');
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all users, mentors, and admins</p>
        </div>
        <button className="user-create-button" onClick={() => navigate('/create-user')}>
          + Create New User
        </button>
      </div>
      <div className="user-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.email}</td>
                    <td>{getDisplayName(user)}</td>
                    <td>
                      <span className={`user-role-badge ${user.role_name}`}>
                        {user.role_name}
                      </span>
                    </td>
                    <td>
                      <span className={`user-status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.created_by_name || '-'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="user-table-actions">
                      <button
                        className="user-action-btn"
                        onClick={() => handleUpdate(user.id)}
                        title="Update"
                      >
                        ✏️
                      </button>
                      <button
                        className="user-action-btn"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                      <button
                        className="user-action-btn"
                        onClick={() => handleDetails(user.id)}
                        title="Details"
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="user-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`user-page-btn ${page === currentPage ? 'active-page' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;