import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoansByBorrower, getSchedule } from '../../api';
import { PageHeader, Card, Badge, Spinner, fmt$, fmtD } from '../../utils';

export default function BorrowerSchedule() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoansByBorrower(user.userID).then(r => {
      const ls = r.data.data || [];
      setLoans(ls);
      const active = ls.find(l => l.status === 'ACTIVE') || ls[0];
      if (active) { setSelectedLoan(active); fetchSchedule(active.loanAccountID); }
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, [user.userID]);

  async function fetchSchedule(id) {
    setLoading(true);
    try {
      const r = await getSchedule(id);
      setSchedule(r.data.data || []);
    } finally { setLoading(false); }
  }

  const paid = schedule.filter(s=>s.status==='PAID').length;
  const partial = schedule.filter(s=>s.status==='PARTIAL').length;
  const overdue = schedule.filter(s=>s.status==='OVERDUE').length;
  const pending = schedule.filter(s=>s.status==='PENDING').length;

  const statusBg = s => ({ PAID:'#dcfce7', PARTIAL:'#fef3c7', OVERDUE:'#fee2e2', PENDING:'#f8fafc', WAIVED:'#cffafe' }[s]||'#fff');

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Repayment Schedule" sub={`Account #${selectedLoan?.loanAccountID||'—'}`} />
      {schedule.length > 0 && (
        <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
          {[['Total',schedule.length,'#1d4ed8'],['Paid',paid,'#15803d'],['Partial',partial,'#d97706'],['Overdue',overdue,'#dc2626'],['Pending',pending,'#64748b']].map(([l,v,c])=>(
            <div key={l} style={{ background:c+'22', borderRadius:8, padding:'8px 16px', textAlign:'center', border:`1px solid ${c}44` }}>
              <div style={{ fontWeight:800, fontSize:20, color:c }}>{v}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      <Card>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr>{['#','Due Date','Principal','Interest','Total Due','Paid','Paid Date','Status'].map(h=>(
                <th key={h} style={{ padding:'8px 10px', textAlign:'left', background:'#f8fafc',
                  borderBottom:'2px solid #e2e8f0', fontWeight:600, color:'#374151' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {schedule.map(s => (
                <tr key={s.scheduleID} style={{ background: statusBg(s.status) }}>
                  <td style={{ padding:'8px 10px', fontWeight:700 }}>{s.installmentNumber}</td>
                  <td style={{ padding:'8px 10px' }}>{fmtD(s.dueDate)}</td>
                  <td style={{ padding:'8px 10px' }}>{fmt$(s.principalDue)}</td>
                  <td style={{ padding:'8px 10px' }}>{fmt$(s.interestDue)}</td>
                  <td style={{ padding:'8px 10px', fontWeight:600 }}>{fmt$(s.totalDue)}</td>
                  <td style={{ padding:'8px 10px' }}>{fmt$(s.amountPaid)}</td>
                  <td style={{ padding:'8px 10px' }}>{fmtD(s.paidDate)}</td>
                  <td style={{ padding:'8px 10px' }}><Badge text={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
