import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { members, loans } from '../data/mockData';

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

  const [isMobile, setIsMobile] = useState(false);
  const role = (() => { try { return localStorage.getItem('role') || 'admin'; } catch { return 'admin'; } })();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  

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
        {loans.map((loan) => (
          <div key={loan.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanManagement;