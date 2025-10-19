import React, { useEffect, useMemo, useState } from 'react';
import { members, loans, payments, users as mockUsers } from '../data/mockData';

const ClientPortal = () => {
  const [isMobile, setIsMobile] = useState(false);
  const userName = (() => { try { return localStorage.getItem('userName') || ''; } catch { return ''; } })();
  const username = (() => { try { return localStorage.getItem('username') || ''; } catch { return ''; } })();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('users');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const map = new Map();
          arr.forEach(u => { if (u && u.username) map.set(String(u.username).toLowerCase(), u); });
          const fromLocal = map.get(String(username).toLowerCase()) || null;
          // Se não achar no local ou faltar memberId, tentar mockUsers
          const fromMock = (mockUsers || []).find(u => String(u.username).toLowerCase() === String(username).toLowerCase()) || null;
          if (fromLocal && (fromLocal.memberId || (fromMock && fromMock.memberId))) {
            // enriquecer com memberId do mock se faltar
            if (!fromLocal.memberId && fromMock && fromMock.memberId) {
              try {
                const enriched = arr.map(u => u.username === fromLocal.username ? { ...u, memberId: fromMock.memberId } : u);
                localStorage.setItem('users', JSON.stringify(enriched));
              } catch {}
              return { ...fromLocal, memberId: fromMock.memberId };
            }
            return fromLocal;
          }
          // fallback: usar mock diretamente
          return fromMock || fromLocal;
        }
      }
    } catch {}
    return null;
  }, [username]);

  const clientMember = useMemo(() => {
    // 1) Preferir memberId do utilizador atual
    const memberId = currentUser && currentUser.memberId ? Number(currentUser.memberId) : null;
    if (memberId) {
      const byId = (members || []).find(m => Number(m.id) === memberId);
      if (byId) return byId;
    }
    // 2) Fallback por nome (userName ↔ members.name)
    const nm = (userName || '').trim();
    if (nm) {
      const byName = (members || []).find(m => (m.name || '').trim().toLowerCase() === nm.toLowerCase());
      if (byName) return byName;
    }
    return null;
  }, [currentUser, userName]);

  const clientLoans = useMemo(() => {
    if (!clientMember) return [];
    return (loans || []).filter(l => (l.member || '').trim().toLowerCase() === (clientMember.name || '').trim().toLowerCase());
  }, [clientMember]);

  const clientPayments = useMemo(() => {
    const ids = new Set(clientLoans.map(l => l.id));
    return (payments || []).filter(p => ids.has(p.loanId));
  }, [clientLoans]);

  const parsePtDate = (v) => {
    if (!v) return null;
    const [d, m, y] = String(v).split('/').map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
  };

  const getAttachmentsForLoan = (loanId) => {
    try {
      const raw = localStorage.getItem('loanAttachments');
      if (!raw) return [];
      const map = JSON.parse(raw) || {};
      return map[String(loanId)] || [];
    } catch { return []; }
  };

  // Alerts: vencidos e próximos 7 dias
  const alerts = useMemo(() => {
    const today = new Date();
    const in7 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const overdue = [];
    const upcoming = [];
    (clientLoans || []).forEach((l) => {
      const d = parsePtDate(l.dueDate);
      if (!d) return;
      if (d < today) overdue.push(l);
      else if (d >= today && d <= in7) upcoming.push(l);
    });
    // ordenar por data
    overdue.sort((a,b)=> parsePtDate(a.dueDate)-parsePtDate(b.dueDate));
    upcoming.sort((a,b)=> parsePtDate(a.dueDate)-parsePtDate(b.dueDate));
    return { overdue, upcoming };
  }, [clientLoans]);

  // Export CSV de pagamentos do cliente
  const exportCSV = () => {
    const header = ['Empréstimo','Data','Valor'];
    const rows = (clientPayments || []).map((p) => [String(p.loanId), p.date, String(Number(p.amount))]);
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'meus_pagamentos.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Recibo por pagamento (estilizado)
  const openReceipt = (payment, loan) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Recibo</title>
    <style>
      *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111827;background:#f9fafb;padding:24px}
      .receipt{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.06);overflow:hidden}
      .header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e5e7eb}
      .brand{display:flex;align-items:center;gap:12px}.logo{width:40px;height:40px;border-radius:9999px;border:1px solid #e5e7eb;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center}
      .brand h1{margin:0;font-size:16px;color:#111827}.doc{text-align:right}.doc h2{margin:0;font-size:18px;color:#111827}.doc p{margin:2px 0;font-size:12px;color:#6b7280}
      .section{padding:16px 20px}.two-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}.label{color:#6b7280;font-size:12px;margin-bottom:4px}.value{color:#111827;font-size:14px;font-weight:600}
      .table{width:100%;border-collapse:collapse;margin-top:8px}.table th,.table td{text-align:left;padding:10px;border-bottom:1px solid #e5e7eb;font-size:14px}.table th{color:#6b7280;font-weight:600;font-size:12px}
      .total{text-align:right;padding:12px 0;font-size:16px;font-weight:700;color:#111827}.footer{padding:12px 20px 20px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between}
      .actions{display:flex;gap:8px}.btn{background:#2563eb;color:#fff;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:14px}
      @media print{.actions{display:none}body{background:#fff;padding:0}.receipt{border:none;box-shadow:none;border-radius:0}}
    </style></head><body>
    <div class="receipt">
      <div class="header">
        <div class="brand"><div class="logo"><img src="/malabo-logo.svg" alt="Malabo"/></div><h1>Malabo Microcrédito</h1></div>
        <div class="doc"><h2>Recibo de Pagamento</h2><p>Empréstimo #${loan.id}</p></div>
      </div>
      <div class="section two-cols">
        <div><div class="label">Membro</div><div class="value">${loan.member}</div></div>
        <div><div class="label">Data do Pagamento</div><div class="value">${payment.date}</div></div>
      </div>
      <div class="section">
        <table class="table"><thead><tr><th>Descrição</th><th>Valor (MT)</th></tr></thead><tbody>
          <tr><td>Pagamento referente ao empréstimo #${loan.id}</td><td>${Number(payment.amount).toLocaleString()}</td></tr>
        </tbody></table>
        <div class="total">Total: MT ${Number(payment.amount).toLocaleString()}</div>
      </div>
      <div class="footer"><span>Gerado automaticamente pelo sistema.</span><div class="actions"><button class="btn" onclick="window.print()">Imprimir</button><button class="btn" onclick="window.close()">Fechar</button></div></div>
    </div></body></html>`;
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); }
  };

  // Perfil: contacto (override local)
  const contact = useMemo(() => {
    if (!clientMember) return '';
    try {
      const raw = localStorage.getItem('memberOverrides');
      if (raw) {
        const map = JSON.parse(raw) || {};
        const ov = map[String(clientMember.id)];
        if (ov && ov.contact) return ov.contact;
      }
    } catch {}
    return clientMember.contact || '';
  }, [clientMember]);

  const [editContact, setEditContact] = useState('');
  useEffect(() => { setEditContact(contact); }, [contact]);

  // Modal de detalhes de empréstimo
  const [detailLoan, setDetailLoan] = useState(null);

  const saveContact = () => {
    if (!clientMember) return;
    try {
      const raw = localStorage.getItem('memberOverrides');
      const map = raw ? (JSON.parse(raw) || {}) : {};
      map[String(clientMember.id)] = { ...(map[String(clientMember.id)]||{}), contact: editContact };
      localStorage.setItem('memberOverrides', JSON.stringify(map));
    } catch {}
  };

  const kpis = useMemo(() => {
    const totalLoaned = clientLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalPaid = clientPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const remaining = Math.max(totalLoaned - totalPaid, 0);
    const today = new Date();
    const overdueLoans = clientLoans.filter(l => {
      const d = parsePtDate(l.dueDate);
      return d && d < today;
    });
    return { totalLoaned, totalPaid, remaining, overdueCount: overdueLoans.length };
  }, [clientLoans, clientPayments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem', backgroundColor: '#fff', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Meu Portal</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Bem-vindo, {userName || 'Cliente'}</p>
        </div>
        <button onClick={exportCSV} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          onMouseOver={(e)=> e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e)=> e.currentTarget.style.backgroundColor = '#2563eb'}
        >Exportar Pagamentos (CSV)</button>
      </div>

      {!clientMember && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Não foi possível associar seu perfil a um membro. Peça ao administrador para vincular seu <strong>Nome</strong> ao registo de membros.
          </p>
        </div>
      )}

      {clientMember && (
        <>
          {/* Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'0.75rem', padding:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: 0, marginBottom: '0.5rem', color:'#1f2937', fontSize:'1rem', fontWeight:600 }}>Vencimentos Próximos (7 dias)</h3>
              {(alerts.upcoming || []).map((l)=>(
                <div key={l.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.5rem', alignItems:'center', fontSize:'0.875rem', color:'#374151' }}>
                  <span>Empréstimo #{l.id}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span>{l.dueDate}</span>
                    <button onClick={() => setDetailLoan(l)} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', cursor:'pointer', fontSize:'0.75rem' }}>Ver detalhes</button>
                  </div>
                </div>
              ))}
              {alerts.upcoming.length === 0 && (<div style={{ color:'#6b7280', fontSize:'0.875rem' }}>Sem vencimentos nos próximos 7 dias.</div>)}
            </div>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'0.75rem', padding:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: 0, marginBottom: '0.5rem', color:'#1f2937', fontSize:'1rem', fontWeight:600 }}>Em Atraso</h3>
              {(alerts.overdue || []).map((l)=>(
                <div key={l.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.5rem', alignItems:'center', fontSize:'0.875rem', color:'#ef4444' }}>
                  <span>Empréstimo #{l.id}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span>{l.dueDate}</span>
                    <button onClick={() => setDetailLoan(l)} style={{ background:'#ef4444', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', cursor:'pointer', fontSize:'0.75rem' }}>Ver detalhes</button>
                  </div>
                </div>
              ))}
              {alerts.overdue.length === 0 && (<div style={{ color:'#6b7280', fontSize:'0.875rem' }}>Sem empréstimos em atraso.</div>)}
            </div>
          </div>

          {/* Perfil - contacto */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'0.75rem', padding:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color:'#1f2937', fontSize:'1rem', fontWeight:600 }}>Meus Dados</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 200px', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ display:'block', color:'#374151', fontSize:'0.875rem', fontWeight:500, marginBottom:'0.25rem' }}>Contacto</label>
                <input type="text" value={editContact} onChange={(e)=> setEditContact(e.target.value)}
                  style={{ width:'100%', background:'#fff', color:'#1f2937', padding:'0.75rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', fontSize:'0.875rem', outline:'none' }} />
              </div>
              <button onClick={saveContact} style={{ background:'#2563eb', color:'#fff', padding:'0.75rem 1rem', borderRadius:'0.5rem', border:'none', cursor:'pointer', fontSize:'0.875rem', fontWeight:500 }}>Guardar</button>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: isMobile ? '0.75rem' : '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0, marginBottom: '0.25rem' }}>Total Emprestado</h3>
              <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>MT {kpis.totalLoaned.toLocaleString()}</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0, marginBottom: '0.25rem' }}>Total Pago</h3>
              <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>MT {kpis.totalPaid.toLocaleString()}</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0, marginBottom: '0.25rem' }}>Em Dívida</h3>
              <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>MT {kpis.remaining.toLocaleString()}</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0, marginBottom: '0.25rem' }}>Em Atraso (Qtd)</h3>
              <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>{kpis.overdueCount}</p>
            </div>
          </div>

          {/* Loans */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {clientLoans.map((l) => (
              <div key={l.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1rem', fontWeight: 600 }}>Empréstimo #{l.id}</h3>
                  <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>{l.status}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <p style={{ margin: 0 }}>Valor: <span style={{ color: '#1f2937', fontWeight: 600 }}>MT {Number(l.amount).toLocaleString()}</span></p>
                  <p style={{ margin: 0 }}>Data: <span style={{ color: '#1f2937', fontWeight: 600 }}>{l.date}</span></p>
                  <p style={{ margin: 0 }}>Vencimento: <span style={{ color: '#1f2937', fontWeight: 600 }}>{l.dueDate}</span></p>
                </div>
                <div>
                  <h4 style={{ margin: '0.5rem 0', color: '#1f2937', fontSize: '0.95rem', fontWeight: 600 }}>Pagamentos</h4>
                  {(payments || []).filter(p => p.loanId === l.id).map((p) => (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', alignItems: 'center', color: '#374151', fontSize: '0.875rem' }}>
                      <span>{p.date}</span>
                      <span>MT {Number(p.amount).toLocaleString()}</span>
                      <button onClick={() => openReceipt(p, l)} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', cursor:'pointer', fontSize:'0.75rem' }}>Recibo</button>
                    </div>
                  ))}
                  {((payments || []).filter(p => p.loanId === l.id).length === 0) && (
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Sem pagamentos.</div>
                  )}
                </div>
              </div>
            ))}
            {clientLoans.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Sem empréstimos associados ao seu perfil.</div>
            )}
          </div>
        </>
      )}

      {/* Modal Detalhes do Empréstimo */}
      {detailLoan && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
          <div style={{ background:'#fff', borderRadius:'0.75rem', padding:'1.25rem', width:'100%', maxWidth:'32rem', margin:'1rem', border:'1px solid #e5e7eb', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
              <h3 style={{ margin:0, color:'#1f2937', fontSize:'1.125rem', fontWeight:600 }}>Empréstimo #{detailLoan.id}</h3>
              <button onClick={() => setDetailLoan(null)} style={{ background:'#6b7280', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.5rem 0.75rem', cursor:'pointer', fontSize:'0.875rem' }}>Fechar</button>
            </div>
            <div style={{ color:'#6b7280', fontSize:'0.9rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              <div>Valor: <span style={{ color:'#1f2937', fontWeight:600 }}>MT {Number(detailLoan.amount).toLocaleString()}</span></div>
              <div>Status: <span style={{ color:'#1f2937', fontWeight:600 }}>{detailLoan.status}</span></div>
              <div>Data: <span style={{ color:'#1f2937', fontWeight:600 }}>{detailLoan.date}</span></div>
              <div>Vencimento: <span style={{ color:'#1f2937', fontWeight:600 }}>{detailLoan.dueDate}</span></div>
            </div>
            <div style={{ marginTop:'1rem' }}>
              <h4 style={{ margin:'0 0 0.5rem 0', color:'#1f2937', fontSize:'1rem', fontWeight:600 }}>Pagamentos</h4>
              {(payments || []).filter(p => p.loanId === detailLoan.id).map((p)=>(
                <div key={p.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0.5rem', alignItems:'center', color:'#374151', fontSize:'0.875rem' }}>
                  <span>{p.date}</span>
                  <span>MT {Number(p.amount).toLocaleString()}</span>
                  <button onClick={() => openReceipt(p, detailLoan)} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', cursor:'pointer', fontSize:'0.75rem' }}>Recibo</button>
                </div>
              ))}
              {((payments || []).filter(p => p.loanId === detailLoan.id).length === 0) && (
                <div style={{ color:'#6b7280', fontSize:'0.875rem' }}>Sem pagamentos.</div>
              )}
            </div>
            <div style={{ marginTop:'1rem' }}>
              <h4 style={{ margin:'0 0 0.5rem 0', color:'#1f2937', fontSize:'1rem', fontWeight:600 }}>Contratos</h4>
              {(() => {
                const atts = getAttachmentsForLoan(detailLoan.id);
                if (!atts || atts.length === 0) {
                  return <div style={{ color:'#6b7280', fontSize:'0.875rem' }}>Sem contratos anexados.</div>;
                }
                return (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                    {atts.map(a => (
                      <div key={a.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.875rem', color:'#374151' }}>
                        <span title={`${a.name} (${a.size} bytes)`}>{a.name}</span>
                        <span style={{ color:'#6b7280' }}>{a.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
