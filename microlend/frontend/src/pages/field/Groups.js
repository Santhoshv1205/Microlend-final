import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner } from '../../utils';
import { getGroups, getCentres, createGroup } from '../../api';

const EMPTY = { groupName:'', centreID:'', fieldOfficerID:'', memberCount:'5', jointLiabilityEnabled:'true' };

export default function FieldGroups() {
  const { data, loading, reload } = useApi(getGroups);
  const { data: centres } = useApi(getCentres);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await createGroup({ ...form, centreID: Number(form.centreID), fieldOfficerID: Number(form.fieldOfficerID)||null,
        memberCount: Number(form.memberCount), jointLiabilityEnabled: form.jointLiabilityEnabled === 'true' });
      setMsg({ type:'ok', text:'Group created' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="JLG Borrower Groups" sub={`${(data||[]).length} groups`}
        action={<Btn onClick={() => setOpen(true)}>+ Create Group</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Name','Centre ID','Members','Joint Liability','Status']}
          rows={(data||[]).map(g => [g.groupID, g.groupName, g.centreID, g.memberCount,
            g.jointLiabilityEnabled ? '✅ Yes' : '❌ No', <Badge text={g.status} />])}
        />
      </Card>
      <Modal open={open} title="Create JLG Group" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Group Name" name="groupName" value={form.groupName} onChange={onChange} required />
        <Field label="Centre" name="centreID" value={form.centreID} onChange={onChange}
          options={(centres||[]).map(c=>({ value:c.centreID, label:`${c.centreName} (${c.village||''})` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Field Officer ID" name="fieldOfficerID" value={form.fieldOfficerID} onChange={onChange} type="number" />
          <Field label="Member Count" name="memberCount" value={form.memberCount} onChange={onChange} type="number" />
          <Field label="Joint Liability" name="jointLiabilityEnabled" value={form.jointLiabilityEnabled} onChange={onChange}
            options={[{value:'true',label:'Enabled'},{value:'false',label:'Disabled'}]} />
        </div>
      </Modal>
    </div>
  );
}
