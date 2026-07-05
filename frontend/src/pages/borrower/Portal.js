import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoansByBorrower, getUnreadNotifs } from '../../api';
import { StatCard, PageHeader, Card, Spinner, fmt$, Badge } from '../../utils';

export default function BorrowerPortal() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowerID, setBorID] = useState(null);

  useEffect(() => {
    // For borrower portal: fetch loans by userID-mapped borrowerID
    // We fetch all loans and filter, or use a known borrowerID
    // Try GET /api/loan-accounts/borrower/{id} with userID as fallback
    const fetchData = async () => {
      try {
        const r = await getLoansByBorrower(user.userID);
        setLoans(r.data.data || []);
      } catch {}
      try {
        const n = await getUnreadNotifs(user.userID);
        setNotifs(n.data.data || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [user.userID]);

  if (loading) return <Spinner />;
  const active = loans.filter(l => l.status === 'ACTIVE');
  const totalOutstanding = active.reduce((s,l) => s + Number(l.outstandingPrincipal||0), 0);

  return (
    <div style={{ padding:24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Your Borrower Portal" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Active Loans" value={active.length} color="#1d4ed8" />
        <StatCard label="Total Outstanding" value={fmt$(totalOutstanding)} color="#dc2626" />
        <StatCard label="Unread Notifications" value={notifs.length} color="#d97706" />
      </div>
      {active.length > 0 && (
        <Card>
          <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700 }}>Active Loans</h3>
          {active.map(l => (
            <div key={l.loanAccountID} style={{ background:'#f8fafc', borderRadius:8,
              padding:'14px 16px', marginBottom:10, border:'1px solid #e2e8f0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <span style={{ fontWeight:700 }}>Account #{l.loanAccountID}</span>
                  <Badge text={l.status} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:18, fontWeight:800, color:'#dc2626' }}>{fmt$(l.outstandingPrincipal)}</div>
                  <div style={{ fontSize:11, color:'#64748b' }}>outstanding</div>
                </div>
              </div>
              <div style={{ marginTop:8, fontSize:12, color:'#475569' }}>
                Disbursed: {fmt$(l.disbursedAmount)} · DPD: {l.dpd||0} days
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
