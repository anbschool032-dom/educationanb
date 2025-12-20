// // carrear-frontend-admin/src/pages/MentorApprovalPage.jsx

// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig'; // Configured Axios

// const MentorApprovalPage = () => {
//     const [pendingMentors, setPendingMentors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // --- Fetch Pending Mentors ---
//     const fetchMentors = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             // Backend endpoint: GET /api/v1/admin/mentors/pending
//             const response = await api.get('/admin/mentors/pending');
//             setPendingMentors(response.data);
//         } catch (err) {
//             console.error("Error fetching pending mentors:", err);
//             setError("Failed to load mentor applications. Server error.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMentors();
//     }, []);

//     // --- Handle Mentor Review (Accept/Reject) ---
//     const handleReview = async (mentorId, action) => {
//         if (!window.confirm(`Are you sure you want to ${action} this mentor?`)) {
//             return;``
//         }

//         try {
//             // Backend endpoint: PATCH /api/v1/admin/mentors/:mentorId/review
//             await api.patch(`/admin/mentors/${mentorId}/review`, { action });
            
//             alert(`Mentor application ${action}ed successfully.`);
            
//             // Remove the mentor from the list after successful review
//             setPendingMentors(prev => prev.filter(m => m.id !== mentorId));

//         } catch (err) {
//             const message = err.response?.data?.message || `Failed to ${action} mentor.`;
//             setError(message);
//         }
//     };

//     if (loading) return <div>Loading pending mentor applications...</div>;
//     if (error) return <div className="alert alert-danger">{error}</div>;

//     return (
//         <div className="mentor-approval-page">
//             <h2 className="mb-4">Mentor Management</h2>
//             <div className="d-flex mb-4">
//                 <button className="btn btn-dark me-2">Review Mentor Registration</button>
//                 <button className="btn btn-outline-dark">View All Mentors</button>
//             </div>

//             <h3>Review Mentor Applications ({pendingMentors.length} pending)</h3>

//             {pendingMentors.length === 0 ? (
//                 <div className="alert alert-info">No pending mentor applications at this time.</div>
//             ) : (
//                 <table className="table table-hover table-striped">
//                     <thead>
//                         <tr>
//                             <th>Actions</th>
//                             <th>Full Name</th>
//                             <th>Gender</th>
//                             <th>Job Title</th>
//                             <th>Position</th>
//                             <th>CV/Portfolio Link</th>
//                             <th>Applied Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pendingMentors.map((mentor) => (
//                             <tr key={mentor.id}>
//                                 <td>
//                                     <button 
//                                         className="btn btn-success btn-sm me-2" 
//                                         onClick={() => handleReview(mentor.id, 'accept')}
//                                     >
//                                         Accept
//                                     </button>
//                                     <button 
//                                         className="btn btn-danger btn-sm" 
//                                         onClick={() => handleReview(mentor.id, 'reject')}
//                                     >
//                                         Reject
//                                     </button>
//                                 </td>
//                                 <td>{mentor.first_name} {mentor.last_name}</td>
//                                 <td>{mentor.gender}</td>
//                                 <td>{mentor.job_title}</td>
//                                 <td>{mentor.position_name}</td>
//                                 <td>
//                                     <a href={mentor.document_url} target="_blank" rel="noopener noreferrer">
//                                         View CV
//                                     </a>
//                                 </td>
//                                 <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default MentorApprovalPage;






// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';

// const MentorApprovalPage = () => {
//   const [pendingMentors, setPendingMentors] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     accepted: 0,
//     rejected: 0,
//     pending: 0,
//   });

//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Fetch pending mentors
//   const fetchMentors = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const pendingRes = await api.get('/admin/mentors/pending');
//       const statsRes = await api.get('/admin/mentors/stats'); // ⬅ recommended endpoint

//       setPendingMentors(pendingRes.data);
//       setStats(statsRes.data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load mentor data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMentors();
//   }, []);

//   // 🔹 Accept / Reject mentor
//   const handleReview = async (mentorId, action) => {
//     if (!window.confirm(`Are you sure you want to ${action} this mentor?`)) return;

//     try {
//       await api.patch(`/admin/mentors/${mentorId}/review`, { action });
//       alert(`Mentor ${action}ed successfully`);
//       fetchMentors();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Action failed');
//     }
//   };

//   if (loading) return <div className="text-center mt-5">Loading...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <div className="container mt-4 mentor-approval-page">
//       <h2 className="mb-4">Mentor Management</h2>

//       {/* 🔹 STATS CARDS */}
//       <div className="row mb-4">
//         <StatCard title="Total Mentors" value={stats.total} color="primary" />
//         <StatCard title="Accepted" value={stats.accepted} color="success" />
//         <StatCard title="Rejected" value={stats.rejected} color="danger" />
//         <StatCard title="Pending" value={stats.pending} color="warning" />
//       </div>

//       {/* 🔹 TABLE */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-dark text-white">
//           Pending Mentor Applications ({pendingMentors.length})
//         </div>
//         <div className="card-body p-0">
//           {pendingMentors.length === 0 ? (
//             <div className="p-3 text-center text-muted">
//               No pending mentor applications
//             </div>
//           ) : (
//             <table className="table table-hover mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>Actions</th>
//                   <th>Name</th>
//                   <th>Job Title</th>
//                   <th>Position</th>
//                   <th>CV</th>
//                   <th>Applied</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingMentors.map((mentor) => (
//                   <tr key={mentor.id}>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-info me-1"
//                         onClick={() => setSelectedMentor(mentor)}
//                       >
//                         View
//                       </button>
//                       <button
//                         className="btn btn-sm btn-success me-1"
//                         onClick={() => handleReview(mentor.id, 'accept')}
//                       >
//                         Accept
//                       </button>
//                       <button
//                         className="btn btn-sm btn-danger"
//                         onClick={() => handleReview(mentor.id, 'reject')}
//                       >
//                         Reject
//                       </button>
//                     </td>
//                     <td>{mentor.first_name} {mentor.last_name}</td>
//                     <td>{mentor.job_title}</td>
//                     <td>{mentor.position_name}</td>
//                     <td>
//                       <a href={mentor.document_url} target="_blank" rel="noreferrer">
//                         View CV
//                       </a>
//                     </td>
//                     <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* 🔹 MODAL */}
//       {selectedMentor && (
//         <MentorDetailModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
//       )}
//     </div>
//   );
// };

// // 🔹 STAT CARD COMPONENT
// const StatCard = ({ title, value, color }) => (
//   <div className="col-md-3 mb-3">
//     <div className={`card border-${color} shadow-sm`}>
//       <div className={`card-body text-${color}`}>
//         <h6 className="card-title">{title}</h6>
//         <h3 className="fw-bold">{value}</h3>
//       </div>
//     </div>
//   </div>
// );

// // 🔹 MODAL COMPONENT
// const MentorDetailModal = ({ mentor, onClose }) => (
//   <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
//     <div className="modal-dialog modal-lg">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title">Mentor Detail</h5>
//           <button className="btn-close" onClick={onClose}></button>
//         </div>
//         <div className="modal-body">
//           <p><strong>Name:</strong> {mentor.first_name} {mentor.last_name}</p>
//           <p><strong>Gender:</strong> {mentor.gender}</p>
//           <p><strong>Job Title:</strong> {mentor.job_title}</p>
//           <p><strong>Position:</strong> {mentor.position_name}</p>
//           <p>
//             <strong>CV:</strong>{' '}
//             <a href={mentor.document_url} target="_blank" rel="noreferrer">
//               View Document
//             </a>
//           </p>
//         </div>
//         <div className="modal-footer">
//           <button className="btn btn-secondary" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default MentorApprovalPage;





// src/pages/MentorApprovalPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/css/components/mentorapprove.css';

const MentorApprovalPage = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0 });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes] = await Promise.all([
        api.get('/admin/mentors/pending'),
        api.get('/admin/mentors/stats')
      ]);
      setPendingMentors(pendingRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (mentorId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this mentor?`)) return;
    try {
      await api.patch(`/admin/mentors/${mentorId}/review`, { action });
      alert(`Mentor ${action}ed successfully!`);
      fetchData();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pendingMentors.map(m => ({
      'Full Name': `${m.first_name} ${m.last_name}`,
      Gender: m.gender,
      'Job Title': m.job_title,
      Position: m.position_name,
      'Applied Date': new Date(m.created_at).toLocaleDateString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pending Mentors');
    XLSX.writeFile(wb, 'Pending_Mentors_Report.xlsx');
  };

  const printPDF = () => {
    import('jspdf-autotable').then(({ default: autoTable }) => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Pending Mentor Applications', 20, 20);
      doc.setFontSize(12);
      doc.text(`Total Pending: ${stats.pending}`, 20, 30);

      autoTable(doc, {
        startY: 40,
        head: [['Name', 'Gender', 'Job Title', 'Position', 'Applied Date']],
        body: pendingMentors.map(m => [
          `${m.first_name} ${m.last_name}`,
          m.gender || '-',
          m.job_title || '-',
          m.position_name || '-',
          new Date(m.created_at).toLocaleDateString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [111, 66, 193] },
      });

      doc.save('Pending_Mentors_Report.pdf');
    });
  };

  if (loading) return <div className="text-center py-5">Loading mentor applications...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mentor-approval-page container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Mentor Management</h2>
          <p>Review and manage mentor applications</p>
        </div>
        <div>
          <button className="btn btn-purple me-2" onClick={exportExcel}>
            Export Excel
          </button>
          <button className="btn btn-info" onClick={printPDF}>
            Print Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary shadow-sm">
            <div className="card-body">
              <h5>Total Mentors</h5>
              <h3>{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success shadow-sm">
            <div className="card-body">
              <h5>Accepted</h5>
              <h3>{stats.accepted}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger shadow-sm">
            <div className="card-body">
              <h5>Rejected</h5>
              <h3>{stats.rejected}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning shadow-sm">
            <div className="card-body">
              <h5>Pending</h5>
              <h3>{stats.pending}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between">
          <h5>Pending Applications ({pendingMentors.length})</h5>
        </div>
        <div className="card-body p-0">
          {pendingMentors.length === 0 ? (
            <div className="p-4 text-center text-muted">No pending applications</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Actions</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Job Title</th>
                    <th>Position</th>
                    <th>CV</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMentors.map((mentor) => (
                    <tr key={mentor.id}>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-1"
                          onClick={() => setSelectedMentor(mentor)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleReview(mentor.id, 'accept')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReview(mentor.id, 'reject')}
                        >
                          Reject
                        </button>
                      </td>
                      <td><strong>{mentor.first_name} {mentor.last_name}</strong></td>
                      <td>{mentor.gender || '-'}</td>
                      <td>{mentor.job_title || '-'}</td>
                      <td>{mentor.position_name || '-'}</td>
                      <td>
                        {mentor.document_url ? (
                          <a href={mentor.document_url} target="_blank" rel="noreferrer" className="text-primary">
                            View CV
                          </a>
                        ) : '-'}
                      </td>
                      <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedMentor && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Mentor Application Details</h5>
                <button className="btn-close" onClick={() => setSelectedMentor(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {selectedMentor.first_name} {selectedMentor.last_name}</p>
                    <p><strong>Gender:</strong> {selectedMentor.gender}</p>
                    <p><strong>Job Title:</strong> {selectedMentor.job_title}</p>
                    <p><strong>Position:</strong> {selectedMentor.position_name}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>CV/Portfolio:</strong></p>
                    {selectedMentor.document_url ? (
                      <a href={selectedMentor.document_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        Download CV
                      </a>
                    ) : <span className="text-muted">Not provided</span>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedMentor(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorApprovalPage;