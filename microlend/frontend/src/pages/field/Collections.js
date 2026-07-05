import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmt$, fmtD } from '../../utils';
import { getCollections, getLoanAccounts, recordCollection } from '../../api';

const EMPTY = { loanAccountID:'', scheduleID:'', collectedAmount:'', mode:'CENTRE_COLLECTION', collectedByID:'', collectionDate:'' };

export default function FieldCollections() {
  const { data, loading, reload } = useApi(getCollections);
  const { data: accounts } = useApi(getLoanAccounts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await recordCollection({ ...form, loanAccountID: Number(form.loanAccountID),
        scheduleID: form.scheduleID ? Number(form.scheduleID) : null,
        collectedAmount: Number(form.collectedAmount),
        collectedByID: form.collectedByID ? Number(form.collectedByID) : null });
      setMsg({ type:'ok', text:'Collection recorded' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  const activeAccounts = (accounts||[]).filter(a => a.status === 'ACTIVE');
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="EMI Collections" sub={`${(data||[]).length} records`}
        action={<Btn onClick={() => setOpen(true)}>+ Record Payment</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Loan Account','Amount','Date','Mode','Collected By','Status']}
          rows={(data||[]).map(c => [c.collectionID, c.loanAccountID, fmt$(c.collectedAmount),
            fmtD(c.collectionDate), c.mode, c.collectedByID||'—', <Badge text={c.status} />])}
        />
      </Card>
      <Modal open={open} title="Record EMI Payment" onClose={() => setOpen(false)} onSave={save}>
        <div style={{ background:'#dbeafe', borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:12, color:'#1d4ed8' }}>
          Full payment → PAID. Partial → PARTIAL (amountPaid accumulates). Over-payment → EXCESS.
        </div>
        <Field label="Loan Account" name="loanAccountID" value={form.loanAccountID} onChange={onChange}
          options={activeAccounts.map(a=>({ value:a.loanAccountID, label:`Account ${a.loanAccountID} — Borrower ${a.borrowerID} (Outstanding: ${fmt$(a.outstandingPrincipal)})` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Schedule ID (optional)" name="scheduleID" value={form.scheduleID} onChange={onChange} type="number" />
          <Field label="Collected Amount (₹)" name="collectedAmount" value={form.collectedAmount} onChange={onChange} type="number" required />
          <Field label="Collection Mode" name="mode" value={form.mode} onChange={onChange}
            options={['CASH','BANK_TRANSFER','CENTRE_COLLECTION'].map(v=>({value:v,label:v}))} />
          <Field label="Collection Date" name="collectionDate" value={form.collectionDate} onChange={onChange} type="date" />
          <Field label="Collected By (User ID)" name="collectedByID" value={form.collectedByID} onChange={onChange} type="number" />
        </div>
      </Modal>
    </div>
  );
}
