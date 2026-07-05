import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD, fmt$ } from '../../utils';
import { getLoanAccounts, getApplications, disburseLoan } from '../../api';

const EMPTY = { applicationID:'', disbursedAmount:'', disbursementDate:'' };

export default function Disbursements() {
  const { data: accounts, loading, reload } = useApi(getLoanAccounts);
  const { data: apps } = useApi(getApplications);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const approvedApps = (apps||[]).filter(a => a.status === 'APPROVED');

  async function save() {
    try {
      await disburseLoan({ ...form, applicationID: Number(form.applicationID),
        disbursedAmount: Number(form.disbursedAmount) });
      setMsg({ type:'ok', text:'Loan disbursed! Repayment schedule generated.' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Loan Disbursements" sub={`${(accounts||[]).length} accounts`}
        action={<Btn onClick={() => setOpen(true)}>⚡ Disburse Loan</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['Account ID','App ID','Borrower','Disbursed','Outstanding','DPD','Status']}
          rows={(accounts||[]).map(a => [a.loanAccountID, a.applicationID, a.borrowerID,
            fmt$(a.disbursedAmount), fmt$(a.outstandingPrincipal), a.dpd||0, <Badge text={a.status} />])}
        />
      </Card>
      <Modal open={open} title="Disburse Loan" onClose={() => setOpen(false)} onSave={save}>
        <p style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>
          Application must be APPROVED. EMI schedule auto-generated on disbursement.
        </p>
        <Field label="Approved Application" name="applicationID" value={form.applicationID} onChange={onChange}
          options={approvedApps.map(a=>({ value:a.applicationID, label:`App #${a.applicationID} — Borrower ${a.borrowerID}` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Disbursed Amount (₹)" name="disbursedAmount" value={form.disbursedAmount} onChange={onChange} type="number" required />
          <Field label="Disbursement Date" name="disbursementDate" value={form.disbursementDate} onChange={onChange} type="date" />
        </div>
      </Modal>
    </div>
  );
}
