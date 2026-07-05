import { useState, useEffect, useCallback } from 'react';

// ── Formatters ────────────────────────────────────────────────────────────────
export const fmt$ = v =>
  Number(v || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const fmtD = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
export const fmtDT = d => d ? new Date(d).toLocaleString('en-IN') : '—';

// ── Status colour map ─────────────────────────────────────────────────────────
export const statusColor = s => ({
  ACTIVE:'#15803d', VERIFIED:'#15803d', APPROVED:'#15803d', CONDUCTED:'#15803d',
  PAID:'#15803d', RECEIVED:'#15803d', CLOSED:'#0891b2', ACCEPTED:'#0891b2',
  ISSUED:'#1d4ed8', SUBMITTED:'#1d4ed8', READ:'#1d4ed8', DISBURSED:'#0891b2',
  UNDER_REVIEW:'#7c3aed', IN_PROGRESS:'#7c3aed', PARTIAL:'#d97706', OVERDUE:'#d97706',
  SCHEDULED:'#d97706', CONDITIONAL:'#d97706', EXCESS:'#d97706',
  PENDING:'#64748b', DRAFT:'#64748b', UNREAD:'#64748b', INACTIVE:'#64748b',
  REJECTED:'#dc2626', BLACKLISTED:'#dc2626', LAPSED:'#dc2626', NPA:'#dc2626',
  WRITTEN_OFF:'#dc2626', SUSPENDED:'#dc2626', MISSED:'#dc2626', DISSOLVED:'#dc2626',
  OPEN:'#dc2626', DISCONTINUED:'#dc2626', PAR30:'#d97706', PAR60:'#ea580c',
  PAR90:'#dc2626', PAR180:'#7f1d1d', DECEASED:'#64748b', POSTPONED:'#64748b',
  WAIVED:'#0891b2', ELIGIBLE:'#15803d', NOT_ELIGIBLE:'#dc2626',
}[s] || '#64748b');

// ── useApi hook ───────────────────────────────────────────────────────────────
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await apiFn();
      setData(r.data.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Error');
    } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

// ── Shared components ─────────────────────────────────────────────────────────
const S = {
  page: { padding: '24px', maxWidth: '1280px', margin: '0 auto' },
  card: { background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: '20px', marginBottom: 16 },
  hRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  h1: { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 },
  sub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  btn: (c='#1d4ed8') => ({ background: c, color: '#fff', border: 'none', borderRadius: 7,
    padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }),
  ghost: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 7,
    padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: '#475569' },
  inp: { width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #e2e8f0',
    fontSize: 13, boxSizing: 'border-box' },
  sel: { width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #e2e8f0',
    fontSize: 13, background: '#fff', boxSizing: 'border-box' },
  lbl: { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' },
  err: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 7,
    marginBottom: 12, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ok: { background: '#dcfce7', color: '#15803d', padding: '10px 14px', borderRadius: 7,
    marginBottom: 12, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  spin: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: 16 },
  tdiv: { overflowX: 'auto' },
  tbl: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '9px 12px', textAlign: 'left', background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' },
  td: { padding: '9px 12px', borderBottom: '1px solid #f1f5f9', color: '#0f172a', verticalAlign: 'top' },
  modal: {
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex',
      alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 },
    box: { background:'#fff', borderRadius:12, padding:24, width:'100%', maxWidth:560,
      maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px #0003' },
    title: { fontSize:17, fontWeight:700, color:'#0f172a', marginBottom:18 },
    footer: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 },
  },
  statCard: { background:'#fff', borderRadius:10, padding:'16px 20px',
    boxShadow:'0 1px 4px #0001', textAlign:'center' },
};

export function Spinner() { return <div style={S.spin}>⏳ Loading…</div>; }

export function Alert({ msg, onClose }) {
  if (!msg) return null;
  const isErr = msg.type === 'error';
  return (
    <div style={isErr ? S.err : S.ok}>
      <span>{msg.text}</span>
      <span style={{ cursor:'pointer', fontWeight:700 }} onClick={onClose}>✕</span>
    </div>
  );
}

export function Badge({ text }) {
  return (
    <span style={{ background: statusColor(text) + '22', color: statusColor(text),
      padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
      {text}
    </span>
  );
}

export function Btn({ children, onClick, color = '#1d4ed8', style = {} }) {
  return <button style={{ ...S.btn(color), ...style }} onClick={onClick}>{children}</button>;
}

export function GhostBtn({ children, onClick }) {
  return <button style={S.ghost} onClick={onClick}>{children}</button>;
}

export function Card({ children, style = {} }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>;
}

export function PageHeader({ title, sub, action }) {
  return (
    <div style={S.hRow}>
      <div>
        <h1 style={S.h1}>{title}</h1>
        {sub && <p style={S.sub}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, color = '#1d4ed8' }) {
  return (
    <div style={S.statCard}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function Field({ label, name, value, onChange, options, rows, type = 'text', required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.lbl}>{label}{required && ' *'}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange} style={S.sel}>
          <option value="">— select —</option>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : rows ? (
        <textarea name={name} value={value} onChange={onChange} rows={rows}
          style={{ ...S.inp, resize: 'vertical' }} />
      ) : (
        <input name={name} value={value} onChange={onChange} type={type} style={S.inp} />
      )}
    </div>
  );
}

export function Modal({ open, title, onClose, onSave, saveLabel = 'Save', children }) {
  if (!open) return null;
  return (
    <div style={S.modal.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal.box}>
        <div style={S.modal.title}>{title}</div>
        {children}
        <div style={S.modal.footer}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <Btn onClick={onSave}>{saveLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

export function DataTable({ headers, rows, emptyMsg = 'No records found.' }) {
  if (!rows || rows.length === 0)
    return <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 24 }}>{emptyMsg}</p>;
  return (
    <div style={S.tdiv}>
      <table style={S.tbl}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              {row.map((cell, j) => <td key={j} style={S.td}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { S };
