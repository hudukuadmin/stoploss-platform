import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { ShieldCheck, Layers, ArrowRightLeft, Handshake, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 'specific',
    name: 'Specific Stop Loss',
    icon: ShieldCheck,
    color: '#6f4891',
    bgColor: '#f6f1f9',
    description: 'Protects self-funded employers against catastrophic claims by an individual, capping the employer\'s liability at a predetermined amount per person.',
    features: [
      'Individual claimant protection',
      'Configurable attachment points',
      'Per-person liability cap',
      'Customizable deductible levels',
    ],
    metrics: { activePolicies: 5, totalPremium: '$1.42M', avgAttachment: '$250K' },
  },
  {
    id: 'aggregate',
    name: 'Aggregate Stop Loss',
    icon: Layers,
    color: '#0d9488',
    bgColor: '#f0fdfa',
    description: 'Limits the total amount an employer will pay for all covered medical claims, providing protection against higher-than-expected claim costs.',
    features: [
      'Total claims liability cap',
      'Budget certainty and predictability',
      'Configurable attachment factors',
      'Protection against trend volatility',
    ],
    metrics: { activePolicies: 3, totalPremium: '$654K', avgAttachment: '125% of expected' },
  },
  {
    id: 'quota_share',
    name: 'Gains/Loss Quota Share',
    icon: ArrowRightLeft,
    color: '#075985',
    bgColor: '#f0f9ff',
    description: 'A reinsurance arrangement where the insurer and reinsurer agree to share a fixed percentage of premiums and losses for a specific line of business.',
    features: [
      'Shared premium and loss arrangement',
      'Fixed percentage participation',
      'Risk diversification for insurers',
      'Customizable quota share percentages',
    ],
    metrics: { activePolicies: 2, totalPremium: '$890K', avgAttachment: '60/40 split' },
  },
  {
    id: 'surety_bond',
    name: 'Surety Bonds',
    icon: Handshake,
    color: '#9d174d',
    bgColor: '#fdf2f8',
    description: 'Three-party financial guarantees that ensure contractual obligations are met, protecting the obligee if the principal fails to fulfill their commitments.',
    features: [
      'Contractual obligation guarantee',
      'Three-party protection structure',
      'Regulatory compliance support',
      'Customizable bond amounts and terms',
    ],
    metrics: { activePolicies: 4, totalPremium: '$1.18M', avgAttachment: 'Per contract' },
  },
];

const providerPainPoints = [
  { problem: 'Limited and pricey reinsurance coverage', solution: 'Customized end-to-end reinsurance at competitive rates' },
  { problem: 'Surety bonds that don\'t protect against actual losses', solution: 'Customized financial guarantee products with real loss protection' },
  { problem: 'Unsustainable capital reserves for growing companies', solution: 'Configurable capital needs with fine-tuned downside protection' },
];

export default function ProductsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#452d5a' }}>
        Product Offerings
      </h2>
      <p style={{ margin: '0 0 8px', fontSize: 14, color: '#452d5a', fontWeight: 600 }}>
        Reinsurance & Capital Risk Solutions
      </p>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
        Bammo Shield provides end-to-end customized underwriting and risk products that maximize financial security and limit exposure for at-risk care delivery organizations.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {products.map(p => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              style={{
                background: '#fff', borderRadius: 12, padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
                cursor: 'pointer', transition: 'box-shadow 0.2s',
              }}
              onClick={() => navigate('/quotes')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: p.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} color={p.color} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#452d5a' }}>{p.name}</h3>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                {p.description}
              </p>

              <div style={{ marginBottom: 16 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#452d5a' }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Active</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#452d5a' }}>{p.metrics.activePolicies}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Premium</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#452d5a' }}>{p.metrics.totalPremium}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Attachment</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{p.metrics.avgAttachment}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, color: p.color, fontSize: 13, fontWeight: 600 }}>
                Generate Quote <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <Card title="Provider Pain Points & Bammo Shield Solutions" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          We understand provider pain points in risk protections and guarantees. Bammo Shield is the first of its kind -- a Managing General Underwriting organization providing customized solutions.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#991b1b' }}>The Problem for Providers</h4>
            {providerPainPoints.map(p => (
              <div key={p.problem} style={{ padding: 12, marginBottom: 8, background: '#fee2e2', borderRadius: 8, fontSize: 13, color: '#991b1b' }}>
                {p.problem}
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#166534' }}>Bammo Shield Solution</h4>
            {providerPainPoints.map(p => (
              <div key={p.solution} style={{ padding: 12, marginBottom: 8, background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#166534' }}>
                {p.solution}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Simplified Decision Points">
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Navigate complex regulatory and financial landscapes effortlessly with our comprehensive provider support services.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {[
            { question: 'How much premium am I paying?', detail: 'Tailor-made premium calculations based on your risk profile and population.' },
            { question: 'How much risk protection do I need?', detail: 'Fine-tune your downside protection with configurable coverage levels.' },
            { question: 'How much cash can I hold?', detail: 'Optimize capital reserves with customized reinsurance and bonding solutions.' },
            { question: 'Quarterly workshops', detail: 'Ongoing support with regular reviews to adjust strategy as your book evolves.' },
          ].map(d => (
            <div key={d.question} style={{ padding: 16, background: '#f6f1f9', borderRadius: 8, borderLeft: '3px solid #6f4891' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#452d5a', marginBottom: 8 }}>{d.question}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{d.detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
