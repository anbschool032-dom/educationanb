// src/pages/InvoiceManagement.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/components/invoicemanagement.css'; // your custom CSS

const mockInvoices = [
  { id: 'CB0001', user: 'Bjorn Erwin', date: '11-02-2025', amount: 44, commission: 4.4 },
  { id: 'CB0002', user: 'Sarah Johnson', date: '11-02-2025', amount: 75, commission: 7.5 },
  { id: 'CB0003', user: 'Michael Chen', date: '11-04-2025', amount: 80, commission: 8.0 },
  { id: 'CB0004', user: 'Emily Davis', date: '20-10-2025', amount: 40, commission: 4.0 },
  { id: 'CB0005', user: 'David Wilson', date: '11-02-2025', amount: 85, commission: 8.5 },
  { id: 'CB0006', user: 'Lisa Anderson', date: '12-02-2025', amount: 120, commission: 12.0 },
  { id: 'CB0007', user: 'Robert Taylor', date: '13-02-2025', amount: 150, commission: 15.0 },
  { id: 'CB0008', user: 'Jennifer Martinez', date: '14-02-2025', amount: 85, commission: 8.5 },
];

const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
const totalCommission = mockInvoices.reduce((sum, inv) => sum + inv.commission, 0);

const InvoiceManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 8; // all on one page for simplicity

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = mockInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(mockInvoices.length / invoicesPerPage);

  return (
    <div className="invoice-management p-4">
      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card card-stats bg-dark text-white p-3 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="small mb-1">Total Revenue</p>
                <h3>${totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="icon bg-success text-white rounded p-2">
                <i className="bi bi-currency-dollar fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card card-stats bg-dark text-white p-3 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="small mb-1">Total Commission</p>
                <h3>${totalCommission.toFixed(2)}</h3>
              </div>
              <div className="icon bg-success text-white rounded p-2">
                <i className="bi bi-currency-dollar fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary"
          placeholder="Search by invoice number, company, customer..."
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Users</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Commission</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="text-info">{inv.id}</td>
                <td>{inv.user}</td>
                <td>{inv.date}</td>
                <td>${inv.amount.toFixed(2)}</td>
                <td>${inv.commission.toFixed(2)}</td>
                <td>
                  <button className="btn btn-link text-white p-0">
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination pagination-dark">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default InvoiceManagement;
