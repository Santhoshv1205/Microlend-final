import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD } from '../../utils';
import { getDelinquencies, updateDelinquency, triggerEngine } from '../../api';

export default function BranchDelinquency() {
  const { data, loading, reload } = useApi(getDelinquencies);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ action:'FIELD_VISIT', status:'IN_PROGRESS' });
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function trigger() {
    try { await triggerEngine(); setMsg({ type:'ok', text:'Delinquency engine triggered!' }); reload(); }
    catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  async function update() {
    try {
      await updateDelinquency(selected.delinquencyID, { ...selected, ...form });
      setMsg({ type:'ok', text:'Case updated' }); setSelected(null); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  const stats = data ? {
    open: data.filter(x=>x.status==='OPEN').length,
    inProg: data.filter(x=>x.status==='IN_PROGRESS').length,
    npa: data.filter(x=>x.dpd>=90).length,
  } : {};

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Delinquency Cases" sub={`${(data||[]).length} total cases`}
        action={<Btn onClick={trigger} color="#dc2626">⚡ Trigger Engine</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        <div style={{ background:'#fee2e2', borderRadius:8, padding:'14px 18px', textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#dc2626' }}>{stats.open||0}</div>
          <div style={{ fontSize:12, color:'#64748b' }}>Open Cases</div>
        </div>
        <div style={{ background:'#fef3c7', borderRadius:8, padding:'14px 18px', textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#d97706' }}>{stats.inProg||0}</div>
          <div style={{ fontSize:12, color:'#64748b' }}>In Progress</div>
        </div>
        <div style={{ background:'#fee2e2', borderRadius:8, padding:'14px 18px', textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#7f1d1d' }}>{stats.npa||0}</div>
          <div style={{ fontSize:12, color:'#64748b' }}>NPA (DPD≥90)</div>
        </div>
      </div>
      <Card>
        <DataTable
          headers={['ID','Loan Account','DPD','PAR Bucket','Opened','Action','Status','Update']}
          rows={(data||[]).map(d => [d.delinquencyID, d.loanAccountID, d.dpd,
            <Badge text={d.parBucket||'—'} />, fmtD(d.openedDate),
            d.action||'—', <Badge text={d.status} />,
            <Btn onClick={() => { setSelected(d); setForm({ action:d.action||'FIELD_VISIT', status:d.status }); }}
              color="#7c3aed" style={{ padding:'4px 10px',fontSize:11 }}>Update</Btn>])}
        />
      </Card>
      <Modal open={!!selected} title={`Update Case #${selected?.delinquencyID}`}
        onClose={() => setSelected(null)} onSave={update}>
        <Field label="Action Taken" name="action" value={form.action} onChange={onChange}
          options={['FIELD_VISIT','LEGAL_NOTICE','RESTRUCTURING','WRITE_OFF'].map(v=>({value:v,label:v}))} />
        <Field label="Status" name="status" value={form.status} onChange={onChange}
          options={['OPEN','IN_PROGRESS','RESOLVED','WRITTEN_OFF'].map(v=>({value:v,label:v}))} />
      </Modal>
    </div>
  );
}
