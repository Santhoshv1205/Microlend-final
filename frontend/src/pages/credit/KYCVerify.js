import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Alert, Spinner } from '../../utils';
import { getKyc, verifyKyc } from '../../api';
import { useAuth } from '../../context/AuthContext';
export default function KYCVerify() {
  const { user } = useAuth();
  const { data, loading, reload } = useApi(getKyc);
  const [msg, setMsg] = useState(null);
  async function verify(id, status) {
    try {
      await verifyKyc(id, status, user.userID);
      setMsg({ type:'ok', text:`KYC ${status}` }); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }
  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="KYC Verification" sub="Maker-checker: Field Officer uploads, Credit Officer verifies" />
      <div style={{ background:'#dbeafe', border:'1px solid #1d4ed8', borderRadius:8,
        padding:'10px 14px', marginBottom:16, fontSize:13, color:'#1e40af' }}>
        ℹ️ Only CREDIT_OFFICER can verify documents. Field Officers cannot access this.
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['KYC ID','Borrower ID','Type','Document Ref','Status','Actions']}
          rows={(data||[]).map(k => [k.kycID, k.borrowerID, k.documentType, k.documentRef||'—',
            <Badge text={k.status} />,
            k.status === 'PENDING' && <div style={{ display:'flex', gap:6 }}>
              <Btn onClick={() => verify(k.kycID, 'VERIFIED')} color="#15803d" style={{ padding:'4px 10px',fontSize:11 }}>Verify</Btn>
              <Btn onClick={() => verify(k.kycID, 'REJECTED')} color="#dc2626" style={{ padding:'4px 10px',fontSize:11 }}>Reject</Btn>
            </div>])}
        />
      </Card>
    </div>
  );
}
