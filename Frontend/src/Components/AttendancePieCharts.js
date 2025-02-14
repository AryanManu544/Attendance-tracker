// src/Components/AttendancePieCharts.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const AttendancePieCharts = ({ attendanceRecords = [] }) => {
  // Group attendance records by subject (assumed to be stored in "className")
  const groupedData = attendanceRecords.reduce((groups, record) => {
    const subject = record.className;
    if (!groups[subject]) {
      groups[subject] = { present: 0, absent: 0 };
    }
    if (record.status === 'present') {
      groups[subject].present += 1;
    } else if (record.status === 'absent') {
      groups[subject].absent += 1;
    }
    return groups;
  }, {});

  // Chart options – disable aspect ratio maintenance so the container controls size
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container">
      <div className="row">
        {Object.keys(groupedData).map((subject) => {
          const dataForSubject = groupedData[subject];
          const total = dataForSubject.present + dataForSubject.absent;
          const presentPercentage = total ? ((dataForSubject.present / total) * 100).toFixed(1) : 0;
          const absentPercentage = total ? ((dataForSubject.absent / total) * 100).toFixed(1) : 0;

          const chartData = {
            labels: ['Present', 'Absent'],
            datasets: [
              {
                data: [dataForSubject.present, dataForSubject.absent],
                backgroundColor: ['#28a745', '#dc3545'], // green and red
                hoverBackgroundColor: ['#218838', '#c82333'],
              },
            ],
          };

          return (
            <div key={subject} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{subject} Attendance</h5>
                </div>
                <div className="card-body">
                  <div style={{ width: '100%', height: '200px' }}>
                    <Pie data={chartData} options={options} />
                  </div>
                  <p className="text-center mt-3">
                    Present: {presentPercentage}% | Absent: {absentPercentage}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePieCharts;
