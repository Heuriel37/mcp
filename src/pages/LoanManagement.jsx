import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { members, loans, payments as initialPayments } from '../data/mockData';

const LoanManagement = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanMonths, setLoanMonths] = useState(9);
  const [interestRate, setInterestRate] = useState(0);
  const [showLoanForm, setShowLoanForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registrar empréstimo:', { 
      member: selectedMember, 
      amount: loanAmount, 
      months: loanMonths, 
      interest: interestRate 
    });
    setLoanAmount(0);
    setSelectedMember('');
    setLoanMonths(9);
    setInterestRate(0);
    setShowLoanForm(false);
  };

  const handleAddAttachment = (loanId, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 5);
    const readers = files.map((f, idx) => new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve({
        id: Date.now() + '-' + idx,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        uploadedAt: new Date().toLocaleString(),
        dataUrl: fr.result
      });
      fr.readAsDataURL(f);
    }));
    Promise.all(readers).then((arr) => {
      const prev = attachmentsByLoan[String(loanId)] || [];
      setAttachmentsByLoan({ ...attachmentsByLoan, [String(loanId)]: [...prev, ...arr] });
    });
  };

  const handleRemoveAttachment = (loanId, attId) => {
    const prev = attachmentsByLoan[String(loanId)] || [];
    setAttachmentsByLoan({ ...attachmentsByLoan, [String(loanId)]: prev.filter(a => a.id !== attId) });
  };

  const [isMobile, setIsMobile] = useState(false);
  const role = (() => { try { return localStorage.getItem('role') || 'admin'; } catch { return 'admin'; } })();
  const [payments, setPayments] = useState(initialPayments || []);
  const [newPaymentByLoan, setNewPaymentByLoan] = useState({});
  const [paymentModalLoanId, setPaymentModalLoanId] = useState(null);
  const [manageLoanId, setManageLoanId] = useState(null);
  const [attachmentsByLoan, setAttachmentsByLoan] = useState(() => {
    try {
      const raw = localStorage.getItem('loanAttachments');
      if (raw) {
        const obj = JSON.parse(raw);
        return obj && typeof obj === 'object' ? obj : {};
      }
    } catch {}
    return {};
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('loanAttachments', JSON.stringify(attachmentsByLoan)); } catch {}
  }, [attachmentsByLoan]);

  const getLoanPayments = (loanId) => payments.filter(p => p.loanId === loanId);
  const getTotalPaid = (loanId) => getLoanPayments(loanId).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const openReceipt = (payment, loan) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Recibo</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; color: #111827; background: #f9fafb; padding: 24px; }
      .receipt { max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden; }
      .header { display:flex; align-items:center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
      .brand { display:flex; align-items:center; gap: 12px; }
      .logo { width: 40px; height: 40px; border-radius:9999px; border:1px solid #e5e7eb; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center; }
      .logo img { width: 100%; height: 100%; object-fit: contain; }
      .brand h1 { margin:0; font-size: 16px; color:#111827; }
      .doc { text-align:right; }
      .doc h2 { margin:0; font-size: 18px; color:#111827; }
      .doc p { margin:2px 0; font-size:12px; color:#6b7280; }
      .section { padding: 16px 20px; }
      .two-cols { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .label { color:#6b7280; font-size:12px; margin-bottom:4px; }
      .value { color:#111827; font-size:14px; font-weight:600; }
      .table { width:100%; border-collapse: collapse; margin-top: 8px; }
      .table th, .table td { text-align:left; padding: 10px; border-bottom:1px solid #e5e7eb; font-size:14px; }
      .table th { color:#6b7280; font-weight:600; font-size:12px; }
      .total { text-align:right; padding: 12px 0; font-size:16px; font-weight:700; color:#111827; }
      .footer { padding: 12px 20px 20px; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb; display:flex; align-items:center; justify-content: space-between; }
      .actions { display:flex; gap:8px; }
      .btn { background:#2563eb; color:#fff; border:none; border-radius:8px; padding:8px 12px; cursor:pointer; font-size:14px; }
      @media print { .actions { display:none; } body { background:#fff; padding:0; } .receipt { border:none; box-shadow:none; border-radius:0; } }
    </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="brand">
            <div class="logo"><img src="/malabo-logo.svg" alt="Malabo"/></div>
            <h1>Malabo Microcrédito</h1>
          </div>
          <div class="doc">
            <h2>Recibo de Pagamento</h2>
            <p>ID: ${payment.id}</p>
          </div>
        </div>
        <div class="section two-cols">
          <div>
            <div class="label">Membro</div>
            <div class="value">${loan.member}</div>
          </div>
          <div>
            <div class="label">Data do Pagamento</div>
            <div class="value">${payment.date}</div>
          </div>
        </div>
        <div class="section">
          <table class="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor (MT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pagamento referente ao empréstimo de ${loan.member}</td>
                <td>${Number(payment.amount).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total: MT ${Number(payment.amount).toLocaleString()}</div>
        </div>
        <div class="footer">
          <span>Gerado automaticamente pelo sistema.</span>
          <div class="actions">
            <button class="btn" onclick="window.print()">Imprimir</button>
            <button class="btn" onclick="window.close()">Fechar</button>
          </div>
        </div>
      </div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  const handleAddPayment = (loan) => {
    // Apenas admin, tecnico e agente podem registar pagamentos
    if (!['admin','tecnico','agente'].includes(role)) return;
    const form = newPaymentByLoan[loan.id] || { date: '', amount: '' };
    if (!form.date || !form.amount) return;
    const nextId = (payments[payments.length - 1]?.id || 0) + 1;
    const newPay = { id: nextId, loanId: loan.id, date: form.date, amount: Number(form.amount) };
    setPayments([...payments, newPay]);
    setNewPaymentByLoan({ ...newPaymentByLoan, [loan.id]: { date: '', amount: '' } });
    openReceipt(newPay, loan);
    setPaymentModalLoanId(null);
  };
  

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '1rem' : '2rem',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: isMobile ? '1rem' : '1.5rem'
      }}>
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0
        }}>
          Gestão de Empréstimos
        </h1>
      </div>

      {/* Add Loan Button (apenas admin/tecnico) */}
      {(['admin','tecnico'].includes(role)) && (
        <div>
          <button
            onClick={() => setShowLoanForm(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Novo Empréstimo</span>
          </button>
        </div>
      )}

      {/* Loan Form Modal */}
      {showLoanForm && (['admin','tecnico'].includes(role)) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '28rem',
            margin: '1rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Novo Empréstimo
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Membro
                </label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                  required
                >
                  <option value="">Selecionar membro</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name} - {member.memberNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Valor do Empréstimo (MT)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Prazo (meses)
                </label>
                <select
                  value={loanMonths}
                  onChange={(e) => setLoanMonths(Number(e.target.value))}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                  required
                >
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={9}>9 meses</option>
                  <option value={12}>12 meses</option>
                  <option value={18}>18 meses</option>
                  <option value={24}>24 meses</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Taxa de Juros (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoanForm(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loans Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {loans.map((loan) => {
          const totalPaid = getTotalPaid(loan.id);
          const remaining = Math.max(loan.amount - totalPaid, 0);
          const np = newPaymentByLoan[loan.id] || { date: '', amount: '' };
          return (
          <div key={loan.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                {loan.member}
              </h3>
              <span style={{
                backgroundColor: loan.status === 'Em dia' ? '#10b981' : '#ef4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {loan.status}
              </span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <p>Valor: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>MT {loan.amount.toLocaleString()}</span></p>
              <p>Data: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{loan.date}</span></p>
              <p>Vencimento: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{loan.dueDate}</span></p>
              <p>Pago: <span style={{ fontWeight: 'bold', color: '#10b981' }}>MT {totalPaid.toLocaleString()}</span></p>
              <p>Em dívida: <span style={{ fontWeight: 'bold', color: remaining > 0 ? '#ef4444' : '#1f2937' }}>MT {remaining.toLocaleString()}</span></p>
            </div>
            {/* Pagamentos */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              padding: '1rem'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#1f2937', fontSize: '0.95rem', fontWeight: 600 }}>Pagamentos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getLoanPayments(loan.id).map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#374151', fontSize: '0.875rem' }}>
                    <span>{p.date}</span>
                    <span>MT {p.amount.toLocaleString()}</span>
                  </div>
                ))}
                {getLoanPayments(loan.id).length === 0 && (
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Sem pagamentos registados.</span>
                )}
              </div>
              {/* Botão de registrar pagamento movido para o modal Gerenciar */}
            </div>
            {(['admin','tecnico','agente'].includes(role)) && (
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setManageLoanId(loan.id)}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #059669',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    alignSelf: 'flex-end'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >Gerenciar</button>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Modal de Pagamento */}
      {paymentModalLoanId !== null && (['admin','tecnico','agente'].includes(role)) && (()=>{
        const currentLoan = loans.find(l => l.id === paymentModalLoanId);
        const np = newPaymentByLoan[paymentModalLoanId] || { date: '', amount: '' };
        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
          }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>Registar Pagamento</h2>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Empréstimo de <span style={{ color: '#1f2937', fontWeight: 600 }}>{currentLoan?.member}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Data (DD/MM/AAAA)</label>
                  <input type="text" value={np.date} onChange={(e)=> setNewPaymentByLoan({ ...newPaymentByLoan, [paymentModalLoanId]: { ...np, date: e.target.value } })}
                    style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Valor (MT)</label>
                  <input type="number" value={np.amount} onChange={(e)=> setNewPaymentByLoan({ ...newPaymentByLoan, [paymentModalLoanId]: { ...np, amount: e.target.value } })}
                    style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={() => { const loan = loans.find(l => l.id === paymentModalLoanId); if (loan) handleAddPayment(loan); }}
                  style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Guardar</button>
                <button onClick={() => { setPaymentModalLoanId(null); }}
                  style={{ flex: 1, backgroundColor: '#6b7280', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Cancelar</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal de Gerenciamento de Anexos */}
      {manageLoanId !== null && (['admin','tecnico','agente'].includes(role)) && (()=>{
        const currentLoan = loans.find(l => l.id === manageLoanId);
        const list = attachmentsByLoan[String(manageLoanId)] || [];
        const np = newPaymentByLoan[manageLoanId] || { date: '', amount: '' };
        return (
          <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:65 }}>
            <div style={{ background:'#fff', borderRadius:'0.75rem', padding:'1.5rem', width:'100%', maxWidth:'32rem', margin:'1rem', border:'1px solid #e5e7eb', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'#1f2937', margin:0 }}>Gerenciar Anexos</h2>
                <button onClick={() => setManageLoanId(null)} style={{ background:'#6b7280', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.5rem 0.75rem', cursor:'pointer', fontSize:'0.875rem' }}>Fechar</button>
              </div>
              <div style={{ color:'#6b7280', fontSize:'0.875rem', marginBottom:'0.5rem' }}>Empréstimo de <span style={{ color:'#1f2937', fontWeight:600 }}>{currentLoan?.member}</span></div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'0.75rem' }}>
                {list.map(a => (
                  <div key={a.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0.5rem', alignItems:'center', color:'#374151', fontSize:'0.875rem' }}>
                    <span title={`${a.name} (${a.size} bytes)`}>{a.name} <span style={{ color:'#6b7280' }}>— {a.uploadedAt}</span></span>
                    <a href={a.dataUrl || '#'} download={a.name} target="_blank" rel="noreferrer" style={{ background:'#10b981', color:'#fff', textDecoration:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', fontSize:'0.75rem', textAlign:'center' }}>Download</a>
                    {(['admin','tecnico'].includes(role)) && (
                      <button onClick={() => handleRemoveAttachment(manageLoanId, a.id)} style={{ background:'#ef4444', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.25rem 0.5rem', cursor:'pointer', fontSize:'0.75rem' }}>Remover</button>
                    )}
                  </div>
                ))}
                {list.length === 0 && (
                  <div style={{ color:'#6b7280', fontSize:'0.875rem' }}>Sem contratos anexados.</div>
                )}
              </div>
              {(['admin','tecnico'].includes(role)) && (
                <div style={{ marginBottom:'0.75rem' }}>
                  <label style={{ display:'inline-block', background:'#2563eb', color:'#fff', padding:'0.5rem 0.75rem', borderRadius:'0.5rem', cursor:'pointer', fontSize:'0.875rem' }}>
                    Anexar ficheiros
                    <input type="file" multiple onChange={(e) => { handleAddAttachment(manageLoanId, e.target.files); e.target.value=''; }} style={{ display:'none' }} />
                  </label>
                </div>
              )}
              {(['admin','tecnico','agente'].includes(role)) && (
                <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:'0.75rem', marginTop:'0.5rem' }}>
                  <h3 style={{ margin:0, marginBottom:'0.5rem', fontSize:'1rem', color:'#1f2937', fontWeight:600 }}>Registar Pagamento</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                    <div>
                      <label style={{ display:'block', color:'#374151', fontSize:'0.875rem', fontWeight:500, marginBottom:'0.25rem' }}>Data (DD/MM/AAAA)</label>
                      <input type="text" value={np.date} onChange={(e)=> setNewPaymentByLoan({ ...newPaymentByLoan, [manageLoanId]: { ...np, date: e.target.value } })}
                        style={{ width:'100%', background:'#fff', color:'#1f2937', padding:'0.5rem 0.75rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', fontSize:'0.875rem', outline:'none' }} />
                    </div>
                    <div>
                      <label style={{ display:'block', color:'#374151', fontSize:'0.875rem', fontWeight:500, marginBottom:'0.25rem' }}>Valor (MT)</label>
                      <input type="number" value={np.amount} onChange={(e)=> setNewPaymentByLoan({ ...newPaymentByLoan, [manageLoanId]: { ...np, amount: e.target.value } })}
                        style={{ width:'100%', background:'#fff', color:'#1f2937', padding:'0.5rem 0.75rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', fontSize:'0.875rem', outline:'none' }} />
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem', marginTop:'0.75rem' }}>
                    <button onClick={() => { const loan = loans.find(l => l.id === manageLoanId); if (loan) handleAddPayment(loan); }}
                      style={{ background:'#2563eb', color:'#fff', padding:'0.5rem 1rem', borderRadius:'0.5rem', border:'1px solid #1d4ed8', cursor:'pointer', fontSize:'0.875rem', fontWeight:600 }}
                      onMouseOver={(e)=> e.currentTarget.style.backgroundColor = '#1d4ed8'}
                      onMouseOut={(e)=> e.currentTarget.style.backgroundColor = '#2563eb'}>Guardar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default LoanManagement;