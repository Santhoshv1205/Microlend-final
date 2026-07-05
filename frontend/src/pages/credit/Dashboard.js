import React, { useEffect, useState } from 'react';
import { getApplications, getKyc, getAssessments } from '../../api';
import { StatCard, Spinner, PageHeader } from '../../utils';
import { useAuth } from '../../context/AuthContext';
export default function CreditDashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => {
    Promise.all([getApplications(), getKyc(), getAssessments()])
      .then(([a,k,as]) => setS({
        apps: (a.data.data||[]).filter(x=>['SUBMITTED','UNDER_REVIEW'].includes(x.status)).length,
        kyc: (k.data.data||[]).filter(x=>x.status==='PENDING').length,
        ass: (as.data.data||[]).length,
      }));
  }, []);
  if (!s) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Credit Officer Dashboard" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        <StatCard label="Pending Applications" value={s.apps} color="#7c3aed" />
        <StatCard label="KYC Awaiting Verification" value={s.kyc} color="#d97706" />
        <StatCard label="Assessments Created" value={s.ass} color="#15803d" />
      </div>
    </div>
  );
}
