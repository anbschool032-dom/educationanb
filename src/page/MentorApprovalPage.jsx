// // src/pages/MentorApprovalPage.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import '../assets/css/components/mentorapprove.css';

// const MentorApprovalPage = () => {
//   const [pendingMentors, setPendingMentors] = useState([]);
//   const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0 });
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [pendingRes, statsRes] = await Promise.all([
//         api.get('/admin/mentors/pending'),

//         api.get('/admin/mentors/stats')
//       ]);
//       setPendingMentors(pendingRes.data);
//       setStats(statsRes.data);
//     } catch (err) {
//       setError('Failed to load data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReview = async (mentorId, action) => {
//     if (!window.confirm(`Are you sure you want to ${action} this mentor?`)) return;
//     try {
//       await api.patch(`/admin/mentors/${mentorId}/review`, { action });
//       alert(`Mentor ${action}ed successfully!`);
//       fetchData();
//     } catch (err) {
//       alert('Action failed: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(pendingMentors.map(m => ({
//       'Full Name': `${m.first_name} ${m.last_name}`,
//       Gender: m.gender,
//       'Job Title': m.job_title,
//       Position: m.position_name,
//       'Applied Date': new Date(m.created_at).toLocaleDateString(),
//     })));
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Pending Mentors');
//     XLSX.writeFile(wb, 'Pending_Mentors_Report.xlsx');
//   };

//   const printPDF = () => {
//     import('jspdf-autotable').then(({ default: autoTable }) => {
//       const doc = new jsPDF();
//       doc.setFontSize(20);
//       doc.text('Pending Mentor Applications', 20, 20);
//       doc.setFontSize(12);
//       doc.text(`Total Pending: ${stats.pending}`, 20, 30);

//       autoTable(doc, {
//         startY: 40,
//         head: [['Name', 'Gender', 'Job Title', 'Position', 'Applied Date']],
//         body: pendingMentors.map(m => [
//           `${m.first_name} ${m.last_name}`,
//           m.gender || '-',
//           m.job_title || '-',
//           m.position_name || '-',
//           new Date(m.created_at).toLocaleDateString()
//         ]),
//         theme: 'grid',
//         headStyles: { fillColor: [111, 66, 193] },
//       });

//       doc.save('Pending_Mentors_Report.pdf');
//     });
//   };

//   if (loading) return <div className="text-center py-5">Loading mentor applications...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <div className="mentor-approval-page container py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2>Mentor Management</h2>
//           <p>Review and manage mentor applications</p>
//         </div>
//         <div>
//           <button className="btn btn-purple me-2" onClick={exportExcel}>
//             Export Excel
//           </button>
//           <button className="btn btn-info" onClick={printPDF}>
//             Print Report
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card text-white bg-primary shadow-sm">
//             <div className="card-body">
//               <h5>Total Mentors</h5>
//               <h3>{stats.total}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-white bg-success shadow-sm">
//             <div className="card-body">
//               <h5>Accepted</h5>
//               <h3>{stats.accepted}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-white bg-danger shadow-sm">
//             <div className="card-body">
//               <h5>Rejected</h5>
//               <h3>{stats.rejected}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-white bg-warning shadow-sm">
//             <div className="card-body">
//               <h5>Pending</h5>
//               <h3>{stats.pending}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pending Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-dark text-white d-flex justify-content-between">
//           <h5>Pending Applications ({pendingMentors.length})</h5>
//         </div>
//         <div className="card-body p-0">
//           {pendingMentors.length === 0 ? (
//             <div className="p-4 text-center text-muted">No pending applications</div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Actions</th>
//                     <th>Name</th>
//                     <th>Gender</th>
//                     <th>Job Title</th>
//                     <th>Position</th>
//                     <th>CV</th>
//                     <th>Applied Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingMentors.map((mentor) => (
//                     <tr key={mentor.id}>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-info me-1"
//                           onClick={() => setSelectedMentor(mentor)}
//                         >
//                           View
//                         </button>
//                         <button
//                           className="btn btn-sm btn-success me-1"
//                           onClick={() => handleReview(mentor.id, 'accept')}
//                         >
//                           Accept
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleReview(mentor.id, 'reject')}
//                         >
//                           Reject
//                         </button>
//                       </td>
//                       <td><strong>{mentor.first_name} {mentor.last_name}</strong></td>
//                       <td>{mentor.gender || '-'}</td>
//                       <td>{mentor.job_title || '-'}</td>
//                       <td>{mentor.position_name || '-'}</td>
//                       <td>
//                         {mentor.document_url ? (
//                           <a href={mentor.document_url} target="_blank" rel="noreferrer" className="text-primary">
//                             View CV
//                           </a>
//                         ) : '-'}
//                       </td>
//                       <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* View Modal */}
//       {selectedMentor && (
//         <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5>Mentor Application Details</h5>
//                 <button className="btn-close" onClick={() => setSelectedMentor(null)}></button>
//               </div>
//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <p><strong>Name:</strong> {selectedMentor.first_name} {selectedMentor.last_name}</p>
//                     <p><strong>Gender:</strong> {selectedMentor.gender}</p>
//                     <p><strong>Job Title:</strong> {selectedMentor.job_title}</p>
//                     <p><strong>Position:</strong> {selectedMentor.position_name}</p>
//                   </div>
//                   <div className="col-md-6">
//                     <p><strong>CV/Portfolio:</strong></p>
//                     {selectedMentor.document_url ? (
//                       <a href={selectedMentor.document_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
//                         Download CV
//                       </a>
//                     ) : <span className="text-muted">Not provided</span>}
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setSelectedMentor(null)}>Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MentorApprovalPage;


// src/pages/MentorApprovalPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/css/components/mentorapprove.css';
import Swal from "sweetalert2"; // ណែនាំឱ្យប្រើ SweetAlert2 ឱ្យស្អាត

const MentorApprovalPage = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0 });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // ដើម្បីដាក់ loading លើប៊ូតុងពេលចុច

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (mentorId, action) => {
    // បញ្ជាក់ម្តងទៀតមុនសម្រេចចិត្ត
    const result = await Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: action === 'accept' 
          ? "This mentor will receive an approval email and can login immediately." 
          : "This mentor will receive a rejection email.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'accept' ? '#10B981' : '#EF4444',
      confirmButtonText: `Yes, ${action}!`
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(mentorId); // បង្ហាញ Loading
      
      // ហៅទៅ Backend (Backend នឹង update status + ផ្ញើ email)
      const res = await api.patch(`/admin/mentors/${mentorId}/review`, { action });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.data.message || `Mentor ${action}ed successfully!`,
        timer: 2000
      });

      // Update ទិន្នន័យក្នុងតារាងភ្លាមៗ
      fetchData();

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Action failed',
      });
    } finally {
      setProcessingId(null); // បិទ Loading
    }
  };

  // ... (Export Excel & PDF functions remain the same as your code) ...
  const exportExcel = () => { /* ...code ចាស់របស់បង... */ };
  const printPDF = () => { /* ...code ចាស់របស់បង... */ };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div> Loading...</div>;

  return (
    <div className="mentor-approval-page container py-4">
      {/* ... (Header & Stats Cards code នៅដដែល) ... */}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mentor Management</h2>
        <div>
           {/* Buttons... */}
        </div>
      </div>
      
      {/* Stats Cards here... */}

      {/* Pending Table */}
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-dark text-white">
          <h5>Pending Applications ({pendingMentors.length})</h5>
        </div>
        <div className="card-body p-0">
          {pendingMentors.length === 0 ? (
            <div className="p-4 text-center text-muted">No pending applications</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Role Info</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMentors.map((mentor) => (
                    <tr key={mentor.id}>
                      <td>
                        <div className="fw-bold">{mentor.first_name} {mentor.last_name}</div>
                        <small className="text-muted">{mentor.gender}</small>
                      </td>
                      <td>
                        <div>{mentor.job_title || 'N/A'}</div>
                        <small className="text-primary">{mentor.position_name || 'N/A'}</small>
                      </td>
                      <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setSelectedMentor(mentor)}
                          disabled={processingId === mentor.id}
                        >
                          View
                        </button>
                        
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleReview(mentor.id, 'accept')}
                          disabled={processingId === mentor.id}
                        >
                          {processingId === mentor.id ? 'Processing...' : 'Accept'}
                        </button>
                        
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReview(mentor.id, 'reject')}
                          disabled={processingId === mentor.id}
                        >
                          {processingId === mentor.id ? '...' : 'Reject'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal (ដូចកូដចាស់របស់បង) */}
      {selectedMentor && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
           {/* ... Modal content code ... */}
           <div className="modal-dialog modal-lg">
             <div className="modal-content">
               <div className="modal-header">
                 <h5>Applicant Details</h5>
                 <button className="btn-close" onClick={() => setSelectedMentor(null)}></button>
               </div>
               <div className="modal-body">
                 {/* Detail content */}
                 <p>Name: {selectedMentor.first_name} {selectedMentor.last_name}</p>
                 {/* ... */}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorApprovalPage;