import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Modal, Field, Alert, Spinner, fmt$ } from '../../utils';
import { getProducts, createProduct, updateProduct, discontinueProduct } from '../../api';

const EMPTY = { productName:'', category:'GROUP_LENDING', interestType:'REDUCING',
  interestRatePercent:'', tenureMonths:'', minAmount:'', maxAmount:'', processingFeePercent:'' };

export default function Products() {
  const { data: products, loading, reload } = useApi(getProducts);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function openAdd() { setEditId(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p) { setEditId(p.productID); setForm({ ...p }); setOpen(true); }

  async function save() {
    try {
      if (editId) await updateProduct(editId, form); else await createProduct(form);
      setMsg({ type:'ok', text: editId ? 'Product updated' : 'Product created' });
      setOpen(false); reload();
    } catch (e) { setMsg({ type:'error', text: e.response?.data?.message || 'Error' }); }
  }

  async function disc(id) {
    if (!window.confirm('Discontinue this product?')) return;
    try { await discontinueProduct(id); reload(); } catch {}
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Loan Products" sub={`${(products||[]).length} products`}
        action={<Btn onClick={openAdd}>+ Add Product</Btn>} />
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <Card>
        <DataTable
          headers={['ID','Name','Category','Type','Rate%','Tenure','Min','Max','Status','Actions']}
          rows={(products||[]).map(p => [
            p.productID, p.productName, p.category, p.interestType,
            p.interestRatePercent+'%', p.tenureMonths+' mo', fmt$(p.minAmount), fmt$(p.maxAmount),
            <Badge text={p.status} />,
            <div style={{ display:'flex', gap:6 }}>
              <Btn onClick={() => openEdit(p)} color="#7c3aed" style={{ padding:'4px 10px',fontSize:11 }}>Edit</Btn>
              {p.status === 'ACTIVE' && <Btn onClick={() => disc(p.productID)} color="#dc2626" style={{ padding:'4px 10px',fontSize:11 }}>Discontinue</Btn>}
            </div>
          ])}
        />
      </Card>
      <Modal open={open} title={editId ? 'Edit Product' : 'New Loan Product'} onClose={() => setOpen(false)} onSave={save}>
        <Field label="Product Name" name="productName" value={form.productName} onChange={onChange} required />
        <Field label="Category" name="category" value={form.category} onChange={onChange}
          options={['GROUP_LENDING','INDIVIDUAL','MSME','AGRICULTURAL'].map(v=>({value:v,label:v}))} />
        <Field label="Interest Type" name="interestType" value={form.interestType} onChange={onChange}
          options={[{value:'FLAT',label:'Flat'},{value:'REDUCING',label:'Reducing Balance'}]} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Interest Rate %" name="interestRatePercent" value={form.interestRatePercent} onChange={onChange} type="number" />
          <Field label="Tenure (months)" name="tenureMonths" value={form.tenureMonths} onChange={onChange} type="number" />
          <Field label="Min Amount (₹)" name="minAmount" value={form.minAmount} onChange={onChange} type="number" />
          <Field label="Max Amount (₹)" name="maxAmount" value={form.maxAmount} onChange={onChange} type="number" />
          <Field label="Processing Fee %" name="processingFeePercent" value={form.processingFeePercent} onChange={onChange} type="number" />
        </div>
      </Modal>
    </div>
  );
}
