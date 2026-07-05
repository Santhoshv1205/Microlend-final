import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, DataTable, Modal, Field, Alert, Spinner, fmt$, fmtD, Badge } from '../../utils';
import { getCollections, getLoanAccounts, recordCollection } from '../../api';

const EMPTY = { loanAccountID:'', scheduleID:'', collectedAmount:'', mode:'CASH', collectedByID:'', collectionDate:'' };

export default function RecordPayment() {
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
      setMsg({ type:'ok', text:'Payment recorded' }); setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  const activeAccounts = (accounts||[]).filter(a => ['ACTIVE','NPA'].includes(a.status));
  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Record Payment" sub="Collections recovery payments"
        action={<Btn onClick={() => setOpen(true)}>+ Record Payment</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Loan Account','Amount','Date','Mode','Status']}
          rows={(data||[]).map(c => [c.collectionID, c.loanAccountID, fmt$(c.collectedAmount),
            fmtD(c.collectionDate), c.mode, <Badge text={c.status} />])}
        />
      </Card>
      <Modal open={open} title="Record Collection Payment" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Loan Account" name="loanAccountID" value={form.loanAccountID} onChange={onChange}
          options={activeAccounts.map(a=>({ value:a.loanAccountID, label:`Account ${a.loanAccountID} — Outstanding: ${fmt$(a.outstandingPrincipal)} — DPD: ${a.dpd}` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Schedule ID (optional)" name="scheduleID" value={form.scheduleID} onChange={onChange} type="number" />
          <Field label="Collected Amount (₹)" name="collectedAmount" value={form.collectedAmount} onChange={onChange} type="number" required />
          <Field label="Mode" name="mode" value={form.mode} onChange={onChange}
            options={['CASH','BANK_TRANSFER','CENTRE_COLLECTION'].map(v=>({value:v,label:v}))} />
          <Field label="Collection Date" name="collectionDate" value={form.collectionDate} onChange={onChange} type="date" />
          <Field label="Collected By (User ID)" name="collectedByID" value={form.collectedByID} onChange={onChange} type="number" />
        </div>
      </Modal>
    </div>
  );
}
