import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD, fmt$ } from '../../utils';
import { getMeetings, getCentres, createMeeting, updateMeeting } from '../../api';

const EMPTY = { centreID:'', meetingDate:'', conductedByID:'', attendanceCount:'', collectionAmount:'', status:'SCHEDULED' };

export default function FieldMeetings() {
  const { data, loading, reload } = useApi(getMeetings);
  const { data: centres } = useApi(getCentres);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function openRecord(m) {
    setEditId(m.meetingID);
    setForm({ ...m, attendanceCount: m.attendanceCount||'', collectionAmount: m.collectionAmount||'' });
    setOpen(true);
  }

  async function save() {
    try {
      const payload = { ...form, centreID: Number(form.centreID)||form.centreID,
        conductedByID: Number(form.conductedByID)||null,
        attendanceCount: Number(form.attendanceCount)||0,
        collectionAmount: Number(form.collectionAmount)||0 };
      if (editId) await updateMeeting(editId, payload); else await createMeeting(payload);
      setMsg({ type:'ok', text: editId ? 'Meeting updated' : 'Meeting scheduled' });
      setOpen(false); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Centre Meetings" sub={`${(data||[]).length} meetings`}
        action={<Btn onClick={() => { setEditId(null); setForm(EMPTY); setOpen(true); }}>+ Schedule Meeting</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Centre','Date','Attendance','Collected','Status','Actions']}
          rows={(data||[]).map(m => [m.meetingID, m.centreID, fmtD(m.meetingDate),
            m.attendanceCount, fmt$(m.collectionAmount), <Badge text={m.status} />,
            m.status === 'SCHEDULED' && <Btn onClick={() => openRecord(m)} color="#15803d"
              style={{ padding:'4px 10px', fontSize:11 }}>Record</Btn>])}
        />
      </Card>
      <Modal open={open} title={editId ? 'Record Meeting Outcome' : 'Schedule Meeting'} onClose={() => setOpen(false)} onSave={save}>
        {!editId && <Field label="Centre" name="centreID" value={form.centreID} onChange={onChange}
          options={(centres||[]).map(c=>({ value:c.centreID, label:c.centreName }))} />}
        {!editId && <Field label="Meeting Date" name="meetingDate" value={form.meetingDate} onChange={onChange} type="date" />}
        {editId && <>
          <Field label="Attendance Count" name="attendanceCount" value={form.attendanceCount} onChange={onChange} type="number" />
          <Field label="Collection Amount (₹)" name="collectionAmount" value={form.collectionAmount} onChange={onChange} type="number" />
          <Field label="Status" name="status" value={form.status} onChange={onChange}
            options={['SCHEDULED','CONDUCTED','MISSED','POSTPONED'].map(v=>({value:v,label:v}))} />
          <Field label="Conducted By (User ID)" name="conductedByID" value={form.conductedByID} onChange={onChange} type="number" />
        </>}
      </Modal>
    </div>
  );
}
