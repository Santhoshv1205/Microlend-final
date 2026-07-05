import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD, fmt$ } from '../../utils';
import { getSanctions, issueSanction, acceptSanction, getApplications } from '../../api';

const EMPTY = { applicationID:'', sanctionedAmount:'', interestRate:'', tenure:'', emiAmount:'', disbursalConditions:'' };

export default function Sanctions() {
  const { data, loading, reload } = useApi(getSanctions);
  const { data: apps } = useApi(getApplications);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const approvedApps = (apps||[]).filter(a => a.status === 'APPROVED');

  async function save() {
    try {
      await issueSanction({ ...form, applicationID: Number(form.applicationID),
        sanctionedAmount: Number(form.sanctionedAmount), interestRate: Number(form.interestRate),
        tenure: Number(form.tenure), emiAmount: Number(form.emiAmount) });
      setMsg({ type:'ok', text:'Sanction letter issued' }); setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  async function accept(id) {
    try { await acceptSanction(id); setMsg({ type:'ok', text:'Accepted' }); reload(); }
    catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Sanction Letters" sub={`${(data||[]).length} letters`}
        action={<Btn onClick={() => setOpen(true)}>+ Issue Sanction</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','App ID','Amount','Rate','EMI','Issued','Accepted','Status','Action']}
          rows={(data||[]).map(s => [s.sanctionID, s.applicationID, fmt$(s.sanctionedAmount),
            s.interestRate+'%', fmt$(s.emiAmount), fmtD(s.issuedDate),
            s.acceptedByBorrower ? '✅' : '❌', <Badge text={s.status} />,
            s.status === 'ISSUED' && <Btn onClick={() => accept(s.sanctionID)} color="#15803d"
              style={{ padding:'4px 10px',fontSize:11 }}>Accept</Btn>])}
        />
      </Card>
      <Modal open={open} title="Issue Sanction Letter" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Approved Application" name="applicationID" value={form.applicationID} onChange={onChange}
          options={approvedApps.map(a=>({ value:a.applicationID, label:`App #${a.applicationID} — Borrower ${a.borrowerID} (₹${a.requestedAmount})` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Sanctioned Amount (₹)" name="sanctionedAmount" value={form.sanctionedAmount} onChange={onChange} type="number" required />
          <Field label="Interest Rate %" name="interestRate" value={form.interestRate} onChange={onChange} type="number" required />
          <Field label="Tenure (months)" name="tenure" value={form.tenure} onChange={onChange} type="number" required />
          <Field label="EMI Amount (₹)" name="emiAmount" value={form.emiAmount} onChange={onChange} type="number" required />
        </div>
        <Field label="Disbursal Conditions" name="disbursalConditions" value={form.disbursalConditions} onChange={onChange} rows={2} />
      </Modal>
    </div>
  );
}
