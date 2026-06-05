import React, { useEffect, useMemo, useState } from 'react';
import { CircleCheckBig, KeyRound, MapPin, PackageSearch, QrCode, Search, ShieldCheck, Smartphone, Ticket } from 'lucide-react';
import { mockClients, mockOperations } from '../data';
import type { Client, Operation } from '../types';

type LookupResult = {
  client: Client;
  operations: Operation[];
};

type CustomerFlow = 'paid' | 'cash-on-delivery';

function buildLookup(query: string): LookupResult | null {
  const normalizedQuery = query.trim().toUpperCase();

  if (!normalizedQuery) {
    return null;
  }

  const clientByDni = mockClients[normalizedQuery];
  if (clientByDni) {
    return {
      client: clientByDni,
      operations: mockOperations.filter((operation) => clientByDni.history.includes(operation.id)),
    };
  }

  const matchedOperation = mockOperations.find((operation) => operation.id.toUpperCase() === normalizedQuery);
  if (!matchedOperation) {
    return null;
  }

  const matchedClient = Object.values(mockClients).find((client) => client.history.includes(matchedOperation.id));
  if (!matchedClient) {
    return null;
  }

  return {
    client: matchedClient,
    operations: mockOperations.filter((operation) => matchedClient.history.includes(operation.id)),
  };
}

function getOperationStage(operation: Operation) {
  if (operation.status === 'COMPLETED') {
    return 'Entregado';
  }

  if (operation.type === 'DESPACHO') {
    return 'En ruta';
  }

  return 'En almacen';
}

function generateAccessKey(client: Client, operation: Operation | null) {
  const seed = `${client.dni}${operation?.id ?? '000'}`;
  const total = seed.split('').reduce((accumulator, character, index) => {
    return accumulator + character.charCodeAt(0) * (index + 3);
  }, 0);

  return String((total % 9000) + 1000);
}

function buildQrPattern(value: string) {
  const source = value.padEnd(169, value).slice(0, 169);
  return source.split('').map((character, index) => {
    const code = character.charCodeAt(0);
    return (code + index * 7) % 3 !== 0;
  });
}

function TrackingQr({ value }: { value: string }) {
  const pattern = buildQrPattern(value);
  const finderCells = new Set([
    0, 1, 2, 13, 14, 15, 26, 27, 28,
    3, 4, 16, 17, 29, 30,
    5, 6, 18, 19, 31, 32,
    7, 8, 20, 21, 33, 34,
    9, 10, 22, 23, 35, 36,
    11, 12, 24, 25, 37, 38,
    130, 131, 132, 143, 144, 145, 156, 157, 158,
    133, 134, 146, 147, 159, 160,
    135, 136, 148, 149, 161, 162,
    137, 138, 150, 151, 163, 164,
    139, 140, 152, 153, 165, 166,
    141, 142, 154, 155, 167, 168,
  ]);

  const QR_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/240px-QR_code_for_mobile_English_Wikipedia.svg.png';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <img src={QR_IMG} alt="QR de seguimiento" width={120} height={120} style={{ display: 'block', imageRendering: 'pixelated', border: '1px solid var(--ink-10)', padding: 6, background: 'var(--white)' }} />
      <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
        {value.slice(0, 16)}…
      </div>
    </div>
  );
}

function getPaymentAmount(operation: Operation | null) {
  if (!operation) {
    return 0;
  }

  return Math.max(18, operation.units * 0.45);
}

function getMarketplaceOrderLabel(operation: Operation) {
  const seed = operation.id.split('').reduce((accumulator, character, index) => {
    return accumulator + character.charCodeAt(0) * (index + 5);
  }, 0);

  const orderNumber = 10000 + (seed % 90000);
  return `Overshark / ${orderNumber}`;
}

export default function CustomerPortal() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [voucherGenerated, setVoucherGenerated] = useState(false);
  const [customerFlow, setCustomerFlow] = useState<CustomerFlow>('paid');

  const result = useMemo(() => buildLookup(submittedQuery), [submittedQuery]);
  const hasSearched = submittedQuery.trim().length > 0;
  const latestOperation = result?.operations[0] ?? null;
  const accessKey = result ? generateAccessKey(result.client, latestOperation) : '';
  const voucherCode = latestOperation ? `TRK-${latestOperation.id.replace('OP-', '')}-${result?.client.dni.slice(-3)}` : '';
  const paymentAmount = getPaymentAmount(latestOperation);
  const paymentPhone = '987 654 321';

  useEffect(() => {
    setVoucherGenerated(false);
  }, [submittedQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(query);
  };

  const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)' };
  const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontStyle: 'italic' };
  const label10: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)', ...mono };
  const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--ink-10)' };
  const paperCard: React.CSSProperties = { background: 'var(--paper)', border: '1px solid var(--ink-10)' };

  return (
    <div style={{ minHeight: '100%', padding: '36px 40px', background: 'var(--ink-05)', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1200 }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid var(--ink-10)', paddingBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ ...label10, marginBottom: 6 }}>Área de cliente</p>
          <h2 style={{ ...display, fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Portal de Seguimiento</h2>
        </div>
        <PackageSearch size={22} color="var(--ink-20)" />
      </div>

      {/* ── Search ── */}
      <div style={{ ...card, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.6 }}>
          Consulta el estado de tu envío ingresando tu DNI o el código de guía (ej: <span style={{ ...mono, fontSize: 12, color: 'var(--gold)' }}>12345678</span> o <span style={{ ...mono, fontSize: 12, color: 'var(--gold)' }}>OP-001</span>).
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="DNI o código de guía"
            className="input-field"
            style={{ flex: 1, ...mono, letterSpacing: '0.06em', fontSize: 12 }}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', flexShrink: 0 }}>
            <Search size={13} /> Buscar
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[['Canal', 'Web cliente'], ['Respuesta', 'Tiempo real'], ['Soporte', 'WhatsApp / Mail']].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--ink-05)', border: '1px solid var(--ink-10)', padding: '12px 14px' }}>
              <div style={{ ...label10, marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', ...mono }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Beneficios ── */}
      <div style={{ ...card, padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...label10, marginBottom: 16 }}>
          <ShieldCheck size={13} /> Beneficios para el cliente
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Estado claro del paquete sin llamar a oficina.',
            'Historial de movimientos por cliente y por guía.',
            'Contacto y destino visibles para reducir errores.',
          ].map((text) => (
            <div key={text} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 14, fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.5 }}>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Results area ── */}
      <div style={{ ...card, padding: '28px', minHeight: 260 }}>
        {!hasSearched && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 0', textAlign: 'center', color: 'var(--ink-20)' }}>
            <PackageSearch size={36} strokeWidth={1} />
            <div>
              <h3 style={{ ...display, fontSize: 22, color: 'var(--ink-40)', margin: '0 0 6px' }}>Portal de seguimiento</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-40)', ...mono, letterSpacing: '0.04em' }}>Ingresa un DNI o código de guía para comenzar</p>
            </div>
          </div>
        )}

        {hasSearched && !result && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 0', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, border: '1px solid var(--ink-20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--ink-40)', ...mono }}>?</div>
            <div>
              <h3 style={{ ...display, fontSize: 22, color: 'var(--ink)', margin: '0 0 6px' }}>Sin resultados</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-40)', ...mono }}>Verifica el DNI o la guía ingresada e intenta nuevamente.</p>
            </div>
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Client header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid var(--ink-10)', paddingBottom: 20 }}>
              <div>
                <p style={{ ...label10, marginBottom: 6 }}>Cliente identificado</p>
                <h3 style={{ ...display, fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>{result.client.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--ink-40)', ...mono, letterSpacing: '0.06em' }}>
                  DNI {result.client.dni} · {result.client.phone}
                </p>
              </div>
              <div style={{ background: 'var(--ink-05)', border: '1px solid var(--ink-10)', padding: '10px 16px', ...label10 }}>
                {latestOperation ? `Última guía: ${latestOperation.id}` : 'Sin movimientos'}
              </div>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { k: 'Estado actual', v: latestOperation ? getOperationStage(latestOperation) : 'Sin datos' },
                { k: 'Guías registradas', v: String(result.operations.length) },
                { k: 'Correo', v: result.client.email },
              ].map(({ k, v }) => (
                <div key={k} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 14 }}>
                  <div style={{ ...label10, marginBottom: 4 }}>{k}</div>
                  <div style={{ ...display, fontSize: 18, color: 'var(--ink)', wordBreak: 'break-all' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Modalidad */}
            <div style={{ ...paperCard, padding: '20px 24px' }}>
              <p style={{ ...label10, marginBottom: 14 }}>Modalidad del cliente</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {([['paid', 'Envío ya pagado', 'Muestra la clave directa de seguimiento al generar el voucher.'],
                   ['cash-on-delivery', 'Contra entrega', 'Reemplaza la clave por QR de pago Yape/Plin y número de transferencia.']] as const).map(([val, title, desc]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCustomerFlow(val)}
                    style={{
                      textAlign: 'left',
                      border: '1px solid',
                      borderColor: customerFlow === val ? 'var(--ink)' : 'var(--ink-20)',
                      background: customerFlow === val ? 'var(--ink)' : 'var(--white)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: customerFlow === val ? 'var(--gold)' : 'var(--ink)', ...mono, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 12, color: customerFlow === val ? 'rgba(255,255,255,0.7)' : 'var(--ink-60)', lineHeight: 1.5 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voucher + lateral panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(260px, 320px)', gap: 16, alignItems: 'start' }}>

              {/* Voucher panel */}
              <div style={{ ...card, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-10)', paddingBottom: 16 }}>
                  <div>
                    <p style={{ ...label10, marginBottom: 4 }}>Voucher y seguimiento</p>
                    <p style={{ ...display, fontSize: 18, color: 'var(--ink)', margin: 0 }}>Generación para cliente</p>
                  </div>
                  <Ticket size={18} color="var(--ink-20)" />
                </div>

                {!voucherGenerated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.6 }}>
                      Con el DNI validado, el cliente puede generar su voucher y activar su QR de seguimiento.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      {[['Documento', result.client.dni], ['Guía base', latestOperation?.id ?? 'Sin guía'], ['Canal', 'QR Web']].map(([k, v]) => (
                        <div key={k} style={{ background: 'var(--ink-05)', border: '1px solid var(--ink-10)', padding: '10px 12px' }}>
                          <div style={{ ...label10, marginBottom: 4 }}>{k}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', ...mono }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoucherGenerated(true)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '12px', fontSize: 11 }}
                    >
                      Generar voucher y QR
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: 11, fontWeight: 700, ...mono, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <CircleCheckBig size={15} /> Voucher generado
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        ['Código', voucherCode],
                        ['Cliente', result.client.name.toUpperCase()],
                        ['DNI', result.client.dni],
                        ['Guía', latestOperation?.id ?? 'Sin guía'],
                        ['Estado', latestOperation ? getOperationStage(latestOperation) : 'Sin datos'],
                      ].map(([k, v], i) => (
                        <div key={k} style={{ ...paperCard, padding: '10px 12px', ...(i === 4 ? { gridColumn: '1 / -1' } : {}) }}>
                          <div style={{ ...label10, marginBottom: 4 }}>{k}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink)', ...mono, wordBreak: 'break-all' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ border: '1px solid var(--ink-10)', background: 'var(--ink-05)', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <TrackingQr value={`${voucherCode}-${accessKey}`} />
                      <p style={{ ...label10 }}>QR de seguimiento activo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lateral: clave / pago */}
              <div style={{ ...card, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-10)', paddingBottom: 16 }}>
                  <div>
                    <p style={{ ...label10, marginBottom: 4 }}>{customerFlow === 'paid' ? 'Clave lateral' : 'Pago lateral'}</p>
                    <p style={{ ...display, fontSize: 18, color: 'var(--ink)', margin: 0 }}>{customerFlow === 'paid' ? 'Acceso de seguimiento' : 'Cobro contra entrega'}</p>
                  </div>
                  {customerFlow === 'paid' ? <KeyRound size={18} color="var(--ink-20)" /> : <Smartphone size={18} color="var(--ink-20)" />}
                </div>

                {customerFlow === 'paid' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ border: '1px dashed var(--ink-20)', background: 'var(--paper)', padding: '20px', textAlign: 'center' }}>
                      <p style={{ ...label10, marginBottom: 10 }}>Clave única</p>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, letterSpacing: '0.3em', color: 'var(--ink)', lineHeight: 1 }}>{accessKey}</div>
                    </div>
                    {['Usa esta clave para abrir el seguimiento desde cualquier dispositivo.', 'Comparte el QR o la clave con el destinatario final.', 'Si generas un nuevo voucher, la clave permanece asociada al DNI.'].map((t) => (
                      <div key={t} style={{ ...paperCard, padding: '10px 14px', fontSize: 12, color: 'var(--ink-60)', lineHeight: 1.5 }}>{t}</div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ border: '1px dashed var(--ink-20)', background: 'var(--paper)', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <p style={{ ...label10 }}>QR de pago</p>
                      <TrackingQr value={`PAY-${voucherCode}-${paymentPhone}-${paymentAmount.toFixed(2)}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...label10 }}>
                        <QrCode size={12} /> Pago por Yape o Plin
                      </div>
                    </div>
                    <div style={{ ...paperCard, padding: '12px 14px' }}>
                      <p style={{ ...label10, marginBottom: 4 }}>Monto a pagar</p>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>S/ {paymentAmount.toFixed(2)}</div>
                    </div>
                    <div style={{ ...paperCard, padding: '12px 14px' }}>
                      <p style={{ ...label10, marginBottom: 4 }}>Número para transferir</p>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>{paymentPhone}</div>
                    </div>
                    <div style={{ ...paperCard, padding: '10px 14px', fontSize: 12, color: 'var(--ink-60)', lineHeight: 1.5 }}>
                      El cliente puede escanear el QR o enviar el dinero al número indicado y compartir el comprobante.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History + route */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Historial */}
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ background: 'var(--ink)', padding: '11px 16px' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white)', ...mono }}>Historial del cliente</span>
                </div>
                <div>
                  {result.operations.map((operation, i) => (
                    <div key={operation.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--ink-05)', background: i % 2 === 0 ? 'var(--ink-05)' : 'var(--white)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--gold)', ...mono, letterSpacing: '0.06em', marginBottom: 4 }}>
                          {getMarketplaceOrderLabel(operation)}
                        </div>
                        <div style={{ ...display, fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>{operation.productName}</div>
                        <div style={{ ...label10 }}>{operation.type} · {operation.date} · {operation.id}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ ...label10, marginBottom: 4 }}>Estado</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', ...mono }}>{getOperationStage(operation)}</div>
                        <div style={{ ...label10, marginTop: 4 }}>{operation.units} uds.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ruta */}
              <div style={{ ...card, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ ...label10 }}>Ruta y confirmación</p>
                <div style={{ border: '1px solid var(--ink-10)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CircleCheckBig size={18} color="var(--green)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Registro validado</div>
                      <div style={{ ...label10, marginTop: 2 }}>Datos del cliente encontrados</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MapPin size={18} color="var(--gold)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Destino visible para el cliente</div>
                      <div style={{ ...label10, marginTop: 2 }}>Seguimiento transparente</div>
                    </div>
                  </div>
                </div>

                {/* Mini route map */}
                <div style={{ flex: 1, minHeight: 160, background: '#f8f8f6', border: '1px solid var(--ink-10)', position: 'relative', overflow: 'hidden' }}>
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
                    <defs>
                      <pattern id="pgrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--ink-10)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pgrid2)" />
                    <polyline points="50,30 110,70 180,50 240,110 300,80" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
                  </svg>
                  <div style={{ position: 'absolute', top: '18%', left: '16%', width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid white', boxShadow: '0 0 0 3px rgba(28,124,84,0.2)' }} />
                  <div style={{ position: 'absolute', top: '44%', left: '52%', width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', border: '2px solid white', boxShadow: '0 0 0 3px rgba(184,151,62,0.2)' }} className="pulse-dot" />
                  <div style={{ position: 'absolute', bottom: '22%', right: '14%', width: 10, height: 10, borderRadius: '50%', background: 'var(--ink-20)', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 12, ...label10 }}>Ruta activa · Lima → Destino</div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
