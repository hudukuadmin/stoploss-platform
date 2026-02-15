import { useState } from 'react';
import Card from '../components/common/Card';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);

interface EOBRecord {
  id: string;
  eobId: string;
  reinsurerClaimId: string;
  eobReceivedDate: string;
  group: string;
  policy: string;
  policyPeriod: string;
  policyId: string;
  reinsurer: string;
  coverageType: string;
  memberName: string;
  memberId: string;
  memberCoinsurance: number;
  claimAmount: number;
  paidAmount: number;
  providerName: string;
  serviceDate: string;
  diagnosisCode: string;
  procedureCode: string;
  status: string;
}

const mockEOBRecords: EOBRecord[] = [
  { id: '1', eobId: 'REINS93_03/17/2025', reinsurerClaimId: '63XXXXXXXXX', eobReceivedDate: '03/17/2025', group: 'ABC Health Plan', policy: 'ABC -each Plan-CALIFORNIA', policyPeriod: '07/01/2024 - 07/01/2025', policyId: 'XXXXXXY002', reinsurer: 'Reinsurer03', coverageType: 'Commercial', memberName: 'K, J', memberId: '100351222', memberCoinsurance: 969.50, claimAmount: 48475.00, paidAmount: 47505.50, providerName: 'St. Mary Medical Center', serviceDate: '01/15/2025', diagnosisCode: 'C50.911', procedureCode: '19301', status: 'processed' },
  { id: '2', eobId: 'REINS93_03/17/2025', reinsurerClaimId: '63XXXXXXXXX', eobReceivedDate: '03/17/2025', group: 'ABC Health Plan', policy: 'ABC -each Plan-CALIFORNIA', policyPeriod: '07/01/2024 - 07/01/2025', policyId: 'XXXXXXY002', reinsurer: 'Reinsurer03', coverageType: 'Medicare', memberName: 'C, B', memberId: 'C00C4566', memberCoinsurance: 969.50, claimAmount: 52180.00, paidAmount: 51210.50, providerName: 'Kaiser Permanente', serviceDate: '02/03/2025', diagnosisCode: 'I25.10', procedureCode: '33533', status: 'processed' },
  { id: '3', eobId: 'REINS93_03/17/2025', reinsurerClaimId: '63XXXXXXXXX', eobReceivedDate: '03/17/2025', group: 'ABC Health Plan', policy: 'ABC -each Plan-CALIFORNIA', policyPeriod: '07/01/2024 - 07/01/2025', policyId: 'XXXXXXY002', reinsurer: 'Reinsurer03', coverageType: 'Medicare', memberName: 'M, E', memberId: 'C00C25333', memberCoinsurance: 969.50, claimAmount: 38920.00, paidAmount: 37950.50, providerName: 'UCLA Medical Center', serviceDate: '01/28/2025', diagnosisCode: 'M17.11', procedureCode: '27447', status: 'processed' },
  { id: '4', eobId: 'REINS93_03/17/2025', reinsurerClaimId: '63XXXXXXXXX', eobReceivedDate: '03/17/2025', group: 'ABC Health Plan', policy: 'ABC -each Plan-CALIFORNIA', policyPeriod: '07/01/2024 - 07/01/2025', policyId: 'XXXXXXY002', reinsurer: 'Reinsurer03', coverageType: 'Medicare', memberName: 'R, B', memberId: 'C00C0553', memberCoinsurance: 969.50, claimAmount: 41350.00, paidAmount: 40380.50, providerName: 'Cedars-Sinai', serviceDate: '02/10/2025', diagnosisCode: 'G35', procedureCode: '96413', status: 'processed' },
  { id: '5', eobId: 'REINS47_03/10/2025', reinsurerClaimId: '71XXXXXXXXX', eobReceivedDate: '03/10/2025', group: 'Pacific Health ACO', policy: 'PAC-Shared Risk-CA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'PACY00001', reinsurer: 'Reinsurer01', coverageType: 'Commercial', memberName: 'Thompson, J', memberId: 'PAC88201', memberCoinsurance: 1250.00, claimAmount: 125400.00, paidAmount: 124150.00, providerName: 'Stanford Health Care', serviceDate: '12/18/2024', diagnosisCode: 'C34.90', procedureCode: '32480', status: 'processed' },
  { id: '6', eobId: 'REINS47_03/10/2025', reinsurerClaimId: '71XXXXXXXXX', eobReceivedDate: '03/10/2025', group: 'Pacific Health ACO', policy: 'PAC-Shared Risk-CA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'PACY00001', reinsurer: 'Reinsurer01', coverageType: 'Commercial', memberName: 'Garcia, M', memberId: 'PAC44109', memberCoinsurance: 875.25, claimAmount: 87525.00, paidAmount: 86649.75, providerName: 'UCSF Medical Center', serviceDate: '01/05/2025', diagnosisCode: 'I21.09', procedureCode: '92928', status: 'processed' },
  { id: '7', eobId: 'REINS62_03/05/2025', reinsurerClaimId: '85XXXXXXXXX', eobReceivedDate: '03/05/2025', group: 'Midwest Provider Network', policy: 'MPN-Full Risk-IL', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'MPNY00003', reinsurer: 'Reinsurer02', coverageType: 'Medicare', memberName: 'Anderson, R', memberId: 'MPN55782', memberCoinsurance: 1540.00, claimAmount: 154000.00, paidAmount: 152460.00, providerName: 'Northwestern Memorial', serviceDate: '11/22/2024', diagnosisCode: 'N18.6', procedureCode: '50360', status: 'processed' },
  { id: '8', eobId: 'REINS62_03/05/2025', reinsurerClaimId: '85XXXXXXXXX', eobReceivedDate: '03/05/2025', group: 'Midwest Provider Network', policy: 'MPN-Full Risk-IL', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'MPNY00003', reinsurer: 'Reinsurer02', coverageType: 'Commercial', memberName: 'Williams, S', memberId: 'MPN33210', memberCoinsurance: 680.75, claimAmount: 68075.00, paidAmount: 67394.25, providerName: 'Rush University Medical', serviceDate: '01/12/2025', diagnosisCode: 'M47.816', procedureCode: '22612', status: 'pending_review' },
  { id: '9', eobId: 'REINS78_02/28/2025', reinsurerClaimId: '92XXXXXXXXX', eobReceivedDate: '02/28/2025', group: 'Southeast TPA Solutions', policy: 'STPA-Shared Savings-GA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'STPAY00005', reinsurer: 'Reinsurer03', coverageType: 'Medicare', memberName: 'Brown, L', memberId: 'STP71445', memberCoinsurance: 2100.00, claimAmount: 210000.00, paidAmount: 207900.00, providerName: 'Emory University Hospital', serviceDate: '12/05/2024', diagnosisCode: 'C25.0', procedureCode: '48150', status: 'processed' },
  { id: '10', eobId: 'REINS78_02/28/2025', reinsurerClaimId: '92XXXXXXXXX', eobReceivedDate: '02/28/2025', group: 'Southeast TPA Solutions', policy: 'STPA-Shared Savings-GA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'STPAY00005', reinsurer: 'Reinsurer03', coverageType: 'Commercial', memberName: 'Davis, K', memberId: 'STP29803', memberCoinsurance: 445.50, claimAmount: 44550.00, paidAmount: 44104.50, providerName: 'Grady Memorial Hospital', serviceDate: '02/01/2025', diagnosisCode: 'S72.001A', procedureCode: '27236', status: 'processed' },
  { id: '11', eobId: 'REINS47_02/20/2025', reinsurerClaimId: '71XXXXXXXXX', eobReceivedDate: '02/20/2025', group: 'Pacific Health ACO', policy: 'PAC-Shared Risk-CA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'PACY00001', reinsurer: 'Reinsurer01', coverageType: 'Medicare', memberName: 'Lee, H', memberId: 'PAC60284', memberCoinsurance: 3200.00, claimAmount: 320000.00, paidAmount: 316800.00, providerName: 'City of Hope', serviceDate: '11/15/2024', diagnosisCode: 'C91.00', procedureCode: '38240', status: 'processed' },
  { id: '12', eobId: 'REINS62_02/15/2025', reinsurerClaimId: '85XXXXXXXXX', eobReceivedDate: '02/15/2025', group: 'Midwest Provider Network', policy: 'MPN-Full Risk-IL', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'MPNY00003', reinsurer: 'Reinsurer02', coverageType: 'Medicare', memberName: 'Johnson, P', memberId: 'MPN19856', memberCoinsurance: 1875.00, claimAmount: 187500.00, paidAmount: 185625.00, providerName: 'University of Chicago Medical', serviceDate: '12/20/2024', diagnosisCode: 'I63.50', procedureCode: '37184', status: 'disputed' },
  { id: '13', eobId: 'REINS78_02/10/2025', reinsurerClaimId: '92XXXXXXXXX', eobReceivedDate: '02/10/2025', group: 'Southeast TPA Solutions', policy: 'STPA-Shared Savings-GA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'STPAY00005', reinsurer: 'Reinsurer03', coverageType: 'Commercial', memberName: 'Martinez, A', memberId: 'STP84221', memberCoinsurance: 925.00, claimAmount: 92500.00, paidAmount: 91575.00, providerName: 'Piedmont Atlanta Hospital', serviceDate: '01/08/2025', diagnosisCode: 'K80.00', procedureCode: '47562', status: 'processed' },
  { id: '14', eobId: 'REINS47_02/05/2025', reinsurerClaimId: '71XXXXXXXXX', eobReceivedDate: '02/05/2025', group: 'Pacific Health ACO', policy: 'PAC-Shared Risk-CA', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'PACY00001', reinsurer: 'Reinsurer01', coverageType: 'Commercial', memberName: 'Chen, W', memberId: 'PAC75503', memberCoinsurance: 1680.00, claimAmount: 168000.00, paidAmount: 166320.00, providerName: 'Sutter Health CPMC', serviceDate: '12/02/2024', diagnosisCode: 'M43.16', procedureCode: '22633', status: 'processed' },
  { id: '15', eobId: 'REINS62_01/30/2025', reinsurerClaimId: '85XXXXXXXXX', eobReceivedDate: '01/30/2025', group: 'Midwest Provider Network', policy: 'MPN-Full Risk-IL', policyPeriod: '01/01/2025 - 12/31/2025', policyId: 'MPNY00003', reinsurer: 'Reinsurer02', coverageType: 'Commercial', memberName: 'Taylor, D', memberId: 'MPN42697', memberCoinsurance: 550.00, claimAmount: 55000.00, paidAmount: 54450.00, providerName: 'Advocate Christ Medical', serviceDate: '01/18/2025', diagnosisCode: 'E11.65', procedureCode: '66984', status: 'processed' },
];

const groups = [...new Set(mockEOBRecords.map(r => r.group))];
const policies = [...new Set(mockEOBRecords.map(r => r.policy))];
const coverageTypes = [...new Set(mockEOBRecords.map(r => r.coverageType))];
const reinsurers = [...new Set(mockEOBRecords.map(r => r.reinsurer))];
const policyPeriods = [...new Set(mockEOBRecords.map(r => r.policyPeriod))];
const statuses = [...new Set(mockEOBRecords.map(r => r.status))];

type TabType = 'summary' | 'details';

export default function EOBRepositoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedRecord, setSelectedRecord] = useState<EOBRecord | null>(null);
  const [filters, setFilters] = useState({
    group: 'All',
    policy: 'All',
    coverageType: 'All',
    reinsurer: 'All',
    policyPeriod: 'All',
    policyId: '',
    memberName: '',
    memberId: '',
    eobReceivedDate: '',
    status: 'All',
  });

  const filtered = mockEOBRecords.filter(r => {
    if (filters.group !== 'All' && r.group !== filters.group) return false;
    if (filters.policy !== 'All' && r.policy !== filters.policy) return false;
    if (filters.coverageType !== 'All' && r.coverageType !== filters.coverageType) return false;
    if (filters.reinsurer !== 'All' && r.reinsurer !== filters.reinsurer) return false;
    if (filters.policyPeriod !== 'All' && r.policyPeriod !== filters.policyPeriod) return false;
    if (filters.policyId && !r.policyId.toLowerCase().includes(filters.policyId.toLowerCase())) return false;
    if (filters.memberName && !r.memberName.toLowerCase().includes(filters.memberName.toLowerCase())) return false;
    if (filters.memberId && !r.memberId.toLowerCase().includes(filters.memberId.toLowerCase())) return false;
    if (filters.eobReceivedDate && r.eobReceivedDate !== filters.eobReceivedDate) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    return true;
  });

  const totalClaimAmount = filtered.reduce((s, r) => s + r.claimAmount, 0);
  const totalPaidAmount = filtered.reduce((s, r) => s + r.paidAmount, 0);
  const totalCoinsurance = filtered.reduce((s, r) => s + r.memberCoinsurance, 0);

  const selectStyle: React.CSSProperties = {
    padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12,
    background: '#fff', color: '#374151', width: '100%',
  };
  const inputStyle: React.CSSProperties = {
    ...selectStyle,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b',
    marginBottom: 3, textTransform: 'uppercase',
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      processed: { bg: '#dcfce7', text: '#166534' },
      pending_review: { bg: '#fef3c7', text: '#92400e' },
      disputed: { bg: '#fee2e2', text: '#991b1b' },
    };
    const c = colors[status] || { bg: '#f1f5f9', text: '#64748b' };
    return (
      <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600, background: c.bg, color: c.text }}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  const tabStyle = (tab: TabType): React.CSSProperties => ({
    padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
    borderBottom: activeTab === tab ? '2px solid #6f4891' : '2px solid transparent',
    color: activeTab === tab ? '#6f4891' : '#64748b',
    background: 'transparent',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
            EOB Repository
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            Data updated {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 16px', background: '#6f4891', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        <button style={tabStyle('summary')} onClick={() => { setActiveTab('summary'); setSelectedRecord(null); }}>Summary</button>
        <button style={tabStyle('details')} onClick={() => setActiveTab('details')}>Details</button>
      </div>

      {activeTab === 'summary' && (
        <>
          <Card style={{ marginBottom: 16, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Group</label>
                <select style={selectStyle} value={filters.group} onChange={e => setFilters({ ...filters, group: e.target.value })}>
                  <option>All</option>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Policy</label>
                <select style={selectStyle} value={filters.policy} onChange={e => setFilters({ ...filters, policy: e.target.value })}>
                  <option>All</option>
                  {policies.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Coverage Type</label>
                <select style={selectStyle} value={filters.coverageType} onChange={e => setFilters({ ...filters, coverageType: e.target.value })}>
                  <option>All</option>
                  {coverageTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Reinsurer</label>
                <select style={selectStyle} value={filters.reinsurer} onChange={e => setFilters({ ...filters, reinsurer: e.target.value })}>
                  <option>All</option>
                  {reinsurers.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Policy Period</label>
                <select style={selectStyle} value={filters.policyPeriod} onChange={e => setFilters({ ...filters, policyPeriod: e.target.value })}>
                  <option>All</option>
                  {policyPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              <div>
                <label style={labelStyle}>Policy ID</label>
                <input style={inputStyle} placeholder="" value={filters.policyId} onChange={e => setFilters({ ...filters, policyId: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Member Name</label>
                <input style={inputStyle} placeholder="" value={filters.memberName} onChange={e => setFilters({ ...filters, memberName: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Member ID</label>
                <input style={inputStyle} placeholder="" value={filters.memberId} onChange={e => setFilters({ ...filters, memberId: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>EOB Received Date</label>
                <input style={inputStyle} type="date" value={filters.eobReceivedDate} onChange={e => setFilters({ ...filters, eobReceivedDate: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={selectStyle} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                  <option>All</option>
                  {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#452d5a' }}>EOB Records</h3>
              <span style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    {['EOB ID', 'Reinsurer Claim ID', 'EOB Received Date', 'Group', 'Policy', 'Policy Period', 'Policy ID', 'Reinsurer', 'Coverage Type', 'Member Name', 'Member ID', 'Member Coinsurance'].map(h => (
                      <th key={h} style={{ padding: '8px 6px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedRecord?.id === r.id ? '#f6f1f9' : 'transparent' }}
                      onClick={() => { setSelectedRecord(r); setActiveTab('details'); }}
                    >
                      <td style={{ padding: '8px 6px', fontSize: 11, fontWeight: 600, color: '#6f4891', whiteSpace: 'nowrap' }}>{r.eobId}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, color: '#452d5a' }}>{r.reinsurerClaimId}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11 }}>{r.eobReceivedDate}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, color: '#452d5a' }}>{r.group}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.policy}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, whiteSpace: 'nowrap' }}>{r.policyPeriod}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11 }}>{r.policyId}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11 }}>{r.reinsurer}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11 }}>{r.coverageType}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, fontWeight: 600, color: '#452d5a' }}>{r.memberName}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11 }}>{r.memberId}</td>
                      <td style={{ padding: '8px 6px', fontSize: 11, fontWeight: 600, textAlign: 'right' }}>{formatCurrency(r.memberCoinsurance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>Total Claims: <strong style={{ color: '#452d5a' }}>{formatCurrency(totalClaimAmount)}</strong></div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Total Paid: <strong style={{ color: '#452d5a' }}>{formatCurrency(totalPaidAmount)}</strong></div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Total Coinsurance: <strong style={{ color: '#452d5a' }}>{formatCurrency(totalCoinsurance)}</strong></div>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Showing {filtered.length} of {mockEOBRecords.length} result{mockEOBRecords.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'details' && (
        <>
          {selectedRecord ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card title={`EOB Detail: ${selectedRecord.eobId}`}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>EOB ID</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#6f4891', marginTop: 2 }}>{selectedRecord.eobId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Status</div>
                      <div style={{ marginTop: 4 }}>{statusBadge(selectedRecord.status)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Reinsurer Claim ID</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.reinsurerClaimId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>EOB Received Date</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.eobReceivedDate}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Policy Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Group</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.group}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Policy</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.policy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Policy ID</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.policyId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Policy Period</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.policyPeriod}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Reinsurer</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.reinsurer}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Coverage Type</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.coverageType}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Member & Financial Details">
                <div style={{ display: 'grid', gap: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Member Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Member Name</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.memberName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Member ID</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.memberId}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Financial Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Claim Amount</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#452d5a' }}>{formatCurrency(selectedRecord.claimAmount)}</div>
                    </div>
                    <div style={{ padding: 12, background: '#dcfce7', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#166534' }}>Paid Amount</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>{formatCurrency(selectedRecord.paidAmount)}</div>
                    </div>
                    <div style={{ padding: 12, background: '#fef3c7', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#92400e' }}>Member Coinsurance</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#92400e' }}>{formatCurrency(selectedRecord.memberCoinsurance)}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Clinical Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Provider</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.providerName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Service Date</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.serviceDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Diagnosis Code</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.diagnosisCode}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Procedure Code</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedRecord.procedureCode}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
                Select an EOB record from the Summary tab to view its details.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
