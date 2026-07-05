import React from 'react';
import { useApi, PageHeader, Card, Badge, DataTable, Spinner, fmt$ } from '../../utils';
import { getLoanAccounts } from '../../api';

export default function BranchAccounts() {
  const { data, loading } = useApi(getLoanAccounts);
  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="All Loan Accounts" sub={`${(data||[]).length} accounts`} />
      <Card>
        <DataTable
          headers={['Account','App ID','Borrower','Product','Disbursed','Outstanding','DPD','Status']}
          rows={(data||[]).map(a => [a.loanAccountID, a.applicationID, a.borrowerID, a.productID,
            fmt$(a.disbursedAmount), fmt$(a.outstandingPrincipal), a.dpd||0, <Badge text={a.status} />])}
        />
      </Card>
    </div>
  );
}
