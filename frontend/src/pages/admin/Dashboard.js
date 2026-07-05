import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUsers, getBorrowers, getProducts, getAuditLogs } from '../../api';
import { StatCard, Spinner, Card, PageHeader, DataTable, fmtDT } from '../../utils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getBorrowers(), getProducts(), getAuditLogs()])
      .then(([u, b, p, l]) => {
        setStats({ users: u.data.data?.length, borrowers: b.data.data?.length, products: p.data.data?.length });
        setLogs((l.data.data || []).slice(0, 10));
      }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Admin Dashboard — MicroLend" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Staff" value={stats?.users ?? 0} color="#1d4ed8" />
        <StatCard label="Borrowers" value={stats?.borrowers ?? 0} color="#15803d" />
        <StatCard label="Loan Products" value={stats?.products ?? 0} color="#7c3aed" />
      </div>
      <Card>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Recent Audit Logs</h3>
        <DataTable
          headers={['ID','User ID','Module','Action','Timestamp']}
          rows={logs.map(l => [l.auditID, l.userID || 'SYSTEM', l.module, l.action, fmtDT(l.timestamp)])}
        />
      </Card>
    </div>
  );
}
