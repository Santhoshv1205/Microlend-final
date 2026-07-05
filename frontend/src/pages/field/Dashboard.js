import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBorrowers, getCentres, getGroups, getMeetings } from '../../api';
import { StatCard, Spinner, PageHeader } from '../../utils';

export default function FieldDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => {
    Promise.all([getBorrowers(), getCentres(), getGroups(), getMeetings()])
      .then(([b,c,g,m]) => setStats({
        borrowers: b.data.data?.length,
        centres: c.data.data?.length,
        groups: g.data.data?.length,
        meetings: (m.data.data||[]).filter(x=>x.status==='SCHEDULED').length,
      }));
  }, []);
  if (!stats) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Field Officer Dashboard" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        <StatCard label="Borrowers" value={stats.borrowers} color="#15803d" />
        <StatCard label="Centres" value={stats.centres} color="#0891b2" />
        <StatCard label="Groups" value={stats.groups} color="#7c3aed" />
        <StatCard label="Upcoming Meetings" value={stats.meetings} color="#d97706" />
      </div>
    </div>
  );
}
