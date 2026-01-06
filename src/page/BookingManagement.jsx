// // src/pages/BookingManagement.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/css/components/bookingmanagement.css';

// const BookingManagement = () => {
//   const [activeTab, setActiveTab] = useState('pending');
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   // Fetch bookings on component mount
//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // Fetch all bookings
//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/admin/bookings');
//       setBookings(response.data);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//       alert('Failed to fetch bookings.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter bookings based on active tab
//   const getFilteredBookings = () => {
//     switch (activeTab) {
//       case 'pending':
//         return bookings.filter(b => b.status === 'Pending');
//       case 'ongoing':
//         return bookings.filter(b => b.status === 'Accepted');
//       case 'history':
//         return bookings.filter(b => 
//           ['Completed', 'Cancelled', 'Rejected', 'Incomplete'].includes(b.status)
//         );
//       default:
//         return bookings;
//     }
//   };

//   const filteredBookings = getFilteredBookings();

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };
//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   // Reset to page 1 when changing tabs
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab]);

//   // Get status badge class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Pending':
//         return 'badge-pending';
//       case 'Accepted':
//         return 'badge-accepted';
//       case 'Completed':
//         return 'badge-completed';
//       case 'Cancelled':
//         return 'badge-cancelled';
//       case 'Rejected':
//         return 'badge-rejected';
//       case 'Incomplete':
//         return 'badge-incomplete';
//       default:
//         return 'badge-secondary';
//     }
//   };

//   // Handle view booking details
//   const handleViewDetails = (booking) => {
//     // Navigate to booking details page or open modal
//     console.log('View booking:', booking);
//     alert(`View details for booking: ${booking.booking_id}`);
//   };

//   // Get count for each tab
//   const getPendingCount = () => bookings.filter(b => b.status === 'Pending').length;
//   const getOngoingCount = () => bookings.filter(b => b.status === 'Accepted').length;
//   const getHistoryCount = () => bookings.filter(b => 
//     ['Completed', 'Cancelled', 'Rejected', 'Incomplete'].includes(b.status)
//   ).length;

//   return (
//     <div className="booking-management-container">
//       <div className="page-header">
//         <h2>Booking Management</h2>
//         <p className="text-muted">Manage and track all booking sessions</p>
//       </div>

//       {/* Tabs */}
//       <div className="booking-tabs">
//         <button
//           className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
//           onClick={() => setActiveTab('pending')}
//         >
//           Pending ({getPendingCount()})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
//           onClick={() => setActiveTab('ongoing')}
//         >
//           Ongoing ({getOngoingCount()})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
//           onClick={() => setActiveTab('history')}
//         >
//           History ({getHistoryCount()})
//         </button>
//       </div>

//       {/* Bookings Table */}
//       <div className="card booking-card">
//         {loading ? (
//           <div className="text-center p-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="table-responsive">
//               <table className="table booking-table">
//                 <thead>
//                   <tr>
//                     <th>Booking ID</th>
//                     <th>User Name</th>
//                     <th>Mentor Name</th>
//                     <th>Position</th>
//                     {activeTab !== 'pending' && <th>Start Date</th>}
//                     {activeTab !== 'pending' && <th>Start Time</th>}
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentBookings.length > 0 ? (
//                     currentBookings.map((booking) => (
//                       <tr key={booking.id}>
//                         <td className="fw-semibold">{booking.booking_id}</td>
//                         <td>{booking.user_name}</td>
//                         <td>{booking.mentor_name}</td>
//                         <td>{booking.position}</td>
//                         {activeTab !== 'pending' && (
//                           <td>{booking.start_date || 'N/A'}</td>
//                         )}
//                         {activeTab !== 'pending' && (
//                           <td>{booking.start_time || 'N/A'}</td>
//                         )}
//                         <td>
//                           <span className={`status-badge ${getStatusClass(booking.status)}`}>
//                             {booking.status}
//                           </span>
//                         </td>
//                         <td>
//                           <button
//                             className="btn-view"
//                             onClick={() => handleViewDetails(booking)}
//                             title="View Details"
//                           >
//                             <i className="bi bi-eye"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td 
//                         colSpan={activeTab === 'pending' ? '6' : '8'} 
//                         className="text-center py-5 text-muted"
//                       >
//                         No bookings found in this category.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {filteredBookings.length > 0 && (
//               <div className="pagination-container">
//                 <div className="pagination-info">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
//                 </div>
//                 <nav>
//                   <ul className="pagination mb-0">
//                     <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={prevPage}>
//                         Previous
//                       </button>
//                     </li>
//                     {[...Array(totalPages)].map((_, i) => (
//                       <li 
//                         key={i + 1} 
//                         className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
//                       >
//                         <button 
//                           className="page-link" 
//                           onClick={() => paginate(i + 1)}
//                         >
//                           {i + 1}
//                         </button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={nextPage}>
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingManagement;



import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ FIXED IMPORT HERE
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/components/bookingmanagement.css';

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // --- STATIC MOCK DATA ---
  const mockBookings = [
    {
      id: 1,
      booking_id: 'BK-2023-001',
      user_name: 'Sok Dara',
      user_email: 'sok.dara@student.com',
      mentor_name: 'Chea Vichea',
      position: 'Software Engineer',
      start_date: '2023-12-01',
      start_time: '14:00',
      status: 'Pending',
      amount: '$15.00',
      topic: 'Career Guidance',
      note: 'Need help with CV preparation.'
    },
    {
      id: 2,
      booking_id: 'BK-2023-002',
      user_name: 'Mey Srey',
      user_email: 'mey.srey@gmail.com',
      mentor_name: 'Ly Hora',
      position: 'Data Analyst',
      start_date: '2023-12-02',
      start_time: '09:00',
      status: 'Pending',
      amount: '$20.00',
      topic: 'Python Basics',
      note: 'Switching from Excel to Python.'
    },
    {
      id: 3,
      booking_id: 'BK-2023-003',
      user_name: 'Chan Tola',
      user_email: 'chan.tola@yahoo.com',
      mentor_name: 'Sam Rithy',
      position: 'Product Manager',
      start_date: '2023-11-28',
      start_time: '10:30',
      status: 'Accepted',
      amount: '$25.00',
      topic: 'Agile Workflow',
      note: 'How to manage sprints effectively.'
    },
    {
      id: 5,
      booking_id: 'BK-2023-005',
      user_name: 'Nhem Piseth',
      user_email: 'nhem.p@outlook.com',
      mentor_name: 'Ouk Vandeth',
      position: 'Cyber Security',
      start_date: '2023-10-15',
      start_time: '08:00',
      status: 'Completed',
      amount: '$30.00',
      topic: 'Security Audit',
      note: 'Session finished.'
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setBookings(mockBookings);
    setLoading(false);
  };

  // Filter Logic
  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'pending': return bookings.filter(b => b.status === 'Pending');
      case 'ongoing': return bookings.filter(b => b.status === 'Accepted');
      case 'history': return bookings.filter(b => ['Completed', 'Cancelled', 'Rejected'].includes(b.status));
      default: return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();
  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  // Status Styles
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  // --- 🖨️ EXPORT TO PDF FUNCTION (FIXED) ---
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // 1. Add Header
      doc.setFontSize(18);
      doc.text('CareerSync - Booking Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Category: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

      // 2. Prepare Data
      const tableColumn = ["ID", "Mentee", "Mentor", "Position", "Date", "Time", "Status", "Amount"];
      const tableRows = filteredBookings.map(b => [
        b.booking_id,
        b.user_name,
        b.mentor_name,
        b.position,
        b.start_date,
        b.start_time,
        b.status,
        b.amount
      ]);

      // 3. Generate Table (✅ Correct Usage)
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 44,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [79, 70, 229] }, // Brand Color
      });

      // 4. Save File
      doc.save(`bookings_${activeTab}_${new Date().toISOString().slice(0,10)}.pdf`);
    
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Failed to export PDF. Please check console for details.");
    }
  };

  // --- 📊 EXPORT TO EXCEL FUNCTION ---
  const exportToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Bookings");
    XLSX.writeFile(workBook, `bookings_export_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // --- 🖨️ PRINT MODAL FUNCTION ---
  const handlePrintModal = () => {
    const printContent = document.getElementById('printable-modal-content');
    const win = window.open('', '', 'height=700,width=800');
    win.document.write('<html><head><title>Print Booking</title>');
    win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
    win.document.write('</head><body >');
    win.document.write(printContent.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div className="booking-management-container">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Booking Management</h2>
          <p className="text-muted mb-0">Manage sessions, check details, and track income.</p>
        </div>
        
        {/* Export Actions */}
        <div className="d-flex gap-2">
           <Button variant="outline-danger" onClick={exportToPDF} className="d-flex align-items-center gap-2">
             <i className="bi bi-file-earmark-pdf"></i> Export PDF
           </Button>
           <Button variant="outline-success" onClick={exportToExcel} className="d-flex align-items-center gap-2">
             <i className="bi bi-file-earmark-excel"></i> Export Excel
           </Button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="custom-tabs-container mb-4">
        {['pending', 'ongoing', 'history'].map(tab => (
          <button
            key={tab}
            className={`custom-tab-pill ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <Badge bg={activeTab === tab ? 'light' : 'secondary'} text={activeTab === tab ? 'dark' : 'light'} className="ms-2">
              {bookings.filter(b => {
                if (tab === 'pending') return b.status === 'Pending';
                if (tab === 'ongoing') return b.status === 'Accepted';
                return ['Completed', 'Cancelled', 'Rejected'].includes(b.status);
              }).length}
            </Badge>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="card booking-card shadow-sm border-0">
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table booking-table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Booking ID</th>
                  <th>Mentee</th>
                  <th>Mentor</th>
                  <th>Position</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="ps-4 fw-bold text-primary">{booking.booking_id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2">{booking.user_name.charAt(0)}</div>
                          <div>
                            <div className="fw-semibold">{booking.user_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{booking.mentor_name}</td>
                      <td>{booking.position}</td>
                      <td>
                        <div className="small fw-bold">{booking.start_date}</div>
                        <div className="small text-muted">{booking.start_time}</div>
                      </td>
                      <td className="fw-bold text-success">{booking.amount}</td>
                      <td>
                        <Badge bg={getStatusVariant(booking.status)} className="px-3 py-2 rounded-pill">
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                         <Button 
                            variant="light" 
                            size="sm" 
                            className="btn-view-details"
                            onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                         >
                           <i className="bi bi-eye"></i> View
                         </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="text-center py-5 text-muted">No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ✨ PROFESSIONAL DETAILS MODAL --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="booking-modal-pro">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedBooking && (
            <div id="printable-modal-content" className="p-3">
              <p className="text-muted mb-4">Complete information about booking <span className="fw-bold text-dark">{selectedBooking.booking_id}</span></p>
              
              {/* Profile Section */}
              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                <div className="avatar-circle-lg me-3">{selectedBooking.user_name.charAt(0)}</div>
                <div>
                  <h5 className="mb-0 fw-bold">{selectedBooking.user_name}</h5>
                  <p className="mb-0 text-muted small">{selectedBooking.user_email}</p>
                </div>
                <div className="ms-auto">
                   <Badge bg={getStatusVariant(selectedBooking.status)} className="fs-6 px-3 py-2">
                     {selectedBooking.status}
                   </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Booking ID</label>
                  <div className="fs-5 fw-bold text-dark">{selectedBooking.booking_id}</div>
                </Col>
                 <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Topic</label>
                  <div className="fs-5 fw-bold text-dark">{selectedBooking.topic}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Position</label>
                  <div className="fs-5 text-dark">{selectedBooking.position}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Date & Time</label>
                  <div className="fs-5 text-dark">{selectedBooking.start_date} <span className="text-muted fs-6">at</span> {selectedBooking.start_time}</div>
                </Col>
                 <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Mentor</label>
                  <div className="fs-5 text-dark">{selectedBooking.mentor_name}</div>
                </Col>
                 <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold">Amount</label>
                  <div className="fs-5 fw-bold text-success">{selectedBooking.amount}</div>
                </Col>
              </Row>

              <hr />
              
              <div className="mt-3">
                <label className="text-muted small text-uppercase fw-bold mb-2">Notes</label>
                <div className="p-3 bg-white border rounded text-secondary">
                  {selectedBooking.note || "No notes available for this session."}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button variant="outline-secondary" onClick={handlePrintModal}>
            <i className="bi bi-printer me-2"></i> Print
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingManagement;