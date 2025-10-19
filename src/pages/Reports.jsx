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

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem',
      backgroundColor: '#ffffff', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Relatórios
        </h1>
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
