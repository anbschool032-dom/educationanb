// // src/pages/PositionManagement.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/css/components/positionmanagement.css';

// // Remove the local 'api' constant definition if you are using the import above

// const PositionManagement = () => {
//   const [activeTab, setActiveTab] = useState('position');
//   const [industries, setIndustries] = useState([]);
//   const [position, setPositions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Industry form state
//   const [showIndustryForm, setShowIndustryForm] = useState(false);
//   const [industryFormData, setIndustryFormData] = useState({
//     id: null,
//     industry_name: '',
//   });

//   // Position form state
//   const [showPositionForm, setShowPositionForm] = useState(false);
//   const [positionFormData, setPositionFormData] = useState({
//     id: null,
//     industry_id: '',
//     position_name: '',
//     description: '',
//     image_position: null,
//   });

//   useEffect(() => {
//     fetchIndustries();
//     fetchPositions();
//   }, []);





//   // Fetch industries
//   const fetchIndustries = async () => {
//     try {
//       setLoading(true);
//       // Calls: http://localhost:3000/api/v1/industries (now correct)
//       const response = await api.get('/admin/industry'); 
//       setIndustries(response.data);
//     } catch (error) {
//       console.error('Error fetching industries:', error);
//       alert('Failed to fetch industries.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleAddIndustry = () => {
//     setIndustryFormData({ id: null, industry_name: '' });
//     setShowIndustryForm(true);
//   };


// const handleIndustrySubmit = async () => {
//   if (!industryFormData.industry_name.trim()) {
//     alert('Industry name required');
//     return;
//   }

//   try {
//     if (industryFormData.id) {
//       await api.put(
//         `/admin/industry/${industryFormData.id}`,
//         industryFormData
//       );
//       alert('✅ Industry updated successfully');
//     } else {
//       await api.post(
//         '/admin/industry',
//         industryFormData
//       );
//       alert('✅ Industry created successfully');
//     }

//     setShowIndustryForm(false);
//     fetchIndustries();
//   } catch (error) {
//     console.error('Industry save error:', error.response?.data || error.message);

//     alert(
//       error.response?.data?.message ||
//       '❌ Failed to save industry'
//     );
//   }
// };

// const handleEditIndustry = (industry) => {
//   setIndustryFormData({
//     id: industry.id,
//     industry_name: industry.industry_name
//   });
//   setShowIndustryForm(true);
// };


// const handleDeleteIndustry = async (id) => {
//   if (!window.confirm('Delete this industry?')) return;

//   await api.delete(`/admin/industry/${id}`);
//   fetchIndustries();
// };





//     // Fetch position
//   const fetchPositions = async () => {
//     try {
//       setLoading(true);
//       // Calls: http://localhost:3000/api/v1/position (now correct)
//       const response = await api.get('/admin/position'); 
//       setPositions(response.data);
//     } catch (error) {
//       console.error('Error fetching position:', error);
//       alert('Failed to fetch position.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Position Handlers (Logic remains the same, but uses the correct 'api')
//   const handleAddPosition = () => {
//     setPositionFormData({
//       id: null,
//       industry_id: '',
//       position_name: '',
//       description: '',
//       image_position: null,
//     });
//     setShowPositionForm(true);
//   };

//   const handleEditPosition = (position) => {
//   setPositionFormData({
//     id: position.id,
//     industry_id: String(position.industry_id),
//     position_name: position.position_name,
//     description: position.description,
//     image_position: null, // keep null unless user uploads new
//   });

//   setShowPositionForm(true);        // ✅ REQUIRED
//   setActiveTab('create-position');  // ✅ correct
// };


//   const handleDeletePosition = async (id) => {
//     if (window.confirm('Are you sure you want to delete this position?')) {
//       try {
//         await api.delete(`/admin/position/${id}`);
//         fetchPositions();
//         alert('Position deleted successfully');
//       } catch (error) {
//         console.error('Error deleting position:', error);
//         alert('Failed to delete position');
//       }
//     }
//   };

//   const handlePositionSubmit = async () => {
//     try {
//       if (!positionFormData.position_name.trim() || !positionFormData.industry_id) {
//         alert('Position title and industry are required.');
//         return;
//       }

//       // Must use FormData for file uploads
//       const formData = new FormData();
//       formData.append('industry_id', positionFormData.industry_id);
//       formData.append('position_name', positionFormData.position_name);
//       formData.append('description', positionFormData.description || '');
      
//       // Only append the file if it exists
//       if (positionFormData.image_position instanceof File) {
//         formData.append('image_position', positionFormData.image_position);
//       } else if (positionFormData.image_position === null && positionFormData.id) {
//         // Handle case where we don't update the image during edit, 
//         // but need to ensure FormData is still sent correctly.
//         // Backend handles missing file.
//       }


//       // Set appropriate Content-Type for file upload
//       const config = {
//           headers: {
//               'Content-Type': 'multipart/form-data'
//           }
//       };

//       if (positionFormData.id) {
//         await api.put(`/admin/position/${positionFormData.id}`, formData, config);
//         alert('Position updated successfully');
//       } else {
//         await api.post('/admin/position', formData, config);
//         alert('Position created successfully');
//       }

//       setShowPositionForm(false);
//       fetchPositions();
//       // Reset form data after successful save/update
//       setPositionFormData({
//           id: null,
//           industry_id: '',
//           position_name: '',
//           description: '',
//           image_position: null,
//       });
//       setActiveTab('position'); // Switch back to view
//     } catch (error) {
//       console.error('Error saving position:', error.response ? error.response.data : error.message);
//       alert('Failed to save position. Check console for details.');
//     }
//   };




//   // Render method remains unchanged
//   return (
//     <div className="position-management-container" style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//       {/* Tabs */}
//       <ul className="nav nav-tabs mb-4">
//         <li className="nav-item">
//           <button
//             className={`nav-link ${activeTab === 'position' ? 'active' : ''}`}
//             onClick={() => setActiveTab('position')}
//           >
//             View Total Positions
//           </button>
//         </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'industry' ? 'active' : ''}`}
//               onClick={() => {
//                   setActiveTab('industry');
//                   setShowIndustryForm(false); // Hide form when switching to list view
//               }}
//             >
//               Manage Industries
//             </button>
//           </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${activeTab === 'create-position' ? 'active' : ''}`}
//             onClick={() => {
//               // setActiveTab('position');  
//                 setActiveTab('create-position');
//                 handleAddPosition(); // Initialize form for new position
//             }}
//           >
//             Create/Update Position
//           </button>
//         </li>
//       </ul>

//       {/* Positions Tab */}
//       {activeTab === 'position' && (
//         <div className="card p-4 mb-4">
//           <h3>All Positions</h3>
//           {loading && position.length === 0 ? <p>Loading...</p> : (
//             <div className="table-responsive mt-3">
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Title</th>
//                     <th>Industry</th>
//                     <th>Description</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {position.map((p) => (
//                     <tr key={p.id}>
//                       <td>{p.id}</td>
//                       <td>{p.position_name}</td>
//                       <td>{p.industry}</td> {/* Assumes backend returns 'industry' field */}
//                       <td>{p.description}</td>
//                       <td>
//                         <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditPosition(p)}>Edit</button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleDeletePosition(p.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                   {position.length === 0 && !loading && (
//                       <tr>
//                         <td colSpan="5" className="text-center">No position found.</td>
//                       </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}


//       {/* Industries Tab */}
//       {activeTab === 'industry' && (
//         <div className="card p-4 mb-4">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h3>Industry Management</h3>
//             <button className="btn btn-success" onClick={handleAddIndustry}>+ Add Industry</button>
//           </div>

//           {showIndustryForm && (
//             <div className="card p-3 mb-4">
//               <h5>{industryFormData.id ? 'Edit Industry' : 'Add New Industry'}</h5>
//               <input
//                 type="text"
//                 className="form-control my-2"
//                 placeholder="Industry Name"
//                 value={industryFormData.industry_name}
//                 onChange={(e) => setIndustryFormData({ ...industryFormData, industry_name: e.target.value })}
//               />
//               <div>
//                 <button className="btn btn-secondary me-2" onClick={() => setShowIndustryForm(false)}>Cancel</button>
//                 <button className="btn btn-primary" onClick={handleIndustrySubmit}>Save</button>
//               </div>
//             </div>
//           )}
          
//           {loading && industries.length === 0 ? <p>Loading industries...</p> : (
//             <div className="table-responsive">
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {industries.map((ind) => (
//                     <tr key={ind.id}>
//                       <td>{ind.id}</td>
//                       <td>{ind.industry_name}</td>
//                       <td>
//                         <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditIndustry(ind)}>Edit</button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleDeleteIndustry(ind.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                   {industries.length === 0 && !loading && (
//                       <tr>
//                         <td colSpan="3" className="text-center">No industries found.</td>
//                       </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}



//       {/* Create/Update Position Tab */}
//       {activeTab === 'create-position' && (
//         <div className="card p-4 mb-4">
//           <h3>{positionFormData.id ? 'Edit Position' : 'Add New Position'}</h3>
//           <div className="mb-3">
//             <label>Industry</label>
//             <select
//               className="form-select"
//               value={positionFormData.industry_id}
//               onChange={(e) => setPositionFormData({ ...positionFormData, industry_id: e.target.value })}
//             >
//               <option value="">Select Industry</option>
//               {industries.map((ind) => (
//                 <option key={ind.id} value={ind.id}>{ind.industry_name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label>Position Title</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Position Title"
//               value={positionFormData.position_name}
//               onChange={(e) => setPositionFormData({ ...positionFormData, position_name: e.target.value })}
//             />
//           </div>

//           <div className="mb-3">
//             <label>Description</label>
//             <textarea
//               className="form-control"
//               rows="3"
//               placeholder="Description"
//               value={positionFormData.description}
//               onChange={(e) => setPositionFormData({ ...positionFormData, description: e.target.value })}
//             />
//           </div>

//           <div className="mb-3">
//             <label>Image (Optional)</label>
//             <input
//               type="file"
//               className="form-control"
//               accept="image/*"
//               // When selecting a file, update the state with the File object
//               onChange={(e) => setPositionFormData({ ...positionFormData, image_position: e.target.files[0] })}
//             />
//              {positionFormData.id && <small className="text-muted">Upload a new image to replace the current one.</small>}
//           </div>

//           <div className="mb-3">
//             <button className="btn btn-secondary me-2" onClick={() => {
//                 setActiveTab('position');
//                 handleAddPosition(); // Reset form state
//             }}>Cancel</button>
//             <button className="btn btn-primary" onClick={handlePositionSubmit}>
//                 {positionFormData.id ? 'Update' : 'Add'} Position
//             </button>
//           </div>

//           <h5 className="mt-4">All Positions</h5>
//           {loading && position.length === 0 ? <p>Loading...</p> : (
//             <div className="table-responsive mt-2">
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Title</th>
//                     <th>Industry</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {position.map((p) => (
//                     <tr key={p.id}>
//                       <td>{p.id}</td>
//                       <td>{p.position_name}</td>
//                       <td>{p.industry}</td>
//                       <td>
//                         <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditPosition(p)}>Edit</button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleDeletePosition(p.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                   {position.length === 0 && !loading && (
//                       <tr>
//                         <td colSpan="4" className="text-center">No position found.</td>
//                       </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PositionManagement;




// src/pages/PositionManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/components/positionmanagement.css';

const PositionManagement = () => {
  const [activeTab, setActiveTab] = useState('position');
  const [industries, setIndustries] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Industry form state
  const [showIndustryForm, setShowIndustryForm] = useState(false);
  const [industryFormData, setIndustryFormData] = useState({
    id: null,
    industry_name: '',
  });

  // Position form state
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [positionFormData, setPositionFormData] = useState({
    id: null,
    industry_id: '',
    position_name: '',
    description: '',
    image_position: null,
  });

  useEffect(() => {
    fetchIndustries();
    fetchPositions();
  }, []);

  // --- Fetch Industries ---
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/industry'); 
      setIndustries(response.data);
    } catch (error) {
      console.error('Error fetching industries:', error);
      alert('Failed to fetch industries.');
    } finally {
      setLoading(false);
    }
  };

  // --- Industry Handlers ---
  const handleAddIndustry = () => {
    setIndustryFormData({ id: null, industry_name: '' });
    setShowIndustryForm(true);
  };

  const handleEditIndustry = (industry) => {
    setIndustryFormData({
      id: industry.id,
      industry_name: industry.industry_name
    });
    setShowIndustryForm(true);
  };

  const handleDeleteIndustry = async (id) => {
    if (!window.confirm('Delete this industry?')) return;
    await api.delete(`/admin/industry/${id}`);
    fetchIndustries();
  };

  const handleIndustrySubmit = async () => {
    if (!industryFormData.industry_name.trim()) {
      alert('Industry name required');
      return;
    }

    try {
      if (industryFormData.id) {
        await api.put(`/admin/industry/${industryFormData.id}`, industryFormData);
        alert('✅ Industry updated successfully');
      } else {
        await api.post('/admin/industry', industryFormData);
        alert('✅ Industry created successfully');
      }
      setShowIndustryForm(false);
      fetchIndustries();
    } catch (error) {
      console.error('Industry save error:', error.response?.data || error.message);
      alert(error.response?.data?.message || '❌ Failed to save industry');
    }
  };

  // --- Fetch Positions ---
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/position'); 
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching position:', error);
      alert('Failed to fetch position.');
    } finally {
      setLoading(false);
    }
  };

  // --- Position Handlers ---
  const handleAddPosition = () => {
    setPositionFormData({
      id: null,
      industry_id: '',
      position_name: '',
      description: '',
      image_position: null,
    });
    setShowPositionForm(true);
  };

  const handleEditPosition = (position) => {
    setPositionFormData({
      id: position.id,
      industry_id: String(position.industry_id),
      position_name: position.position_name,
      description: position.description,
      image_position: null,
    });
    setShowPositionForm(true);
    setActiveTab('create-position');
  };

  const handleDeletePosition = async (id) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      await api.delete(`/admin/position/${id}`);
      fetchPositions();
      alert('Position deleted successfully');
    } catch (error) {
      console.error('Error deleting position:', error);
      alert('Failed to delete position');
    }
  };

  const handlePositionSubmit = async () => {
    if (!positionFormData.position_name.trim() || !positionFormData.industry_id) {
      alert('Position title and industry are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('industry_id', positionFormData.industry_id);
      formData.append('position_name', positionFormData.position_name);
      formData.append('description', positionFormData.description || '');
      if (positionFormData.image_position instanceof File) {
        formData.append('image_position', positionFormData.image_position);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (positionFormData.id) {
        await api.put(`/admin/position/${positionFormData.id}`, formData, config);
        alert('Position updated successfully');
      } else {
        await api.post('/admin/position', formData, config);
        alert('Position created successfully');
      }

      setShowPositionForm(false);
      fetchPositions();
      setPositionFormData({
        id: null,
        industry_id: '',
        position_name: '',
        description: '',
        image_position: null,
      });
      setActiveTab('position');
    } catch (error) {
      console.error('Error saving position:', error.response ? error.response.data : error.message);
      alert('Failed to save position. Check console for details.');
    }
  };

  // --- Pagination Logic ---
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPositions = positions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(positions.length / itemsPerPage);

  // --- Render ---
  return (
    <div className="position-management-container">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'position' ? 'active' : ''}`}
            onClick={() => setActiveTab('position')}
          >
            View Positions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'industry' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('industry');
              setShowIndustryForm(false);
            }}
          >
            Manage Industries
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'create-position' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('create-position');
              handleAddPosition();
            }}
          >
            Create/Update Position
          </button>
        </li>
      </ul>

      {/* Positions Tab */}
      {activeTab === 'position' && (
        <div className="card p-4 mb-4">
          <h3>All Positions</h3>
          {loading && positions.length === 0 ? <p>Loading...</p> : (
            <>
              <div className="table-responsive mt-3">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Title</th>
                      <th>Industry</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPositions.map((p, index) => (
                      <tr key={p.id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{p.position_name}</td>
                        <td>{p.industry}</td>
                        <td>{p.description}</td>
                        <td>
                          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditPosition(p)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeletePosition(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {positions.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="text-center">No positions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* Industries Tab */}
      {activeTab === 'industry' && (
        <div className="card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Industry Management</h3>
            <button className="btn btn-success" onClick={handleAddIndustry}>+ Add Industry</button>
          </div>

          {showIndustryForm && (
            <div className="card p-3 mb-4">
              <h5>{industryFormData.id ? 'Edit Industry' : 'Add New Industry'}</h5>
              <input
                type="text"
                className="form-control my-2"
                placeholder="Industry Name"
                value={industryFormData.industry_name}
                onChange={(e) => setIndustryFormData({ ...industryFormData, industry_name: e.target.value })}
              />
              <div>
                <button className="btn btn-secondary me-2" onClick={() => setShowIndustryForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleIndustrySubmit}>Save</button>
              </div>
            </div>
          )}
          
          {loading && industries.length === 0 ? <p>Loading industries...</p> : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {industries.map((ind, index) => (
                    <tr key={ind.id}>
                      <td>{index + 1}</td>
                      <td>{ind.industry_name}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditIndustry(ind)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteIndustry(ind.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {industries.length === 0 && !loading && (
                    <tr>
                      <td colSpan="3" className="text-center">No industries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create/Update Position Tab */}
      {activeTab === 'create-position' && (
        <div className="card p-4 mb-4">
          <h3>{positionFormData.id ? 'Edit Position' : 'Add New Position'}</h3>
          <div className="mb-3">
            <label>Industry</label>
            <select
              className="form-select"
              value={positionFormData.industry_id}
              onChange={(e) => setPositionFormData({ ...positionFormData, industry_id: e.target.value })}
            >
              <option value="">Select Industry</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.industry_name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Position Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Position Title"
              value={positionFormData.position_name}
              onChange={(e) => setPositionFormData({ ...positionFormData, position_name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Description"
              value={positionFormData.description}
              onChange={(e) => setPositionFormData({ ...positionFormData, description: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Image (Optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPositionFormData({ ...positionFormData, image_position: e.target.files[0] })}
            />
            {positionFormData.id && <small className="text-muted">Upload a new image to replace the current one.</small>}
          </div>

          <div className="mb-3">
            <button className="btn btn-secondary me-2" onClick={() => {
                setActiveTab('position');
                handleAddPosition();
            }}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePositionSubmit}>
                {positionFormData.id ? 'Update' : 'Add'} Position
            </button>
          </div>

          {/* Positions Table in Form Tab */}
          <h5 className="mt-4">All Positions</h5>
          <div className="table-responsive mt-2">
            <table className="table table-striped">
              <thead>
                <tr>
                   <th>Number</th>
                  <th>Title</th>
                  <th>Industry</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPositions.map((p, index) => (
                  <tr key={p.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{p.position_name}</td>
                    <td>{p.industry}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditPosition(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeletePosition(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="text-center">No positions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination in Form Tab */}
          <div className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionManagement;
