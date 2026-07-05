import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner } from '../../utils';
import { getUsers, register, updateUserStatus, deleteUser } from '../../api';

const EMPTY = { name:'', email:'', password:'', role:'FIELD_OFFICER', phone:'', branchID:'1' };

export default function Users() {
  const { data: users, loading, reload } = useApi(getUsers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await register({ ...form, branchID: Number(form.branchID) });
      setMsg({ type:'ok', text:'User registered' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  async function toggleStatus(u) {
    const next = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try { await updateUserStatus(u.userID, next); reload(); } catch {}
  }

  async function del(id) {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); reload(); } catch {}
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Staff Users" sub={`${(users||[]).length} accounts`}
        action={<Btn onClick={() => setOpen(true)}>+ Register Staff</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Name','Email','Role','Branch','Status','Actions']}
          rows={(users||[]).map(u => [
            u.userID, u.name, u.email, <Badge text={u.role} />, u.branchID||'—', <Badge text={u.status} />,
            <div style={{ display:'flex', gap:6 }}>
              <Btn onClick={() => toggleStatus(u)} color={u.status==='ACTIVE'?'#d97706':'#15803d'}
                style={{ padding:'4px 10px', fontSize:11 }}>
                {u.status==='ACTIVE'?'Suspend':'Activate'}
              </Btn>
              <Btn onClick={() => del(u.userID)} color="#dc2626" style={{ padding:'4px 10px', fontSize:11 }}>Del</Btn>
            </div>
          ])}
        />
      </Card>
      <Modal open={open} title="Register Staff" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
        <Field label="Email" name="email" value={form.email} onChange={onChange} type="email" required />
        <Field label="Password" name="password" value={form.password} onChange={onChange} type="password" required />
        <Field label="Role" name="role" value={form.role} onChange={onChange}
          options={['FIELD_OFFICER','CREDIT_OFFICER','COLLECTIONS_OFFICER','BRANCH_MANAGER','ADMIN'].map(v=>({value:v,label:v}))} />
        <Field label="Phone" name="phone" value={form.phone} onChange={onChange} />
        <Field label="Branch ID" name="branchID" value={form.branchID} onChange={onChange} type="number" />
      </Modal>
    </div>
  );
}
