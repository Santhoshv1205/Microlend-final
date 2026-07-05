import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmtD } from '../../utils';
import { getKyc, uploadKyc, getBorrowers } from '../../api';

const EMPTY = { borrowerID:'', documentType:'NATIONAL_ID', documentRef:'' };

export default function KYCUpload() {
  const { data, loading, reload } = useApi(getKyc);
  const { data: borrowers } = useApi(getBorrowers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await uploadKyc({ ...form, borrowerID: Number(form.borrowerID) });
      setMsg({ type:'ok', text:'KYC document uploaded (status: PENDING)' });
      setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="KYC Document Upload" sub="Field Officers upload — Credit Officers verify"
        action={<Btn onClick={() => setOpen(true)}>+ Upload KYC</Btn>} />
      <div style={{ background:'#fef3c7', border:'1px solid #d97706', borderRadius:8,
        padding:'10px 14px', marginBottom:16, fontSize:13, color:'#92400e' }}>
        ⚠️ You can upload documents but cannot verify them. Verification requires Credit Officer role.
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['KYC ID','Borrower ID','Type','Document Ref','Verified By','Status']}
          rows={(data||[]).map(k => [k.kycID, k.borrowerID, k.documentType,
            k.documentRef||'—', k.verifiedByID||'—', <Badge text={k.status} />])}
        />
      </Card>
      <Modal open={open} title="Upload KYC Document" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Borrower" name="borrowerID" value={form.borrowerID} onChange={onChange}
          options={(borrowers||[]).map(b=>({ value:b.borrowerID, label:`${b.name} (ID: ${b.borrowerID})` }))} />
        <Field label="Document Type" name="documentType" value={form.documentType} onChange={onChange}
          options={['NATIONAL_ID','VOTER_ID','PASSPORT','UTILITY_BILL'].map(v=>({value:v,label:v}))} />
        <Field label="Document Reference" name="documentRef" value={form.documentRef} onChange={onChange}
          rows={2} />
      </Modal>
    </div>
  );
}
