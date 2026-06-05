import React, { useState } from 'react';
import { CheckCircle2, Search, Send, RotateCcw, MapPin } from 'lucide-react';
import { mockClients } from '../data';
import qrSample from '../assets/qr-sample.svg';

const TRACKING_NUM = 'TRK-88220-L';
const QR_URL = qrSample;

const useIsMobile = () => {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 900);
  React.useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
};

export default function CreateVoucher() {
  const isMobile = useIsMobile();
  const [dni, setDni] = useState('');
  const [searchedClient, setSearchedClient] = useState<any>(null);
  const [generated, setGenerated] = useState(false);
  const [notifyMethod, setNotifyMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [notificationSent, setNotificationSent] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;
    setSearchedClient(mockClients[dni] ?? { name: 'Cliente Nuevo', dni, isNew: true });
  };

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => setNotificationSent(true), 1600);
  };

  const handleReset = () => {
    setGenerated(false);
    setSearchedClient(null);
    setDni('');
    setNotificationSent(false);
  };

  return (
    <div style={{
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : '1fr 380px',
      minHeight: '100%',
      background: 'var(--ink-05)',
    }}>

      {/* ── Left panel ── */}
      <div style={{
        padding: isMobile ? '24px 20px' : '36px 40px',
        background: 'var(--white)',
        borderRight: isMobile ? 'none' : '1px solid var(--ink-10)',
        borderBottom: isMobile ? '1px solid var(--ink-10)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--ink-10)', paddingBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            Nuevo despacho
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Gestión de Envíos
          </h2>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              className="input-field"
              type="text"
              placeholder="Ingresar DNI del destinatario"
              value={dni}
              onChange={e => setDni(e.target.value)}
              style={{ paddingLeft: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', fontSize: 12 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', flexShrink: 0 }}>
            <Search size={13} /> Buscar
          </button>
        </form>

        {/* Client + form */}
        {searchedClient && !generated && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

            {/* Client card */}
            <div style={{ padding: '16px 20px', background: 'var(--ink-05)', border: '1px solid var(--ink-10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {searchedClient.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginTop: 4, letterSpacing: '0.06em' }}>
                  DNI: {searchedClient.dni}
                </div>
              </div>
              {searchedClient.isNew && (
                <span className="badge badge-gold">Nuevo</span>
              )}
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Descripción del paquete</label>
                <input className="input-field" placeholder="Ej: Caja estándar 5 kg" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Dirección de destino</label>
                <input className="input-field" placeholder="Av. Principal 123, Provincia" />
              </div>
              <div>
                <label className="field-label">Peso (kg)</label>
                <input className="input-field" placeholder="0.00" type="number" />
              </div>
              <div>
                <label className="field-label">Servicio</label>
                <select className="input-field" style={{ cursor: 'pointer' }}>
                  <option>Express 24h</option>
                  <option>Estándar 3d</option>
                  <option>Económico 5d</option>
                </select>
              </div>
            </div>

            {/* Notify */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--ink-10)' }}>
              <label className="field-label" style={{ marginBottom: 12 }}>Método de notificación</label>
              <div style={{ display: 'flex', gap: 20 }}>
                {(['whatsapp', 'email'] as const).map(method => (
                  <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-60)' }}>
                    <input
                      type="radio"
                      checked={notifyMethod === method}
                      onChange={() => setNotifyMethod(method)}
                      style={{ accentColor: 'var(--gold)', width: 14, height: 14, cursor: 'pointer' }}
                    />
                    {method === 'whatsapp' ? 'WhatsApp' : 'Correo electrónico'}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} className="btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '13px', fontSize: 11 }}>
              Generar voucher de envío
            </button>
          </div>
        )}

        {/* Success state */}
        {generated && (
          <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 40 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={26} color="var(--green)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', margin: '0 0 4px' }}>
                Voucher generado
              </h3>
              <p style={{ fontSize: 11, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                {TRACKING_NUM}
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: 340, padding: '12px 16px', background: notificationSent ? 'var(--green-lt)' : 'var(--ink-05)', border: '1px solid', borderColor: notificationSent ? 'var(--green)' : 'var(--ink-10)', marginTop: 8 }}>
              {notificationSent ? (
                <span style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <Send size={14} /> Notificación enviada · {notifyMethod}
                </span>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)' }} className="pulse-dot">
                  Enviando notificación...
                </span>
              )}
            </div>

            <button onClick={handleReset} className="btn-secondary" style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={12} /> Nuevo despacho
            </button>
          </div>
        )}

        {/* Empty state */}
        {!searchedClient && !generated && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-20)' }}>
            <div style={{ textAlign: 'center' }}>
              <Search size={32} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 12, letterSpacing: '0.04em' }}>Consulte un DNI para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel: Voucher preview ── */}
      <div style={{
        padding: isMobile ? '24px 20px' : '36px 28px',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
            Vista previa
          </p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            Voucher de Envío
          </h3>
        </div>

        {/* Voucher card */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', overflow: 'hidden' }}>
          {/* Voucher header strip */}
          <div style={{ background: 'var(--ink)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--white)', letterSpacing: '0.01em' }}>
              Zazu Express
            </span>
            <span style={{ fontSize: 9, color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Courier
            </span>
          </div>

          {/* Voucher body */}
          <div style={{ padding: '18px 18px 0' }}>
            {[
              ['Fecha',    '05/06/2026'],
              ['Guía #',  TRACKING_NUM],
              ['Cliente', searchedClient ? searchedClient.name.substring(0, 20).toUpperCase() : '—'],
              ['DNI',     searchedClient ? searchedClient.dni : '—'],
              ['Servicio','Express 24h'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--ink-05)' }}>
                <span style={{ fontSize: 10, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: 12, color: label === 'Guía #' ? 'var(--gold)' : 'var(--ink)', fontWeight: label === 'Guía #' ? 600 : 400, fontFamily: 'var(--font-mono)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* QR code — imagen real */}
          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderTop: '1px dashed var(--ink-10)', marginTop: 10 }}>
            <img
              src={QR_URL}
              alt="Código QR de seguimiento"
              width={110}
              height={110}
              style={{ display: 'block', imageRendering: 'pixelated' }}
            />
            <span style={{ fontSize: 9, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Escanear para seguimiento
            </span>
          </div>

          {/* Footer strip */}
          <div style={{ background: 'var(--ink-05)', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={10} color="var(--ink-40)" />
            <span style={{ fontSize: 9, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              Notificación vía {notifyMethod === 'whatsapp' ? 'WhatsApp' : 'correo electrónico'}
            </span>
          </div>
        </div>

        {/* Route tracker */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', overflow: 'hidden', flex: 1, minHeight: 220 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ink-10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-60)', fontFamily: 'var(--font-mono)' }}>
              Seguimiento satelital
            </span>
            <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          </div>
          <div style={{ position: 'relative', flex: 1, minHeight: 180, overflow: 'hidden', background: '#f8f8f6' }}>
            {/* Grid lines */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--ink-10)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Route line */}
              <polyline points="60,40 110,80 180,60 240,120 300,90" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
            </svg>
            {/* Pins */}
            <div style={{ position: 'absolute', top: '22%', left: '19%', width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid white', boxShadow: '0 0 0 3px rgba(28,124,84,0.2)' }} />
            <div style={{ position: 'absolute', top: '43%', left: '55%', width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', border: '2px solid white', boxShadow: '0 0 0 3px rgba(184,151,62,0.2)' }} className="pulse-dot" />
            <div style={{ position: 'absolute', top: '62%', left: '85%', width: 10, height: 10, borderRadius: '50%', background: 'var(--ink-20)', border: '2px solid white' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              Ruta activa · Lima → Destino
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
