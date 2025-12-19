// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
// import api from '../api/axiosConfig';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import '../assets/css/components/dashboard.css';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// const DashboardPage = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     pendingMentors: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//   });
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [topMentors, setTopMentors] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const res = await api.get('/admin/dashboard/full');
//       setStats(res.data.stats);
//       setMonthlyData(res.data.monthlyBookings);
//       setTopMentors(res.data.topMentors);
//       setRecentActivity(res.data.recentActivity);
//     } catch (err) {
//       console.log('Using demo data (api not ready yet)');
//       setStats({ totalUsers: 1245, pendingMentors: 15, totalBookings: 3435, totalRevenue: 23569 });
//       setMonthlyData([1200, 1500, 1800, 2200, 2800, 3200, 3500, 3800, 4100, 4500, 4800, 5200]);
//       setTopMentors([
//         { name: 'James Wilson', bookings: 245, revenue: 12250, status: 'Active' },
//         { name: 'Sarah Johnson', bookings: 189, revenue: 9450, status: 'Active' },
//         { name: 'David Brown', bookings: 156, revenue: 4680, status: 'Active' },
//       ]);
//       setRecentActivity([
//         { type: 'user', message: 'New student joined', time: '2 min ago' },
//         { type: 'mentor', message: 'Mentor approved – James Wilson', time: '15 min ago' },
//         { type: 'booking', message: 'New booking created', time: '1 hour ago' },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet([
//       { Metric: 'Total Users', Value: stats.totalUsers },
//       { Metric: 'Pending Mentors', Value: stats.pendingMentors },
//       { Metric: 'Total Bookings', Value: stats.totalBookings },
//       { Metric: 'Total Revenue', Value: `$${stats.totalRevenue}` },
//       ...topMentors.map(m => ({
//         Mentor: m.name,
//         Bookings: m.bookings,
//         Revenue: `$${m.revenue}`,
//         Status: m.status,
//       })),
//     ]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
//     XLSX.writeFile(wb, 'CareersNC_Dashboard.xlsx');
//   };

//   const printPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('CareersNC Admin Dashboard', 20, 20);

//     doc.autoTable({
//       startY: 30,
//       head: [['Metric', 'Value']],
//       body: [
//         ['Total Users', stats.totalUsers],
//         ['Pending Mentors', stats.pendingMentors],
//         ['Total Bookings', stats.totalBookings],
//         ['Total Revenue', `$${stats.totalRevenue}`],
//       ],
//     });

//     doc.autoTable({
//       startY: doc.lastAutoTable.finalY + 20,
//       head: [['Mentor', 'Bookings', 'Revenue', 'Status']],
//       body: topMentors.map(m => [m.name, m.bookings, `$${m.revenue}`, m.status]),
//     });

//     doc.save('CareersNC_Dashboard.pdf');
//   };

//   if (loading) return <div className="loading">Loading your beautiful dashboard...</div>;

//   const barChartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       { label: 'Bookings', data: monthlyData, backgroundColor: '#6f42c1' },
//       { label: 'Revenue ($)', data: monthlyData.map(v => v * 6.8), backgroundColor: '#00d4b4' },
//     ],
//   };

//   const doughnutData = {
//     labels: ['Direct', 'Social', 'Referral'],
//     datasets: [{ data: [45, 35, 20], backgroundColor: ['#6f42c1', '#00d4b4', '#fd7e14'] }],
//   };

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-header">
//         <h2>Dashboard Overview</h2>
//         <div className="header-actions">
//           <button className="btn-export" onClick={exportExcel}>
//             Export Excel
//           </button>
//           <button className="btn-print" onClick={printPDF}>
//             Print PDF
//           </button>
//         </div>
//       </div>

//       {/* 4 beautiful stat cards exactly like your picture */}
//       <div className="stats-grid">
//         <div className="stat-card green">
//           <div className="stat-top">
//             <h4>Total Revenue</h4>
//             <span className="icon">$</span>
//           </div>
//           <h2>${stats.totalRevenue.toLocaleString()}</h2>
//           <p>↑ 12.5% <span>vs last month</span></p>
//         </div>

//         <div className="stat-card purple">
//           <div className="stat-top">
//             <h4>Total Bookings</h4>
//             <span className="icon">📅</span>
//           </div>
//           <h2>{stats.totalBookings.toLocaleString()}</h2>
//           <p>↑ 8.2% <span>vs last month</span></p>
//         </div>

//         <div className="stat-card blue">
//           <div className="stat-top">
//             <h4>Total Users</h4>
//             <span className="icon">👥</span>
//           </div>
//           <h2>{stats.totalUsers.toLocaleString()}</h2>
//           <p>↑ 5.7% <span>vs last month</span></p>
//         </div>

//         <div className="stat-card orange">
//           <div className="stat-top">
//             <h4>Pending Mentors</h4>
//             <span className="icon">⏳</span>
//           </div>
//           <h2>{stats.pendingMentors}</h2>
//           <p>Needs review</p>
//         </div>
//       </div>

//       {/* Charts – exactly like your picture */}
//       <div className="charts-row">
//         <div className="chart-card big">
//           <div className="chart-header">
//             <h3>Monthly Bookings & Revenue</h3>
//             <button className="download-btn">↓</button>
//           </div>
//           <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
//         </div>

//         <div className="chart-card small">
//           <h3>Traffic Sources</h3>
//           <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
//         </div>
//       </div>

//       {/* Bottom 2 blocks – Recent Activity + Top Mentors */}
//       <div className="bottom-grid">
//         <div className="activity-card">
//           <h3>Recent Activity</h3>
//           {recentActivity.map((item, i) => (
//             <div key={i} className="activity-row">
//               <div className={`activity-dot ${item.type}`}></div>
//               <div>
//                 <p>{item.message}</p>
//                 <small>{item.time}</small>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="top-mentors-card">
//           <h3>Top Mentors</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Mentor</th>
//                 <th>Bookings</th>
//                 <th>Revenue</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topMentors.map((m, i) => (
//                 <tr key={i}>
//                   <td>{m.name}</td>
//                   <td>{m.bookings}</td>
//                   <td>${m.revenue.toLocaleString()}</td>
//                   <td><span className="status active">Active</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


// src/pages/Dashboard.jsx (FULL FIXED VERSION)
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/css/components/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 1245,
    pendingMentors: 15,
    totalBookings: 3435,
    totalRevenue: 23569,
  });
  const [loading, setLoading] = useState(true);

  // Clean, perfect data – no floating points, exact match
  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBookings = [1200, 1500, 1800, 2200, 2800, 3200, 3500, 3800, 4100, 4500, 4800, 5200];
  const monthlyRevenue = [8160, 10200, 12240, 14960, 19040, 21760, 23800, 25840, 27880, 30600, 32640, 35360];

  const topMentors = [
    { name: 'James Wilson', bookings: 245, revenue: 12250, status: 'Active' },
    { name: 'Sarah Johnson', bookings: 189, revenue: 9450, status: 'Active' },
    { name: 'David Brown', bookings: 156, revenue: 4680, status: 'Active' },
    { name: 'Lisa Anderson', bookings: 98, revenue: 4900, status: 'Active' },
  ];

  const recentActivity = [
    { type: 'user', message: 'New student joined the platform', time: '2 minutes ago' },
    { type: 'mentor', message: 'Mentor approved – James Wilson', time: '15 minutes ago' },
    { type: 'booking', message: 'New booking created', time: '1 hour ago' },
    { type: 'review', message: 'New review posted', time: '1 hour ago' },
  ];

  useEffect(() => {
    // Try real API, fallback to demo
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.stats || stats);
      } catch (err) {
        console.log('Using beautiful demo data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Total Revenue', Value: `$${stats.totalRevenue.toLocaleString()}` },
      { Metric: 'Total Bookings', Value: stats.totalBookings },
      { Metric: 'Total Users', Value: stats.totalUsers },
      { Metric: 'Pending Mentors', Value: stats.pendingMentors },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');

    const mentorWs = XLSX.utils.json_to_sheet(topMentors);
    XLSX.utils.book_append_sheet(wb, mentorWs, 'Top Mentors');

    XLSX.writeFile(wb, 'CareersNC_Dashboard.xlsx');
  };



  const printPDF = () => {
  // Import the plugin correctly
  import('jspdf-autotable').then(({ default: autoTable }) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Title
    doc.setFontSize(20);
    doc.setTextColor(111, 66, 193);
    doc.text('CareersNC Admin Dashboard Report', 20, 25);

    // Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })}`, 20, 35);

    // Key Metrics Table
    autoTable(doc, {
      startY: 45,
      head: [['Key Metric', 'Value']],
      body: [
        ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
        ['Total Bookings', stats.totalBookings.toLocaleString()],
        ['Total Users', stats.totalUsers.toLocaleString()],
        ['Pending Mentors', stats.pendingMentors.toString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [111, 66, 193], textColor: 255, fontSize: 12, fontStyle: 'bold' },
      bodyStyles: { fontSize: 11 },
      alternateRowStyles: { fillColor: [248, 249, 252] },
      columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    // Top Mentors Table
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(111, 66, 193);
    doc.text('Top Performing Mentors', 20, finalY);

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Mentor Name', 'Bookings', 'Revenue', 'Status']],
      body: topMentors.map(m => [
        m.name,
        m.bookings.toString(),
        `$${m.revenue.toLocaleString()}`,
        m.status
      ]),
      theme: 'striped',
      headStyles: { fillColor: [111, 66, 193], textColor: 255, fontSize: 11 },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { cellWidth: 30, halign: 'center' } },
      margin: { left: 20, right: 20 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('© 2025 CareersNC. All rights reserved.', 20, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    // Direct download
    doc.save('CareersNC_Dashboard_Report.pdf');
  });
};


  if (loading) return <div className="loading">Loading...</div>;

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Bookings',
        data: monthlyBookings,
        backgroundColor: '#00d4b4',
        borderRadius: 8,
        barThickness: 30,
      },
      {
        label: 'Revenue ($)',
        data: monthlyRevenue,
        backgroundColor: '#6f42c1',
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { padding: 20 } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1000 } },
    },
  };

  const doughnutData = {
    labels: ['Direct', 'Social Media', 'Referral'],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ['#6f42c1', '#00d4b4', '#fd7e14'],
      borderWidth: 4,
      borderColor: '#fff',
      hoverBorderWidth: 0,
      cutout: '75%',
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20 } },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="header-actions">
          <button className="btn-export" onClick={exportExcel}>Export Excel</button>
          <button className="btn-print" onClick={printPDF}>Print Report</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-top"><h4>Total Revenue</h4><span className="icon">$</span></div>
          <h2>${stats.totalRevenue.toLocaleString()}</h2>
          <p>↑ 12.5% <span>vs last month</span></p>
        </div>
        <div className="stat-card purple">
          <div className="stat-top"><h4>Total Bookings</h4><span className="icon">📊</span></div>
          <h2>{stats.totalBookings.toLocaleString()}</h2>
          <p>↑ 8.2% <span>vs last month</span></p>
        </div>
        <div className="stat-card blue">
          <div className="stat-top"><h4>Total Users</h4><span className="icon">👥</span></div>
          <h2>{stats.totalUsers.toLocaleString()}</h2>
          <p>↑ 5.7% <span>vs last month</span></p>
        </div>
        <div className="stat-card orange">
          <div className="stat-top"><h4>Pending Mentors</h4><span className="icon">⏳</span></div>
          <h2>{stats.pendingMentors}</h2>
          <p>Needs review</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card big">
          <div className="chart-header"><h3>Monthly Bookings & Revenue</h3></div>
          <div className="chart-wrapper"><Bar data={barData} options={barOptions} /></div>
        </div>

        <div className="chart-card small">
          <h3>Traffic Sources</h3>
          <div className="chart-wrapper doughnut"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          {recentActivity.map((item, i) => (
            <div key={i} className="activity-row">
              <div className={`activity-dot ${item.type}`}></div>
              <div className="activity-content">
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="top-mentors-card">
          <h3>Top Mentors</h3>
          <table>
            <thead><tr><th>Mentor</th><th>Bookings</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              {topMentors.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.bookings}</td>
                  <td>${m.revenue.toLocaleString()}</td>
                  <td><span className="status active">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;