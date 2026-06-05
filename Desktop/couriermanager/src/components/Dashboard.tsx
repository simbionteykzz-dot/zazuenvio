import React from 'react';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { mockStats } from '../data';

const StatCard = ({ label, value, accent, icon: Icon }: {
  label: string; value: string | number; accent?: string; icon?: React.FC<{ size?: number; color?: string }>;
}) => (
  <div style={{
    background: 'var(--white)', border: '1px solid var(--ink-10)',
    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent ?? 'var(--ink-40)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </span>
      {Icon && <Icon size={14} color={accent ?? 'var(--ink-20)'} />}
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
      {value}
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--ink-10)', paddingBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            Resumen operativo
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Panel de Operaciones
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="date" className="input-field" style={{ width: 'auto', fontSize: 11, padding: '6px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink-40)' }} />
          <span style={{ color: 'var(--ink-20)', fontSize: 12 }}>→</span>
          <input type="date" className="input-field" style={{ width: 'auto', fontSize: 11, padding: '6px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink-40)' }} />
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Total Ops."      value={mockStats.totalOps}                       icon={TrendingUp} />
        <StatCard label="Unidades Mov."   value={mockStats.totalUnits.toLocaleString()}    icon={TrendingUp} />
        <StatCard label="Recepciones"     value={mockStats.recepciones.units.toLocaleString()} accent="var(--green)" icon={ArrowDownToLine} />
        <StatCard label="Despachos"       value={mockStats.despachos.units.toLocaleString()}   accent="var(--amber)" icon={ArrowUpFromLine} />
      </div>

      {/* Distribution bar */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', padding: '20px 24px' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
          Distribución por tipo · Unidades
        </p>
        <div style={{ width: '100%', height: 8, background: 'var(--ink-05)', borderRadius: 2, overflow: 'hidden', display: 'flex', marginBottom: 12 }}>
          <div style={{ width: `${mockStats.recepciones.percentage}%`, background: 'var(--green)', transition: 'width 0.6s ease' }} />
          <div style={{ width: `${mockStats.despachos.percentage}%`, background: 'var(--amber)', transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Recepciones', pct: mockStats.recepciones.percentage, color: 'var(--green)' },
            { label: 'Despachos',   pct: mockStats.despachos.percentage,   color: 'var(--amber)' },
          ].map(({ label, pct, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--ink-60)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                {label} <strong style={{ color: 'var(--ink)' }}>{pct}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          Detalle operacional
        </p>
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--white)' }}>
                {['Tipo', 'Operaciones', 'Unidades', '% del total'].map((h, i) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: i === 0 ? 'left' : 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              {[
                { label: 'Recepciones', color: 'var(--green)', data: mockStats.recepciones },
                { label: 'Despachos',   color: 'var(--amber)', data: mockStats.despachos },
              ].map(({ label, color, data }, i) => (
                <tr key={label} style={{ borderBottom: '1px solid var(--ink-05)', background: i % 2 === 0 ? 'var(--ink-05)' : 'var(--white)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 3, height: 14, background: color, display: 'inline-block', borderRadius: 1 }} />
                      <span style={{ fontWeight: 500, color: 'var(--ink)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>{label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-60)' }}>{data.ops}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-60)' }}>{data.units.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-60)' }}>{data.percentage.toFixed(1)}%</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--ink-80)', color: 'var(--white)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>{mockStats.totalOps}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>{mockStats.totalUnits.toLocaleString()}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
