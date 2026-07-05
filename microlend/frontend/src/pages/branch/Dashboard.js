import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateReport, getReports, getLoanAccounts, getDelinquencies } from '../../api';
import { StatCard, Spinner, PageHeader, Card, Btn, Alert, fmt$, fmtD } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BranchDashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { getReports().then(r => setReports(r.data.data||[])); }, []);

  async function generate() {
    setLoading(true);
    try {
      const r = await generateReport('BRANCH', user.branchID||1);
      setReport(r.data.data);
      const all = await getReports(); setReports(all.data.data||[]);
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
    finally { setLoading(false); }
  }

  const chartData = report ? [
    { name:'Outstanding', value: Number(report.totalOutstanding)||0 },
    { name:'Disbursed', value: Number(report.disbursementValue)||0 },
  ] : [];

  return (
    <div style={{ padding:24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Branch Manager Dashboard"
        action={<Btn onClick={generate} color="#15803d">{loading ? '⏳ Generating…' : '↻ Generate Report'}</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />

      {report && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, marginBottom:20 }}>
            <StatCard label="Active Loans" value={report.activeLoanCount||0} color="#1d4ed8" />
            <StatCard label="Total Outstanding" value={fmt$(report.totalOutstanding)} color="#15803d" />
            <StatCard label="NPA %" value={`${report.npaPercent||0}%`} color={Number(report.npaPercent)>0?'#dc2626':'#15803d'} />
            <StatCard label="PAR 30%" value={`${report.par30||0}%`} color="#d97706" />
            <StatCard label="PAR 90%" value={`${report.par90||0}%`} color="#dc2626" />
          </div>
          <Card>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={v=>'₹'+Number(v/1000).toFixed(0)+'K'} />
                <Tooltip formatter={v=>fmt$(v)} />
                <Bar dataKey="value" fill="#1d4ed8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      <Card>
        <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700 }}>Report History</h3>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr>
            {['ID','Scope','Active Loans','Outstanding','NPA%','Date'].map(h=>(
              <th key={h} style={{ padding:'7px 10px', textAlign:'left', background:'#f8fafc',
                borderBottom:'2px solid #e2e8f0', fontWeight:600, color:'#374151' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {reports.map((r,i) => (
              <tr key={r.reportID} style={{ background:i%2===0?'#fff':'#f8fafc' }}>
                <td style={{ padding:'7px 10px' }}>{r.reportID}</td>
                <td style={{ padding:'7px 10px' }}>{r.scope}</td>
                <td style={{ padding:'7px 10px' }}>{r.activeLoanCount}</td>
                <td style={{ padding:'7px 10px' }}>{fmt$(r.totalOutstanding)}</td>
                <td style={{ padding:'7px 10px', color:Number(r.npaPercent)>0?'#dc2626':'#15803d', fontWeight:700 }}>{r.npaPercent||0}%</td>
                <td style={{ padding:'7px 10px' }}>{fmtD(r.generatedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
