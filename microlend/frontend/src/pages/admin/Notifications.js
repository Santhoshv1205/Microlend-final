import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, DataTable, Modal, Field, Alert, Spinner, Badge, fmtDT } from '../../utils';
import { getNotifications, sendNotif } from '../../api';

export default function AdminNotifications() {
  const { data, loading, reload } = useApi(getNotifications);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ userID:'', message:'', category:'REPAYMENT' });
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function send() {
    try {
      await sendNotif(Number(form.userID), form.message, form.category);
      setMsg({ type:'ok', text:'Notification sent' });
      setOpen(false); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Notifications" sub="Send and view all notifications"
        action={<Btn onClick={() => setOpen(true)}>+ Send Notification</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','User ID','Category','Message','Status','Created']}
          rows={(data||[]).map(n => [n.notificationID, n.userID, <Badge text={n.category} />,
            n.message?.substring(0,60), <Badge text={n.status} />, fmtDT(n.createdDate)])}
        />
      </Card>
      <Modal open={open} title="Send Notification" onClose={() => setOpen(false)} onSave={send} saveLabel="Send">
        <Field label="Recipient User ID" name="userID" value={form.userID} onChange={onChange} type="number" required />
        <Field label="Message" name="message" value={form.message} onChange={onChange} rows={3} required />
        <Field label="Category" name="category" value={form.category} onChange={onChange}
          options={['REPAYMENT','DISBURSEMENT','MEETING','DELINQUENCY','COMPLIANCE'].map(v=>({value:v,label:v}))} />
      </Modal>
    </div>
  );
}
