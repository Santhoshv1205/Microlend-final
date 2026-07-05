import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD } from '../../utils';
import { getDelinquencies, updateDelinquency } from '../../api';

export default function CollectionsCases() {
  const { data, loading, reload } = useApi(getDelinquencies);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ action:'FIELD_VISIT', status:'IN_PROGRESS' });
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function update() {
    try {
      await updateDelinquency(selected.delinquencyID, { ...selected, ...form });
      setMsg({ type:'ok', text:'Case updated' }); setSelected(null); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Delinquency Cases" sub={`${(data||[]).length} cases`} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Loan Account','DPD','PAR','Opened','Assigned To','Action','Status','Update']}
          rows={(data||[]).map(d => [d.delinquencyID, d.loanAccountID, d.dpd,
            <Badge text={d.parBucket||'—'} />, fmtD(d.openedDate),
            d.assignedCollectionsOfficerID||'Unassigned', d.action||'—', <Badge text={d.status} />,
            <Btn onClick={() => { setSelected(d); setForm({ action:d.action||'FIELD_VISIT', status:d.status }); }}
              color="#dc2626" style={{ padding:'4px 10px',fontSize:11 }}>Update</Btn>])}
        />
      </Card>
      <Modal open={!!selected} title={`Update Case #${selected?.delinquencyID}`}
        onClose={() => setSelected(null)} onSave={update}>
        <Field label="Recovery Action" name="action" value={form.action} onChange={onChange}
          options={['FIELD_VISIT','LEGAL_NOTICE','RESTRUCTURING','WRITE_OFF'].map(v=>({value:v,label:v}))} />
        <Field label="Status" name="status" value={form.status} onChange={onChange}
          options={['OPEN','IN_PROGRESS','RESOLVED','WRITTEN_OFF'].map(v=>({value:v,label:v}))} />
      </Modal>
    </div>
  );
}
