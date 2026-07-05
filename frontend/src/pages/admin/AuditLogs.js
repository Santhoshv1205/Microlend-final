import React from 'react';
import { useApi, PageHeader, Card, DataTable, Spinner, fmtDT } from '../../utils';
import { getAuditLogs } from '../../api';

export default function AuditLogs() {
  const { data, loading } = useApi(getAuditLogs);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title="Audit Logs"
        sub={`${(data || []).length} events`}
      />

      <Card>
        <DataTable
          headers={['ID', 'User ID', 'Module', 'Action', 'Timestamp']}
          rows={(data || []).map(l => [
            l.auditID,
            l.userID || 'SYSTEM',
            l.module,
            l.action,
            fmtDT(l.timestamp)
          ])}
        />
      </Card>
    </div>
  );
}