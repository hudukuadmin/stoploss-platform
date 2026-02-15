import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import type { Group } from '../types';
import { GroupType, ContractType } from '../types';
import { groupsApi } from '../api/services';

const mockGroups: Group[] = [
  {
    id: '1', name: 'Pacific Health ACO', groupType: GroupType.ACO,
    contractType: ContractType.SHARED_RISK, state: 'CA', memberCount: 4500,
    sicCode: '80', createdAt: '2026-01-15', updatedAt: '2026-01-15',
  },
  {
    id: '2', name: 'Midwest Provider Network', groupType: GroupType.PROVIDER_GROUP,
    contractType: ContractType.FULL_RISK, state: 'IL', memberCount: 2200,
    sicCode: '80', createdAt: '2026-01-10', updatedAt: '2026-01-10',
  },
  {
    id: '3', name: 'Southeast TPA Solutions', groupType: GroupType.TPA,
    contractType: ContractType.SHARED_SAVINGS, state: 'GA', memberCount: 8100,
    sicCode: '73', createdAt: '2025-12-20', updatedAt: '2025-12-20',
  },
];

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ name: string; groupType: GroupType; contractType: ContractType; state: string; sicCode: string; memberCount: number }>({
    name: '',
    groupType: GroupType.ACO,
    contractType: ContractType.SHARED_RISK,
    state: '',
    sicCode: '',
    memberCount: 0,
  });

  useEffect(() => {
    groupsApi.list().then(setGroups).catch(() => {});
  }, []);

  const handleCreate = async () => {
    try {
      const created = await groupsApi.create(form);
      setGroups([created, ...groups]);
      setShowForm(false);
      setForm({ name: '', groupType: GroupType.ACO, contractType: ContractType.SHARED_RISK, state: '', sicCode: '', memberCount: 0 });
    } catch {
      // Demo mode - add to local list
      const newGroup: Group = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGroups([newGroup, ...groups]);
      setShowForm(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box' as const,
  };

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600 as const, color: '#374151', marginBottom: 4 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#452d5a' }}>Plan Sponsors</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: '#6f4891', color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> New Plan Sponsor
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 24 }} title="Create New Plan Sponsor">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Organization Type</label>
              <select style={inputStyle} value={form.groupType} onChange={(e) => setForm({ ...form, groupType: e.target.value as GroupType })}>
                {Object.values(GroupType).map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Contract Type</label>
              <select style={inputStyle} value={form.contractType} onChange={(e) => setForm({ ...form, contractType: e.target.value as ContractType })}>
                {Object.values(ContractType).map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. CA" />
            </div>
            <div>
              <label style={labelStyle}>SIC Code</label>
              <input style={inputStyle} value={form.sicCode} onChange={(e) => setForm({ ...form, sicCode: e.target.value })} placeholder="e.g. 80" />
            </div>
            <div>
              <label style={labelStyle}>Member Count</label>
              <input style={inputStyle} type="number" value={form.memberCount} onChange={(e) => setForm({ ...form, memberCount: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCreate}
              style={{ padding: '8px 20px', background: '#6f4891', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            >
              Create Plan Sponsor
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: '8px 20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              {['Name', 'Type', 'Contract', 'State', 'Members', 'SIC', ''].map((h) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                onClick={() => navigate(`/plan-sponsors/${group.id}`)}
              >
                <td style={{ padding: '12px', fontWeight: 600, color: '#452d5a' }}>{group.name}</td>
                <td style={{ padding: '12px' }}>
                  <StatusBadge status={group.groupType} />
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#64748b' }}>
                  {group.contractType.replace(/_/g, ' ')}
                </td>
                <td style={{ padding: '12px', fontSize: 13 }}>{group.state}</td>
                <td style={{ padding: '12px', fontSize: 13, fontWeight: 600 }}>
                  {group.memberCount.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#64748b' }}>{group.sicCode}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <ChevronRight size={16} color="#94a3b8" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
