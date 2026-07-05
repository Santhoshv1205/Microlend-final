import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi, StatCard, PageHeader } from '../../utils';
import { getDelinquencies, getCollections } from '../../api';

export default function CollectionsDashboard() {
  const { user } = useAuth();
  const { data: cases } = useApi(getDelinquencies);
  const { data: collections } = useApi(getCollections);
  const mine = (cases||[]).filter(c => c.assignedCollectionsOfficerID === user?.userID);
  return (
    <div style={{ padding:24 }}>
      <PageHeader title={`Welcome, ${user?.name}`} sub="Collections Officer Dashboard" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        <StatCard label="Total Cases" value={(cases||[]).length} color="#dc2626" />
        <StatCard label="Assigned to Me" value={mine.length} color="#d97706" />
        <StatCard label="Collections Recorded" value={(collections||[]).length} color="#15803d" />
      </div>
    </div>
  );
}
