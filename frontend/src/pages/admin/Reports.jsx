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

function PercentLabel({ cx, cy, midAngle, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

function toSeries(chart) {
  if (!chart) return [];
  return chart.labels.map((label, i) => ({ name: label, value: chart.values[i] }));
}

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [compactCharts, setCompactCharts] = useState(() => window.innerWidth < 576);
  useEffect(() => { adminApi.reports().then(setData).catch((e) => setError(apiMessage(e))); }, []);
  useEffect(() => {
    const update = () => setCompactCharts(window.innerWidth < 576);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (error) return <Notice type="danger" message={error} />;
  if (!data) return <Loader />;

  const usersByRole = toSeries(data.usersByRole);
  const appsByStatus = toSeries(data.applicationsByStatus);

  return (
    <div>
      <h4 className="mb-3">Statistics</h4>

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
              <ResponsiveContainer width="100%" height={compactCharts ? 245 : 280}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={compactCharts ? 82 : 100}
                    label={compactCharts ? false : PercentLabel}
                    labelLine={{ stroke: '#000' }}
                  >
                    {usersByRole.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
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
              <ResponsiveContainer width="100%" height={compactCharts ? 245 : 280}>
                <BarChart data={appsByStatus} margin={compactCharts ? { top: 8, right: 4, left: -20, bottom: 22 } : undefined}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: compactCharts ? 10 : 12 }} angle={compactCharts ? -18 : 0} textAnchor={compactCharts ? 'end' : 'middle'} interval={0} />
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
