import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD, fmt$ } from '../../utils';
import { getApplications, updateAppStatus } from '../../api';

export default function CreditApplications() {
  const { data, loading, reload } = useApi(getApplications);
  const [modal, setModal] = useState(null); // {id, action, remarks}
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState(null);

  async function doAction() {
    try {
      await updateAppStatus(modal.id, { status: modal.action, remarks });
      setMsg({ type:'ok', text:`Status → ${modal.action}` }); setModal(null); setRemarks(''); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  const actionBtn = (app, action, color) => (
    <Btn onClick={() => setModal({ id: app.applicationID, action })} color={color}
      style={{ padding:'4px 10px', fontSize:11, marginRight:4 }}>{action.replace('_',' ')}</Btn>
  );

  function actions(app) {
    if (app.status === 'SUBMITTED') return actionBtn(app,'UNDER_REVIEW','#7c3aed');
    if (app.status === 'UNDER_REVIEW') return <>{actionBtn(app,'APPROVED','#15803d')}{actionBtn(app,'REJECTED','#dc2626')}</>;
    return null;
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Loan Applications" sub="Review and approve applications" />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Borrower','Product','Amount','Date','Status','Actions']}
          rows={(data||[]).map(a => [a.applicationID, a.borrowerID, a.loanProductID,
            fmt$(a.requestedAmount), fmtD(a.applicationDate), <Badge text={a.status} />, actions(a)])}
        />
      </Card>
      <Modal open={!!modal} title={`Confirm: ${modal?.action}`} onClose={() => setModal(null)} onSave={doAction} saveLabel="Confirm">
        <p style={{ fontSize:13, color:'#374151', marginBottom:12 }}>
          Moving application <strong>{modal?.id}</strong> to <strong>{modal?.action}</strong>.
        </p>
        <Field label="Remarks (optional)" name="remarks" value={remarks}
          onChange={e => setRemarks(e.target.value)} rows={2} />
      </Modal>
    </div>
  );
}
