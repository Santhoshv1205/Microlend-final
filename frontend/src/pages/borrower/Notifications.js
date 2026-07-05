import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi, PageHeader, Card, Btn, Badge, Spinner, fmtDT } from '../../utils';
import { getNotifsByUser, markNotifRead, dismissNotif } from '../../api';

export default function BorrowerNotifications() {
  const { user } = useAuth();
  const { data, loading, reload } = useApi(() => getNotifsByUser(user.userID), [user.userID]);
  const [msg, setMsg] = useState('');

  async function doRead(id) { try { await markNotifRead(id); reload(); } catch {} }
  async function doDismiss(id) { try { await dismissNotif(id); reload(); } catch {} }

  if (loading) return <Spinner />;
  const items = data || [];
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="My Notifications" sub={`${items.filter(n=>n.status==='UNREAD').length} unread`} />
      {items.length === 0 ? (
        <p style={{ color:'#94a3b8', textAlign:'center', padding:40 }}>No notifications yet.</p>
      ) : items.map(n => (
        <div key={n.notificationID} style={{
          background: n.status === 'UNREAD' ? '#dbeafe' : '#fff',
          border: `1px solid ${n.status==='UNREAD'?'#93c5fd':'#e2e8f0'}`,
          borderRadius:10, padding:'14px 18px', marginBottom:10,
          display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
              <Badge text={n.category} />
              <Badge text={n.status} />
              <span style={{ fontSize:11, color:'#94a3b8' }}>{fmtDT(n.createdDate)}</span>
            </div>
            <p style={{ margin:0, fontSize:14, color:'#0f172a' }}>{n.message}</p>
          </div>
          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            {n.status==='UNREAD' && <Btn onClick={() => doRead(n.notificationID)} color="#1d4ed8"
              style={{ padding:'4px 10px', fontSize:11 }}>Read</Btn>}
            {n.status!=='DISMISSED' && <Btn onClick={() => doDismiss(n.notificationID)} color="#64748b"
              style={{ padding:'4px 10px', fontSize:11 }}>Dismiss</Btn>}
          </div>
        </div>
      ))}
    </div>
  );
}
