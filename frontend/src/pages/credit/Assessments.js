import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner } from '../../utils';
import { getAssessments, createAssessment, getBorrowers } from '../../api';

const EMPTY = { borrowerID:'', assessedByID:'', internalCreditScore:'', debtBurdenRatio:'', recommendation:'ELIGIBLE', remarks:'' };

export default function Assessments() {
  const { data, loading, reload } = useApi(getAssessments);
  const { data: borrowers } = useApi(getBorrowers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function save() {
    try {
      await createAssessment({ ...form, borrowerID: Number(form.borrowerID),
        assessedByID: Number(form.assessedByID)||null,
        internalCreditScore: Number(form.internalCreditScore)||null,
        debtBurdenRatio: Number(form.debtBurdenRatio)||null });
      setMsg({ type:'ok', text:'Assessment created' }); setOpen(false); setForm(EMPTY); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message||'Error' }); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Credit Assessments" sub={`${(data||[]).length} assessments`}
        action={<Btn onClick={() => setOpen(true)}>+ New Assessment</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Borrower','Score','DBR%','Recommendation','Assessed By']}
          rows={(data||[]).map(a => [a.assessmentID, a.borrowerID, a.internalCreditScore,
            a.debtBurdenRatio, <Badge text={a.recommendation} />, a.assessedByID||'—'])}
        />
      </Card>
      <Modal open={open} title="Create Credit Assessment" onClose={() => setOpen(false)} onSave={save}>
        <Field label="Borrower" name="borrowerID" value={form.borrowerID} onChange={onChange}
          options={(borrowers||[]).map(b=>({ value:b.borrowerID, label:`${b.name} (ID:${b.borrowerID})` }))} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Credit Score (0-1000)" name="internalCreditScore" value={form.internalCreditScore} onChange={onChange} type="number" />
          <Field label="Debt Burden Ratio %" name="debtBurdenRatio" value={form.debtBurdenRatio} onChange={onChange} type="number" />
          <Field label="Recommendation" name="recommendation" value={form.recommendation} onChange={onChange}
            options={['ELIGIBLE','NOT_ELIGIBLE','CONDITIONAL'].map(v=>({value:v,label:v}))} />
          <Field label="Assessed By (User ID)" name="assessedByID" value={form.assessedByID} onChange={onChange} type="number" />
        </div>
        <Field label="Remarks" name="remarks" value={form.remarks} onChange={onChange} rows={2} />
      </Modal>
    </div>
  );
}
