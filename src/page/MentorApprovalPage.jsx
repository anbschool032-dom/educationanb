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




import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const MentorApprovalPage = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch pending mentors
  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const pendingRes = await api.get('/admin/mentors/pending');
      const statsRes = await api.get('/admin/mentors/stats'); // ⬅ recommended endpoint

      setPendingMentors(pendingRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load mentor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // 🔹 Accept / Reject mentor
  const handleReview = async (mentorId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this mentor?`)) return;

    try {
      await api.patch(`/admin/mentors/${mentorId}/review`, { action });
      alert(`Mentor ${action}ed successfully`);
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4 mentor-approval-page">
      <h2 className="mb-4">Mentor Management</h2>

      {/* 🔹 STATS CARDS */}
      <div className="row mb-4">
        <StatCard title="Total Mentors" value={stats.total} color="primary" />
        <StatCard title="Accepted" value={stats.accepted} color="success" />
        <StatCard title="Rejected" value={stats.rejected} color="danger" />
        <StatCard title="Pending" value={stats.pending} color="warning" />
      </div>

      {/* 🔹 TABLE */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          Pending Mentor Applications ({pendingMentors.length})
        </div>
        <div className="card-body p-0">
          {pendingMentors.length === 0 ? (
            <div className="p-3 text-center text-muted">
              No pending mentor applications
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Actions</th>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>Position</th>
                  <th>CV</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {pendingMentors.map((mentor) => (
                  <tr key={mentor.id}>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
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
                    <td>{mentor.first_name} {mentor.last_name}</td>
                    <td>{mentor.job_title}</td>
                    <td>{mentor.position_name}</td>
                    <td>
                      <a href={mentor.document_url} target="_blank" rel="noreferrer">
                        View CV
                      </a>
                    </td>
                    <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🔹 MODAL */}
      {selectedMentor && (
        <MentorDetailModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
      )}
    </div>
  );
};

// 🔹 STAT CARD COMPONENT
const StatCard = ({ title, value, color }) => (
  <div className="col-md-3 mb-3">
    <div className={`card border-${color} shadow-sm`}>
      <div className={`card-body text-${color}`}>
        <h6 className="card-title">{title}</h6>
        <h3 className="fw-bold">{value}</h3>
      </div>
    </div>
  </div>
);

// 🔹 MODAL COMPONENT
const MentorDetailModal = ({ mentor, onClose }) => (
  <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Mentor Detail</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p><strong>Name:</strong> {mentor.first_name} {mentor.last_name}</p>
          <p><strong>Gender:</strong> {mentor.gender}</p>
          <p><strong>Job Title:</strong> {mentor.job_title}</p>
          <p><strong>Position:</strong> {mentor.position_name}</p>
          <p>
            <strong>CV:</strong>{' '}
            <a href={mentor.document_url} target="_blank" rel="noreferrer">
              View Document
            </a>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

export default MentorApprovalPage;
