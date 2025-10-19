import React, { useMemo, useState, useEffect } from 'react';
import { dashboardData, loans, payments } from '../data/mockData';

const parsePtDate = (str) => {
  // Expecting DD/MM/YYYY; fallback to invalid Date if not matching
  const parts = (str || '').split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

const Reports = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [memberQuery, setMemberQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredPayments = useMemo(() => {
    const from = parsePtDate(fromDate);
    const to = parsePtDate(toDate);
    const memberQ = memberQuery.trim().toLowerCase();
    const loansById = new Map(loans.map((l) => [l.id, l]));

    return (payments || []).filter((p) => {
      const loan = loansById.get(p.loanId);
      if (!loan) return false;
      if (memberQ) {
        const name = (loan.member || '').toLowerCase();
        if (!name.includes(memberQ)) return false;
      }
      if (from) {
        const d = parsePtDate(p.date);
        if (!d || d < from) return false;
      }
      if (to) {
        const d = parsePtDate(p.date);
        if (!d || d > to) return false;
      }
      return true;
    });
  }, [fromDate, toDate, memberQuery]);

  const exportCSV = () => {
    const header = ['Data','Membro','Valor'];
    const rows = filteredPayments.map((p) => {
      const loan = loans.find((l) => l.id === p.loanId);
      return [p.date, (loan?.member || '-'), String(Number(p.amount))];
    });
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_pagamentos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totals = useMemo(() => {
    const totalLoaned = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalPaid = filteredPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const today = new Date();
    const overdueLoans = loans.filter((l) => {
      const d = parsePtDate(l.dueDate);
      return d && d < today;
    });
    const overdueCount = overdueLoans.length;
    const overdueAmount = overdueLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    return { totalLoaned, totalPaid, overdueCount, overdueAmount };
  }, [filteredPayments]);

  const exportPDF = () => {
    const rows = filteredPayments.map((p) => {
      const loan = loans.find((l) => l.id === p.loanId);
      return { date: p.date, member: loan?.member || '-', amount: Number(p.amount) };
    });
    const now = new Date().toLocaleString();
    const sum = rows.reduce((s,r)=> s + (r.amount||0), 0);
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Relatório de Pagamentos</title>
    <style>
      @page { size: A4; margin: 20mm; }
      *{box-sizing:border-box}
      body{font-family: Arial, sans-serif; color:#111827;}
      header{position: fixed; top: -10mm; left: 0; right: 0; height: 10mm; display:flex; align-items:center; justify-content:space-between; font-size:12px;}
      footer{position: fixed; bottom: -10mm; left: 0; right: 0; height: 10mm; display:flex; align-items:center; justify-content:space-between; font-size:12px; color:#6b7280}
      .pagenum:before { content: counter(page); }
      .totalpages:before { content: counter(pages); }
      .content{margin-top: 8mm;}
      h1{margin:0 0 8px 0; font-size:18px}
      .meta{font-size:12px; color:#6b7280; margin-bottom: 8px}
      .kpis{display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin: 8px 0 12px 0}
      .card{border:1px solid #e5e7eb; border-radius:8px; padding:8px}
      table{width:100%; border-collapse: collapse; margin-top: 8px}
      thead{display: table-header-group}
      tfoot{display: table-row-group}
      tr{page-break-inside: avoid}
      th,td{text-align:left; padding:8px; border-bottom:1px solid #e5e7eb; font-size:12px}
      th{color:#6b7280; font-weight:600}
      .right{text-align:right}
    </style></head><body>
      <header>
        <div style=\"display:flex;align-items:center;gap:8px\"><img src=\"/malabo-logo.svg\" style=\"width:18px;height:18px\"/> <strong>Malabo Microcrédito</strong></div>
        <div>Relatório de Pagamentos</div>
      </header>
      <footer>
        <div>Emitido em ${now}</div>
        <div>Página <span class=\"pagenum\"></span> de <span class=\"totalpages\"></span></div>
      </footer>
      <div class=\"content\">
        <h1>Pagamentos</h1>
        <div class=\"meta\">Filtros: De ${fromDate || '-'} Até ${toDate || '-'} | Membro: ${memberQuery || '-'}</div>
        <div class=\"kpis\">
          <div class=\"card\"><div>Total Emprestado</div><div><strong>MT ${totals.totalLoaned.toLocaleString()}</strong></div></div>
          <div class=\"card\"><div>Total Pago (filtrado)</div><div><strong>MT ${totals.totalPaid.toLocaleString()}</strong></div></div>
          <div class=\"card\"><div>Em Atraso</div><div><strong>${totals.overdueCount} / MT ${totals.overdueAmount.toLocaleString()}</strong></div></div>
        </div>
        <table><thead><tr><th>Data</th><th>Membro</th><th class=\"right\">Valor (MT)</th></tr></thead><tbody>
          ${rows.map(r=>`<tr><td>${r.date}</td><td>${r.member}</td><td class=\\"right\\">${r.amount.toLocaleString()}</td></tr>`).join('')}
        </tbody><tfoot><tr><td></td><td style=\"text-align:right;font-weight:600\">Total</td><td class=\"right\" style=\"font-weight:700\">${sum.toLocaleString()}</td></tr></tfoot></table>
      </div>
      <script>window.print()</script>
    </body></html>`;
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem',
      backgroundColor: '#ffffff', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Relatórios
        </h1>
        <div style={{ display:'flex', gap:'0.5rem' }}>
        <button onClick={exportCSV} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          onMouseOver={(e)=> e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e)=> e.currentTarget.style.backgroundColor = '#2563eb'}
        >Exportar CSV</button>
        <button onClick={exportPDF} style={{ backgroundColor: '#374151', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          onMouseOver={(e)=> e.currentTarget.style.backgroundColor = '#111827'}
          onMouseOut={(e)=> e.currentTarget.style.backgroundColor = '#374151'}
        >Exportar PDF</button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.75rem',
        padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '0.5rem' : '0.75rem' }}>
          <div>
            <label style={{ display: 'block', color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>De (DD/MM/AAAA)</label>
            <input type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              placeholder="01/01/2023"
              style={{ width: '100%', backgroundColor: '#fff', color: '#1f2937', padding: isMobile ? '0.5rem' : '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: isMobile ? '0.75rem' : '0.875rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Até (DD/MM/AAAA)</label>
            <input type="text" value={toDate} onChange={(e) => setToDate(e.target.value)}
              placeholder="31/12/2023"
              style={{ width: '100%', backgroundColor: '#fff', color: '#1f2937', padding: isMobile ? '0.5rem' : '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: isMobile ? '0.75rem' : '0.875rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Membro</label>
            <input type="text" value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)}
              placeholder="Ex.: Maria"
              style={{ width: '100%', backgroundColor: '#fff', color: '#1f2937', padding: isMobile ? '0.5rem' : '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: isMobile ? '0.75rem' : '0.875rem', outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: isMobile ? '0.75rem' : '1rem' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Emprestado</h3>
          <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>MT {totals.totalLoaned.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Pago (filtrado)</h3>
          <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#10b981' }}>MT {totals.totalPaid.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Em Atraso (Qtd)</h3>
          <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>{totals.overdueCount}</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '0.75rem' : '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Em Atraso (Montante)</h3>
          <p style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>MT {totals.overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabela de pagamentos filtrados */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Pagamentos (Resultados)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', color: '#6b7280', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500 }}>Data</th>
                <th style={{ textAlign: 'left', color: '#6b7280', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500 }}>Membro</th>
                <th style={{ textAlign: 'left', color: '#6b7280', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 500 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => {
                const loan = loans.find((l) => l.id === p.loanId);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ color: '#1f2937', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', wordBreak: 'break-word' }}>{p.date}</td>
                    <td style={{ color: '#374151', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', wordBreak: 'break-word' }}>{loan?.member || '-'}</td>
                    <td style={{ color: '#1f2937', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem', wordBreak: 'break-word' }}>MT {Number(p.amount).toLocaleString()}</td>
                  </tr>
                );
              })}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ color: '#6b7280', padding: isMobile ? '0.5rem 0' : '0.75rem 0', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Sem resultados para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
