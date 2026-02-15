interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#f1f5f9', text: '#64748b' },
  pending_review: { bg: '#fef3c7', text: '#92400e' },
  approved: { bg: '#dcfce7', text: '#166534' },
  declined: { bg: '#fee2e2', text: '#991b1b' },
  expired: { bg: '#f1f5f9', text: '#64748b' },
  bound: { bg: '#e8d5f5', text: '#452d5a' },
  active: { bg: '#dcfce7', text: '#166534' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
  pending: { bg: '#fef3c7', text: '#92400e' },
  low: { bg: '#dcfce7', text: '#166534' },
  moderate: { bg: '#fef3c7', text: '#92400e' },
  high: { bg: '#fed7aa', text: '#9a3412' },
  very_high: { bg: '#fee2e2', text: '#991b1b' },
  quota_share: { bg: '#e0f2fe', text: '#075985' },
  surety_bond: { bg: '#fce7f3', text: '#9d174d' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status] || { bg: '#f1f5f9', text: '#64748b' };
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        background: colors.bg,
        color: colors.text,
      }}
    >
      {label}
    </span>
  );
}
