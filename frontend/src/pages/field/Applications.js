import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD, fmt$ } from '../../utils';
import { getApplications, getBorrowers, getGroups, getProducts, createApplication, submitApplication } from '../../api';

const EMPTY = { borrowerID:'', loanProductID:'', requestedAmount:'', purpose:'', groupID:'', creditOfficerID:'' };

export default function FieldApplications() {
  const { data, loading, reload } = useApi(getApplications);
  const { data: borrowers } = useApi(getBorrowers);
  const { data: products } = useApi(getProducts);
  const { data: groups } = useApi(getGroups);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await createApplication({ ...form, borrowerID: Number(form.borrowerID),
        loanProductID: Number(form.loanProductID), requestedAmount: Number(form.requestedAmount),
        groupID: form.groupID ? Number(form.groupID) : null,
        creditOfficerID: form.creditOfficerID ? Number(form.creditOfficerID) : null });
      setMsg({ type:'ok', text:'Application created as DRAFT' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  async function submit(id) {
    try { await submitApplication(id); setMsg({ type:'ok', text:'Submitted!' }); reload(); }
    catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Loan Applications" sub={`${(data||[]).length} total`}
        action={<Btn onClick={() => setOpen(true)}>+ Create Application</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Borrower','Amount','Date','Status','Actions']}
          rows={(data||[]).map(a => [a.applicationID, a.borrowerID, fmt$(a.requestedAmount), fmtD(a.applicationDate),
            <Badge text={a.status} />,
            a.status === 'DRAFT' && <Btn onClick={() => submit(a.applicationID)} color="#15803d"
              style={{ padding:'4px 10px', fontSize:11 }}>Submit</Btn>])}
        />
      </Card>
      <Modal open={open} title="Create Loan Application" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Borrower" name="borrowerID" value={form.borrowerID} onChange={onChange}
          options={(borrowers||[]).map(b=>({ value:b.borrowerID, label:`${b.name} (ID:${b.borrowerID})` }))} />
        <Field label="Loan Product" name="loanProductID" value={form.loanProductID} onChange={onChange}
          options={(products||[]).filter(p=>p.status==='ACTIVE').map(p=>({ value:p.productID, label:`${p.productName} (${p.interestRatePercent}% ${p.interestType} ${p.tenureMonths}mo)` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Requested Amount (₹)" name="requestedAmount" value={form.requestedAmount} onChange={onChange} type="number" required />
          <Field label="Group (optional)" name="groupID" value={form.groupID} onChange={onChange}
            options={(groups||[]).map(g=>({ value:g.groupID, label:g.groupName }))} />
        </div>
        <Field label="Purpose" name="purpose" value={form.purpose} onChange={onChange} rows={2} />
        <Field label="Credit Officer ID (optional)" name="creditOfficerID" value={form.creditOfficerID} onChange={onChange} type="number" />
      </Modal>
    </div>
  );
}
