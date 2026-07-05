import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner } from '../../utils';
import { getCentres, createCentre } from '../../api';

const EMPTY = { centreName:'', village:'', branchID:'1', fieldOfficerID:'', meetingDay:'TUESDAY', meetingTime:'10:00:00' };

export default function FieldCentres() {
  const { data, loading, reload } = useApi(getCentres);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await createCentre({ ...form, branchID: Number(form.branchID), fieldOfficerID: Number(form.fieldOfficerID)||null });
      setMsg({ type:'ok', text:'Centre created' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Village Centres" sub={`${(data||[]).length} centres`}
        action={<Btn onClick={() => setOpen(true)}>+ Create Centre</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Name','Village','Branch','Meeting Day','Time','Status']}
          rows={(data||[]).map(c => [c.centreID, c.centreName, c.village||'—', c.branchID,
            c.meetingDay||'—', c.meetingTime||'—', <Badge text={c.status} />])}
        />
      </Card>
      <Modal open={open} title="Create Centre" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Centre Name" name="centreName" value={form.centreName} onChange={onChange} required />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Village" name="village" value={form.village} onChange={onChange} />
          <Field label="Branch ID" name="branchID" value={form.branchID} onChange={onChange} type="number" />
          <Field label="Field Officer ID" name="fieldOfficerID" value={form.fieldOfficerID} onChange={onChange} type="number" />
          <Field label="Meeting Day" name="meetingDay" value={form.meetingDay} onChange={onChange}
            options={['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'].map(v=>({value:v,label:v}))} />
          <Field label="Meeting Time" name="meetingTime" value={form.meetingTime} onChange={onChange} type="time" />
        </div>
      </Modal>
    </div>
  );
}
