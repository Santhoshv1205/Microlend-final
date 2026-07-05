import React, { useState } from 'react';
import { useApi, PageHeader, Card, Btn, Badge, DataTable, Spinner, fmt$, fmtD } from '../../utils';
import { getLoanAccounts, getSchedule } from '../../api';

export default function CreditAccounts() {
  const { data: accounts, loading } = useApi(getLoanAccounts);
  const [selected, setSelected] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [schedLoading, setSchedLoading] = useState(false);

  async function viewSchedule(id) {
    setSelected(id); setSchedLoading(true);
    try {
      const r = await getSchedule(id);
      setSchedule(r.data.data || []);
    } finally { setSchedLoading(false); }
  }

  if (loading) return <Spinner />;
  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Loan Accounts" sub={`${(accounts||[]).length} accounts`} />
      <Card>
        <DataTable
          headers={['Account','App ID','Borrower','Disbursed','Outstanding','DPD','Status','Schedule']}
          rows={(accounts||[]).map(a => [a.loanAccountID, a.applicationID, a.borrowerID,
            fmt$(a.disbursedAmount), fmt$(a.outstandingPrincipal), a.dpd||0, <Badge text={a.status} />,
            <Btn onClick={() => viewSchedule(a.loanAccountID)} color="#0891b2"
              style={{ padding:'4px 10px', fontSize:11 }}>View</Btn>])}
        />
      </Card>
      {selected && (
        <Card style={{ marginTop:16 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:700 }}>
            Repayment Schedule — Account {selected}
          </h3>
          {schedLoading ? <Spinner /> : (
            <DataTable
              headers={['#','Due Date','Principal','Interest','Total Due','Paid','Paid Date','Status']}
              rows={schedule.map(s => [s.installmentNumber, fmtD(s.dueDate),
                fmt$(s.principalDue), fmt$(s.interestDue), fmt$(s.totalDue),
                fmt$(s.amountPaid), fmtD(s.paidDate), <Badge text={s.status} />])}
            />
          )}
        </Card>
      )}
    </div>
  );
}
