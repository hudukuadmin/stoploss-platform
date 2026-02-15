import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  title?: string;
}

export default function Card({ children, style, title }: CardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        ...style,
      }}
    >
      {title && (
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
