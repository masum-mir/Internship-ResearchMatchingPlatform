import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import { adminApi } from '../../api/adminApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';

const COLORS = ['#3b5bdb', '#37b24d', '#f59f00', '#e8590c', '#7048e8'];

function toSeries(chart) {
  if (!chart) return [];
  return chart.labels.map((label, i) => ({ name: label, value: chart.values[i] }));
}

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.reports().then(setData).catch((e) => setError(apiMessage(e))); }, []);

  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;

  const usersByRole = toSeries(data.usersByRole);
  const appsByStatus = toSeries(data.applicationsByStatus);

  return (
    <div>
      <h4 className="mb-3">Reports & Statistics</h4>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard label="Students" value={data.totalStudents} icon="bi-mortarboard" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Faculty" value={data.totalFaculty} icon="bi-person-badge" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Companies" value={data.totalCompanies} icon="bi-building" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard label="Applications" value={data.totalApplications} icon="bi-file-earmark-text" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Most applied internship</h6>
              <p className="h5 mb-0">{data.mostAppliedInternship}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Most popular skill</h6>
              <p className="h5 mb-0">{data.mostPopularSkill}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card report-card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Users by role</h6>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={usersByRole} dataKey="value" nameKey="name" outerRadius={100} label>
                    {usersByRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card report-card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Applications by status</h6>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={appsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b5bdb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
