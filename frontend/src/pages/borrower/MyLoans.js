import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi, PageHeader, Card, Badge, DataTable, Spinner, fmt$, fmtD } from '../../utils';
import { getLoansByBorrower } from '../../api';

export default function MyLoans() {
  const { user } = useAuth();
  const { data, loading } = useApi(() => getLoansByBorrower(user.userID), [user.userID]);
  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="My Loans" sub={`${(data||[]).length} loan accounts`} />
      <Card>
        <DataTable
          headers={['Account','Disbursed','Outstanding','Total Repayable','DPD','Status']}
          rows={(data||[]).map(l => [l.loanAccountID, fmt$(l.disbursedAmount),
            fmt$(l.outstandingPrincipal), fmt$(l.totalRepayable), l.dpd||0, <Badge text={l.status} />])}
        />
      </Card>
    </div>
  );
}
