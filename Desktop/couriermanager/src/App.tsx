import React, { useState } from 'react';
import { LayoutDashboard, PackagePlus, LogOut, User } from 'lucide-react';
import CreateVoucher from './components/CreateVoucher';
import CustomerPortal from './components/CustomerPortal';
import Dashboard from './components/Dashboard';

type RoleView = 'internal' | 'customer';
type InternalTab = 'dashboard' | 'create';

function ZazuLogo({ dark = false }: { dark?: boolean }) {
  const text = dark ? 'rgba(255,255,255,0.92)' : 'var(--ink)';
  const accent = 'var(--gold)';
  const sub = dark ? 'rgba(255,255,255,0.28)' : 'var(--ink-40)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 22,
          fontWeight: 400,
          color: text,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          Zazu
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'normal',
          fontSize: 22,
          fontWeight: 400,
          color: accent,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          ·
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 500,
          color: accent,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginLeft: 4,
          alignSelf: 'center',
        }}>
          Express
        </span>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 8,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: sub,
      }}>
        Courier Manager
      </span>
    </div>
  );
}

const NAV_ITEMS: { id: InternalTab; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Panel Operativo',  Icon: LayoutDashboard },
  { id: 'create',    label: 'Gestión de Envíos', Icon: PackagePlus },
];

export default function App() {
  const [roleView, setRoleView] = useState<RoleView>('internal');
  const [activeTab, setActiveTab] = useState<InternalTab>('dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--ink-05)', fontFamily: 'var(--font-sans)' }}>

      {/* ── Sidebar ── */}
      {roleView === 'internal' && (
        <aside style={{
          width: 224, flexShrink: 0,
          background: 'var(--ink-80)',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Brand */}
          <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <ZazuLogo dark />
          </div>

          {/* Nav */}
          <nav style={{ padding: '18px 10px', flex: 1 }}>
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '9px 12px', marginBottom: 2,
                  background: active ? 'rgba(184,151,62,0.12)' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                  color: active ? 'var(--white)' : 'rgba(255,255,255,0.38)',
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s', letterSpacing: '0.01em',
                }}>
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{ padding: '14px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255,255,255,0.09)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={13} color="rgba(255,255,255,0.5)" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.78)' }}>Carlos R.</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                  Lima Sur · 04
                </div>
              </div>
            </div>
            <button onClick={() => setRoleView('customer')} style={{
              width: '100%', padding: '7px 10px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
              <LogOut size={10} /> Vista Cliente
            </button>
          </div>
        </aside>
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          background: 'var(--white)', borderBottom: '1px solid var(--ink-10)',
          padding: '0 32px', height: 54,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {roleView === 'customer' && (
              <ZazuLogo />
            )}
            <div style={{ width: 1, height: 18, background: 'var(--ink-10)' }} />
            <span style={{ fontSize: 10, color: 'var(--ink-20)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              {roleView === 'internal' ? 'Sistema Operativo' : 'Portal de Seguimiento'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {roleView === 'customer' && (
              <button className="btn-secondary" onClick={() => setRoleView('internal')}
                style={{ padding: '6px 14px', fontSize: 10 }}>
                ← Volver al sistema
              </button>
            )}
            <span style={{ fontSize: 11, color: 'var(--ink-20)', fontFamily: 'var(--font-mono)' }}>
              {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {roleView === 'internal'
            ? activeTab === 'dashboard' ? <Dashboard /> : <CreateVoucher />
            : <CustomerPortal />
          }
        </main>
      </div>
    </div>
  );
}
