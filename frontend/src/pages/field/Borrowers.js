import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner } from '../../utils';
import { getBorrowers, createBorrower } from '../../api';

const EMPTY = { name:'', email:'', password:'', phone:'', gender:'', dateOfBirth:'',
  nationalIDNumber:'', village:'', district:'', occupation:'', monthlyIncome:'', bankAccountNumber:'' };

export default function FieldBorrowers() {
  const { data, loading, reload } = useApi(getBorrowers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await createBorrower({ ...form, monthlyIncome: Number(form.monthlyIncome)||null });
      setMsg({ type:'ok', text:'Borrower registered. Login account created.' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Borrowers" sub={`${(data||[]).length} registered`}
        action={<Btn onClick={() => setOpen(true)}>+ Register Borrower</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Name','Email','Phone','Village','National ID','Status']}
          rows={(data||[]).map(b => [b.borrowerID, b.name, b.email, b.phone||'—',
            b.village||'—', b.nationalIDNumber||'—', <Badge text={b.status} />])}
        />
      </Card>
      <Modal open={open} title="Register New Borrower" onClose={() => setOpen(false)} onSave={save}>
        <p style={{ margin:'0 0 12px', fontSize:12, color:'#64748b' }}>
          A login account (role=BORROWER) will be auto-created with the email and password below.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
          <Field label="Phone" name="phone" value={form.phone} onChange={onChange} />
          <Field label="Portal Email" name="email" value={form.email} onChange={onChange} type="email" required />
          <Field label="Portal Password" name="password" value={form.password} onChange={onChange} type="password" required />
          <Field label="National ID (Aadhaar)" name="nationalIDNumber" value={form.nationalIDNumber} onChange={onChange} />
          <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} type="date" />
          <Field label="Gender" name="gender" value={form.gender} onChange={onChange}
            options={['Male','Female','Other'].map(v=>({value:v,label:v}))} />
          <Field label="Village" name="village" value={form.village} onChange={onChange} />
          <Field label="District" name="district" value={form.district} onChange={onChange} />
          <Field label="Occupation" name="occupation" value={form.occupation} onChange={onChange} />
          <Field label="Monthly Income (₹)" name="monthlyIncome" value={form.monthlyIncome} onChange={onChange} type="number" />
          <Field label="Bank Account No." name="bankAccountNumber" value={form.bankAccountNumber} onChange={onChange} />
        </div>
      </Modal>
    </div>
  );
}
