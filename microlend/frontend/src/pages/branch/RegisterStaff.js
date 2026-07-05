import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Btn, Field, Alert } from '../../utils';
import { register } from '../../api';

const EMPTY = { name:'', email:'', password:'', role:'FIELD_OFFICER', phone:'' };

export default function RegisterStaff() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await register({ ...form, branchID: user.branchID });
      setMsg({ type:'ok', text:`${form.role} registered for branch ${user.branchID}` });
      setForm(EMPTY);
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Register Staff" sub={`Branch ${user?.branchID} — you can provision: FIELD_OFFICER, CREDIT_OFFICER, COLLECTIONS_OFFICER`} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card style={{ maxWidth:520 }}>
        <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
        <Field label="Email" name="email" value={form.email} onChange={onChange} type="email" required />
        <Field label="Password" name="password" value={form.password} onChange={onChange} type="password" required />
        <Field label="Role" name="role" value={form.role} onChange={onChange}
          options={['FIELD_OFFICER','CREDIT_OFFICER','COLLECTIONS_OFFICER'].map(v=>({value:v,label:v}))} />
        <Field label="Phone" name="phone" value={form.phone} onChange={onChange} />
        <p style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>
          User will be assigned to <strong>Branch {user?.branchID}</strong> automatically.
        </p>
        <Btn onClick={save}>Register Staff Member</Btn>
      </Card>
    </div>
  );
}
