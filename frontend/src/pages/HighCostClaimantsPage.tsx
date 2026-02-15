import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import Card from '../components/common/Card';
import MetricCard from '../components/common/MetricCard';
import { AlertTriangle, DollarSign, TrendingUp, Users } from 'lucide-react';

const COLORS = { purple: '#6f4891', teal: '#0d9488', light: '#8d5ead', red: '#ef4444', amber: '#f59e0b', green: '#22c55e' };

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

interface Claimant {
  id: string;
  memberId: string;
  planSponsor: string;
  age: number;
  gender: string;
  state: string;
  totalClaims: number;
  medicalClaims: number;
  pharmacyClaims: number;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  riskScore: number;
  tier: string;
  status: string;
  admissions: number;
  erVisits: number;
  specialists: number;
  chronicConditions: string[];
  priorYearClaims: number;
  projectedNextYear: number;
  careManagement: string;
  lastClaimDate: string;
}

const claimants: Claimant[] = [
  { id: '1', memberId: 'M-4821', planSponsor: 'Pacific Health ACO', age: 58, gender: 'M', state: 'CA', totalClaims: 1420000, medicalClaims: 1285000, pharmacyClaims: 135000, primaryDiagnosis: 'Non-Hodgkin Lymphoma - Stage III', secondaryDiagnoses: ['Type 2 Diabetes', 'Hypertension'], riskScore: 0.94, tier: '$1M+', status: 'active_treatment', admissions: 6, erVisits: 3, specialists: 8, chronicConditions: ['Cancer', 'Diabetes', 'Cardiovascular'], priorYearClaims: 245000, projectedNextYear: 850000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-10' },
  { id: '2', memberId: 'M-2156', planSponsor: 'Midwest Provider Network', age: 64, gender: 'F', state: 'IL', totalClaims: 1180000, medicalClaims: 1095000, pharmacyClaims: 85000, primaryDiagnosis: 'Acute Myeloid Leukemia', secondaryDiagnoses: ['Anemia', 'Recurrent Infections'], riskScore: 0.91, tier: '$1M+', status: 'active_treatment', admissions: 8, erVisits: 5, specialists: 6, chronicConditions: ['Cancer', 'Hematologic'], priorYearClaims: 180000, projectedNextYear: 920000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-08' },
  { id: '3', memberId: 'M-7392', planSponsor: 'Southeast TPA Solutions', age: 52, gender: 'M', state: 'GA', totalClaims: 1050000, medicalClaims: 980000, pharmacyClaims: 70000, primaryDiagnosis: 'Heart Transplant Candidate', secondaryDiagnoses: ['Congestive Heart Failure', 'Renal Insufficiency'], riskScore: 0.89, tier: '$1M+', status: 'pre_transplant', admissions: 4, erVisits: 7, specialists: 9, chronicConditions: ['Cardiovascular', 'Renal'], priorYearClaims: 320000, projectedNextYear: 1200000, careManagement: 'Transplant Coordinator', lastClaimDate: '2026-02-12' },
  { id: '4', memberId: 'M-1048', planSponsor: 'Pacific Health ACO', age: 47, gender: 'F', state: 'CA', totalClaims: 875000, medicalClaims: 720000, pharmacyClaims: 155000, primaryDiagnosis: 'Breast Cancer - Recurrence', secondaryDiagnoses: ['Depression', 'Osteoporosis'], riskScore: 0.86, tier: '$500K-$1M', status: 'active_treatment', admissions: 3, erVisits: 2, specialists: 7, chronicConditions: ['Cancer', 'Behavioral Health', 'Musculoskeletal'], priorYearClaims: 92000, projectedNextYear: 650000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-06' },
  { id: '5', memberId: 'M-5563', planSponsor: 'Southeast TPA Solutions', age: 41, gender: 'F', state: 'FL', totalClaims: 782000, medicalClaims: 410000, pharmacyClaims: 372000, primaryDiagnosis: 'Multiple Sclerosis - Progressive', secondaryDiagnoses: ['Chronic Fatigue', 'Bladder Dysfunction'], riskScore: 0.83, tier: '$500K-$1M', status: 'ongoing_management', admissions: 2, erVisits: 1, specialists: 5, chronicConditions: ['Neurological', 'Autoimmune'], priorYearClaims: 580000, projectedNextYear: 820000, careManagement: 'Neurological Specialist', lastClaimDate: '2026-01-28' },
  { id: '6', memberId: 'M-8901', planSponsor: 'Midwest Provider Network', age: 71, gender: 'M', state: 'OH', totalClaims: 695000, medicalClaims: 625000, pharmacyClaims: 70000, primaryDiagnosis: 'CABG + Valve Replacement', secondaryDiagnoses: ['Atrial Fibrillation', 'COPD'], riskScore: 0.80, tier: '$500K-$1M', status: 'post_surgical', admissions: 3, erVisits: 2, specialists: 6, chronicConditions: ['Cardiovascular', 'Respiratory'], priorYearClaims: 165000, projectedNextYear: 280000, careManagement: 'Cardiac Rehab Coordinator', lastClaimDate: '2026-01-15' },
  { id: '7', memberId: 'M-3347', planSponsor: 'Pacific Health ACO', age: 56, gender: 'M', state: 'CA', totalClaims: 620000, medicalClaims: 545000, pharmacyClaims: 75000, primaryDiagnosis: 'End-Stage Renal Disease', secondaryDiagnoses: ['Diabetes', 'Peripheral Neuropathy'], riskScore: 0.78, tier: '$500K-$1M', status: 'dialysis', admissions: 2, erVisits: 4, specialists: 5, chronicConditions: ['Renal', 'Diabetes', 'Neurological'], priorYearClaims: 420000, projectedNextYear: 680000, careManagement: 'Nephrology Case Manager', lastClaimDate: '2026-02-11' },
  { id: '8', memberId: 'M-6215', planSponsor: 'Southeast TPA Solutions', age: 63, gender: 'F', state: 'GA', totalClaims: 548000, medicalClaims: 468000, pharmacyClaims: 80000, primaryDiagnosis: 'Pancreatic Cancer - Stage II', secondaryDiagnoses: ['Weight Loss', 'Jaundice'], riskScore: 0.76, tier: '$500K-$1M', status: 'active_treatment', admissions: 4, erVisits: 3, specialists: 7, chronicConditions: ['Cancer', 'GI'], priorYearClaims: 45000, projectedNextYear: 750000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-09' },
  { id: '9', memberId: 'M-4102', planSponsor: 'Midwest Provider Network', age: 35, gender: 'M', state: 'IL', totalClaims: 485000, medicalClaims: 430000, pharmacyClaims: 55000, primaryDiagnosis: 'Severe Burns - Industrial Accident', secondaryDiagnoses: ['Skin Grafts', 'PTSD'], riskScore: 0.74, tier: '$250K-$500K', status: 'recovery', admissions: 5, erVisits: 1, specialists: 4, chronicConditions: ['Trauma', 'Behavioral Health'], priorYearClaims: 12000, projectedNextYear: 195000, careManagement: 'Trauma Rehab Coordinator', lastClaimDate: '2026-01-20' },
  { id: '10', memberId: 'M-9478', planSponsor: 'Pacific Health ACO', age: 68, gender: 'F', state: 'CA', totalClaims: 445000, medicalClaims: 380000, pharmacyClaims: 65000, primaryDiagnosis: 'Lung Cancer - Stage II', secondaryDiagnoses: ['COPD', 'Hypertension'], riskScore: 0.72, tier: '$250K-$500K', status: 'active_treatment', admissions: 3, erVisits: 2, specialists: 6, chronicConditions: ['Cancer', 'Respiratory', 'Cardiovascular'], priorYearClaims: 78000, projectedNextYear: 520000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-04' },
  { id: '11', memberId: 'M-2789', planSponsor: 'Southeast TPA Solutions', age: 44, gender: 'M', state: 'NC', totalClaims: 412000, medicalClaims: 185000, pharmacyClaims: 227000, primaryDiagnosis: 'Crohn\'s Disease - Severe', secondaryDiagnoses: ['Anemia', 'Malnutrition'], riskScore: 0.70, tier: '$250K-$500K', status: 'ongoing_management', admissions: 2, erVisits: 3, specialists: 4, chronicConditions: ['GI', 'Autoimmune'], priorYearClaims: 310000, projectedNextYear: 380000, careManagement: 'GI Specialist', lastClaimDate: '2026-01-30' },
  { id: '12', memberId: 'M-5134', planSponsor: 'Midwest Provider Network', age: 59, gender: 'F', state: 'MI', totalClaims: 395000, medicalClaims: 355000, pharmacyClaims: 40000, primaryDiagnosis: 'Spinal Fusion - Multi-Level', secondaryDiagnoses: ['Chronic Pain', 'Degenerative Disc Disease'], riskScore: 0.68, tier: '$250K-$500K', status: 'post_surgical', admissions: 2, erVisits: 1, specialists: 5, chronicConditions: ['Musculoskeletal'], priorYearClaims: 85000, projectedNextYear: 120000, careManagement: 'Orthopedic Case Manager', lastClaimDate: '2026-01-18' },
  { id: '13', memberId: 'M-7856', planSponsor: 'Pacific Health ACO', age: 72, gender: 'M', state: 'CA', totalClaims: 368000, medicalClaims: 310000, pharmacyClaims: 58000, primaryDiagnosis: 'Stroke - Hemorrhagic', secondaryDiagnoses: ['Atrial Fibrillation', 'Hypertension'], riskScore: 0.66, tier: '$250K-$500K', status: 'rehab', admissions: 3, erVisits: 2, specialists: 7, chronicConditions: ['Cardiovascular', 'Neurological'], priorYearClaims: 42000, projectedNextYear: 180000, careManagement: 'Neuro Rehab Coordinator', lastClaimDate: '2026-02-01' },
  { id: '14', memberId: 'M-3291', planSponsor: 'Southeast TPA Solutions', age: 38, gender: 'F', state: 'GA', totalClaims: 345000, medicalClaims: 120000, pharmacyClaims: 225000, primaryDiagnosis: 'Rheumatoid Arthritis - Severe', secondaryDiagnoses: ['Osteoporosis', 'Depression'], riskScore: 0.64, tier: '$250K-$500K', status: 'ongoing_management', admissions: 1, erVisits: 0, specialists: 4, chronicConditions: ['Autoimmune', 'Musculoskeletal', 'Behavioral Health'], priorYearClaims: 280000, projectedNextYear: 320000, careManagement: 'Rheumatology Specialist', lastClaimDate: '2026-02-07' },
  { id: '15', memberId: 'M-8234', planSponsor: 'Midwest Provider Network', age: 61, gender: 'M', state: 'WI', totalClaims: 328000, medicalClaims: 298000, pharmacyClaims: 30000, primaryDiagnosis: 'Colorectal Cancer - Stage III', secondaryDiagnoses: ['Liver Metastasis'], riskScore: 0.62, tier: '$250K-$500K', status: 'active_treatment', admissions: 4, erVisits: 2, specialists: 5, chronicConditions: ['Cancer', 'GI'], priorYearClaims: 28000, projectedNextYear: 480000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-03' },
  { id: '16', memberId: 'M-1567', planSponsor: 'Pacific Health ACO', age: 55, gender: 'F', state: 'CA', totalClaims: 312000, medicalClaims: 275000, pharmacyClaims: 37000, primaryDiagnosis: 'Hip + Knee Replacement (Bilateral)', secondaryDiagnoses: ['Obesity', 'Type 2 Diabetes'], riskScore: 0.60, tier: '$250K-$500K', status: 'post_surgical', admissions: 2, erVisits: 1, specialists: 3, chronicConditions: ['Musculoskeletal', 'Metabolic'], priorYearClaims: 48000, projectedNextYear: 85000, careManagement: 'Orthopedic Case Manager', lastClaimDate: '2026-01-22' },
  { id: '17', memberId: 'M-6543', planSponsor: 'Southeast TPA Solutions', age: 49, gender: 'M', state: 'FL', totalClaims: 298000, medicalClaims: 265000, pharmacyClaims: 33000, primaryDiagnosis: 'Liver Transplant - Post', secondaryDiagnoses: ['Hepatitis C', 'Immunosuppression'], riskScore: 0.58, tier: '$250K-$500K', status: 'post_transplant', admissions: 3, erVisits: 2, specialists: 6, chronicConditions: ['GI', 'Transplant'], priorYearClaims: 520000, projectedNextYear: 185000, careManagement: 'Transplant Coordinator', lastClaimDate: '2026-01-25' },
  { id: '18', memberId: 'M-9012', planSponsor: 'Midwest Provider Network', age: 66, gender: 'F', state: 'IN', totalClaims: 278000, medicalClaims: 240000, pharmacyClaims: 38000, primaryDiagnosis: 'Ovarian Cancer - Stage II', secondaryDiagnoses: ['Ascites', 'Fatigue'], riskScore: 0.56, tier: '$250K-$500K', status: 'active_treatment', admissions: 3, erVisits: 1, specialists: 5, chronicConditions: ['Cancer', 'GI'], priorYearClaims: 35000, projectedNextYear: 350000, careManagement: 'Oncology Case Manager', lastClaimDate: '2026-02-05' },
  { id: '19', memberId: 'M-4378', planSponsor: 'Pacific Health ACO', age: 73, gender: 'M', state: 'CA', totalClaims: 265000, medicalClaims: 230000, pharmacyClaims: 35000, primaryDiagnosis: 'TAVR Procedure + Complications', secondaryDiagnoses: ['Aortic Stenosis', 'Chronic Kidney Disease'], riskScore: 0.54, tier: '$250K-$500K', status: 'post_surgical', admissions: 2, erVisits: 3, specialists: 5, chronicConditions: ['Cardiovascular', 'Renal'], priorYearClaims: 95000, projectedNextYear: 145000, careManagement: 'Cardiac Case Manager', lastClaimDate: '2026-01-12' },
  { id: '20', memberId: 'M-7601', planSponsor: 'Southeast TPA Solutions', age: 45, gender: 'F', state: 'SC', totalClaims: 252000, medicalClaims: 98000, pharmacyClaims: 154000, primaryDiagnosis: 'Cystic Fibrosis', secondaryDiagnoses: ['Pancreatic Insufficiency', 'Recurrent Pneumonia'], riskScore: 0.52, tier: '$250K-$500K', status: 'ongoing_management', admissions: 2, erVisits: 2, specialists: 4, chronicConditions: ['Respiratory', 'GI', 'Genetic'], priorYearClaims: 235000, projectedNextYear: 260000, careManagement: 'Pulmonary Specialist', lastClaimDate: '2026-02-02' },
  // Remaining 31 claimants in $100K-$250K range (summarized for display)
  ...Array.from({ length: 31 }, (_, i) => ({
    id: String(21 + i),
    memberId: `M-${(1000 + Math.floor(Math.random() * 9000)).toString()}`,
    planSponsor: ['Pacific Health ACO', 'Midwest Provider Network', 'Southeast TPA Solutions'][i % 3],
    age: 30 + Math.floor(Math.random() * 45),
    gender: i % 2 === 0 ? 'M' : 'F',
    state: ['CA', 'IL', 'GA', 'FL', 'OH', 'TX', 'NY', 'MI'][i % 8],
    totalClaims: 100000 + Math.floor(Math.random() * 150000),
    medicalClaims: 80000 + Math.floor(Math.random() * 100000),
    pharmacyClaims: 15000 + Math.floor(Math.random() * 60000),
    primaryDiagnosis: ['Cardiac Surgery', 'Cancer Treatment', 'Joint Replacement', 'Spinal Surgery', 'NICU/Premature Birth', 'Organ Transplant Eval', 'Severe Trauma', 'Complex GI Surgery'][i % 8],
    secondaryDiagnoses: ['Hypertension', 'Diabetes'],
    riskScore: 0.35 + Math.random() * 0.2,
    tier: '$100K-$250K',
    status: ['active_treatment', 'ongoing_management', 'post_surgical', 'recovery'][i % 4],
    admissions: 1 + Math.floor(Math.random() * 3),
    erVisits: Math.floor(Math.random() * 4),
    specialists: 2 + Math.floor(Math.random() * 5),
    chronicConditions: [['Cardiovascular'], ['Cancer'], ['Musculoskeletal'], ['Neurological'], ['Respiratory']][i % 5],
    priorYearClaims: 20000 + Math.floor(Math.random() * 80000),
    projectedNextYear: 60000 + Math.floor(Math.random() * 150000),
    careManagement: ['Case Manager', 'Specialist', 'Primary Care', 'None'][i % 4],
    lastClaimDate: '2026-0' + (1 + (i % 2)) + '-' + String(10 + (i % 18)).padStart(2, '0'),
  })),
];

const tierSummary = [
  { tier: '$1M+', count: 3, totalSpend: 3650000, avgCost: 1216667, pctOfTotal: 20.2, color: COLORS.red },
  { tier: '$500K-$1M', count: 5, totalSpend: 3520000, avgCost: 704000, pctOfTotal: 19.5, color: COLORS.amber },
  { tier: '$250K-$500K', count: 12, totalSpend: 4183000, avgCost: 348583, pctOfTotal: 23.2, color: COLORS.purple },
  { tier: '$100K-$250K', count: 31, totalSpend: 6695000, avgCost: 215968, pctOfTotal: 37.1, color: COLORS.light },
];

const diagnosisMix = [
  { name: 'Cancer / Oncology', value: 18 },
  { name: 'Cardiovascular', value: 11 },
  { name: 'Musculoskeletal', value: 7 },
  { name: 'Neurological', value: 5 },
  { name: 'Transplant', value: 4 },
  { name: 'Other', value: 6 },
];

const monthlyTrend = [
  { month: 'Mar 2025', claimants: 38, spend: 12800000 },
  { month: 'Apr 2025', claimants: 40, spend: 13400000 },
  { month: 'May 2025', claimants: 41, spend: 14100000 },
  { month: 'Jun 2025', claimants: 43, spend: 14800000 },
  { month: 'Jul 2025', claimants: 44, spend: 15200000 },
  { month: 'Aug 2025', claimants: 45, spend: 15600000 },
  { month: 'Sep 2025', claimants: 46, spend: 16200000 },
  { month: 'Oct 2025', claimants: 47, spend: 16800000 },
  { month: 'Nov 2025', claimants: 48, spend: 17200000 },
  { month: 'Dec 2025', claimants: 49, spend: 17600000 },
  { month: 'Jan 2026', claimants: 50, spend: 17900000 },
  { month: 'Feb 2026', claimants: 51, spend: 18048000 },
];

const PIE_COLORS = ['#ef4444', '#f59e0b', '#6f4891', '#8d5ead', '#0d9488', '#64748b'];

export default function HighCostClaimantsPage() {
  const [selectedClaimant, setSelectedClaimant] = useState<Claimant | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterSponsor, setFilterSponsor] = useState<string>('all');

  const totalSpend = tierSummary.reduce((s, t) => s + t.totalSpend, 0);
  const filtered = claimants.filter(c =>
    (filterTier === 'all' || c.tier === filterTier) &&
    (filterSponsor === 'all' || c.planSponsor === filterSponsor)
  );

  const statusLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        High-Cost Claimants
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        5% of members account for 60% of all medical and pharmacy spend. Between 2020 and 2023, there has been a 50% increase in $1M+ claimants. Managing high-cost claims is critical for financial sustainability.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total High-Cost Claimants" value="51" icon={<Users size={22} />} trend="5% of total population" />
        <MetricCard label="Total HCC Spend" value={formatCurrency(totalSpend)} icon={<DollarSign size={22} />} trend="60% of all claims spend" />
        <MetricCard label="$1M+ Claimants" value="3" icon={<AlertTriangle size={22} />} trend="+50% increase since 2020" />
        <MetricCard label="Avg Cost per HCC" value={formatCurrency(totalSpend / 51)} icon={<TrendingUp size={22} />} trend="Across all tiers" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Spend by Claim Tier">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tierSummary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="tier" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0)} />
              <Bar dataKey="totalSpend" radius={[0, 4, 4, 0]} name="Total Spend">
                {tierSummary.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Primary Diagnosis Mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={diagnosisMix} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={3} dataKey="value">
                {diagnosisMix.map((_entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number | undefined) => `${v ?? 0} claimants`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="HCC Growth Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="claimants" stroke={COLORS.purple} strokeWidth={2} dot={{ fill: COLORS.purple, r: 3 }} name="HCC Count" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Tier Breakdown Summary" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {tierSummary.map(t => (
            <div key={t.tier} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, borderLeft: `4px solid ${t.color}`, cursor: 'pointer' }} onClick={() => setFilterTier(filterTier === t.tier ? 'all' : t.tier)}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#452d5a' }}>{t.count}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#452d5a', marginBottom: 4 }}>{t.tier} Claimants</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Total: {formatCurrency(t.totalSpend)}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Avg: {formatCurrency(t.avgCost)}</div>
              <div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 600, marginTop: 4 }}>{t.pctOfTotal}% of HCC spend</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: selectedClaimant ? '3fr 2fr' : '1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#452d5a' }}>
              Member Detail ({filtered.length} claimants)
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }}
              >
                <option value="all">All Tiers</option>
                <option value="$1M+">$1M+</option>
                <option value="$500K-$1M">$500K-$1M</option>
                <option value="$250K-$500K">$250K-$500K</option>
                <option value="$100K-$250K">$100K-$250K</option>
              </select>
              <select
                value={filterSponsor}
                onChange={(e) => setFilterSponsor(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }}
              >
                <option value="all">All Plan Sponsors</option>
                <option value="Pacific Health ACO">Pacific Health ACO</option>
                <option value="Midwest Provider Network">Midwest Provider Network</option>
                <option value="Southeast TPA Solutions">Southeast TPA Solutions</option>
              </select>
            </div>
          </div>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', position: 'sticky', top: 0, background: '#fff' }}>
                  {['Member', 'Plan Sponsor', 'Diagnosis', 'Total Claims', 'Risk', 'Tier', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 8px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedClaimant?.id === c.id ? '#f6f1f9' : 'transparent' }}
                    onClick={() => setSelectedClaimant(c)}
                  >
                    <td style={{ padding: '8px', fontWeight: 600, fontSize: 12, color: '#6f4891' }}>{c.memberId}</td>
                    <td style={{ padding: '8px', fontSize: 11, color: '#64748b' }}>{c.planSponsor}</td>
                    <td style={{ padding: '8px', fontSize: 11, color: '#452d5a', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.primaryDiagnosis}</td>
                    <td style={{ padding: '8px', fontSize: 12, fontWeight: 600 }}>{formatCurrency(c.totalClaims)}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 40, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                          <div style={{ width: `${c.riskScore * 100}%`, height: '100%', background: c.riskScore > 0.8 ? '#ef4444' : c.riskScore > 0.6 ? '#f59e0b' : '#eab308', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600 }}>{(c.riskScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                        background: c.tier === '$1M+' ? '#fee2e2' : c.tier === '$500K-$1M' ? '#fef3c7' : '#f6f1f9',
                        color: c.tier === '$1M+' ? '#991b1b' : c.tier === '$500K-$1M' ? '#92400e' : '#452d5a',
                      }}>{c.tier}</span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                        background: c.status === 'active_treatment' ? '#fee2e2' : c.status === 'ongoing_management' ? '#fef3c7' : '#dcfce7',
                        color: c.status === 'active_treatment' ? '#991b1b' : c.status === 'ongoing_management' ? '#92400e' : '#166534',
                      }}>{statusLabel(c.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedClaimant && (
          <Card title={`Claimant: ${selectedClaimant.memberId}`}>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Plan Sponsor</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedClaimant.planSponsor}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Demographics</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedClaimant.age}y {selectedClaimant.gender} | {selectedClaimant.state}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Total Claims</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#452d5a', marginTop: 2 }}>{formatCurrency(selectedClaimant.totalClaims)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Risk Score</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: selectedClaimant.riskScore > 0.8 ? '#ef4444' : '#f59e0b', marginTop: 2 }}>{(selectedClaimant.riskScore * 100).toFixed(0)}%</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Diagnosis</h4>
              <div style={{ padding: 10, background: '#fee2e2', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#991b1b' }}>
                {selectedClaimant.primaryDiagnosis}
              </div>
              {selectedClaimant.secondaryDiagnoses.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {selectedClaimant.secondaryDiagnoses.map(d => (
                    <span key={d} style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: 9999, fontSize: 11, color: '#64748b' }}>{d}</span>
                  ))}
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Claims Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Medical</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#452d5a' }}>{formatCurrency(selectedClaimant.medicalClaims)}</div>
                </div>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Pharmacy</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#452d5a' }}>{formatCurrency(selectedClaimant.pharmacyClaims)}</div>
                </div>
              </div>

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Utilization</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Admissions', value: selectedClaimant.admissions },
                  { label: 'ER Visits', value: selectedClaimant.erVisits },
                  { label: 'Specialists', value: selectedClaimant.specialists },
                ].map(u => (
                  <div key={u.label} style={{ padding: 8, background: '#f8fafc', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#452d5a' }}>{u.value}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{u.label}</div>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Cost Trajectory</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Prior Year</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(selectedClaimant.priorYearClaims)}</div>
                </div>
                <div style={{ padding: 10, background: '#f6f1f9', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#6f4891' }}>Projected Next Year</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#6f4891' }}>{formatCurrency(selectedClaimant.projectedNextYear)}</div>
                </div>
              </div>

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#452d5a' }}>Care Management</h4>
              <div style={{ padding: 10, background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#166534', fontWeight: 600 }}>
                {selectedClaimant.careManagement}
              </div>

              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {selectedClaimant.chronicConditions.map(c => (
                  <span key={c} style={{ padding: '3px 8px', background: '#e8d5f5', borderRadius: 9999, fontSize: 11, fontWeight: 600, color: '#452d5a' }}>{c}</span>
                ))}
              </div>

              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                Last claim: {new Date(selectedClaimant.lastClaimDate).toLocaleDateString()}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
