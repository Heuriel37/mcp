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
    // Simular registro de empréstimo
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '2rem' }}>
      {/* Add Loan Button */}
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
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
          <span>Registar Empréstimo</span>
        </button>
      </div>

      {/* Loan Form */}
      {showLoanForm && (
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
            {/* Member Selection */}
            <div>
              <label style={{ 
                display: 'block', 
                color: '#d1d5db', 
                fontSize: isMobile ? '0.75rem' : '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Membro
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: isMobile ? '0.6rem 2.5rem 0.6rem 1rem' : '0.75rem 2.5rem 0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                  required
                >
                  <option value="">Selecionar membro</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <ChevronDown style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: isMobile ? '1rem' : '1.25rem',
                  height: isMobile ? '1rem' : '1.25rem',
                  color: '#9ca3af',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label style={{ 
                display: 'block', 
                color: '#d1d5db', 
                fontSize: isMobile ? '0.75rem' : '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Valor
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: '#374151',
                  color: 'white',
                  padding: isMobile ? '0.6rem 1rem' : '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  outline: 'none'
                }}
                placeholder="0"
                required
              />
            </div>

            {/* Loan Details Row */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '1rem' }}>
              {/* Months */}
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  color: '#d1d5db', 
                  fontSize: isMobile ? '0.75rem' : '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Meses
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={loanMonths}
                    onChange={(e) => setLoanMonths(Number(e.target.value))}
                    style={{
                      width: '100%',
                      backgroundColor: '#374151',
                      color: 'white',
                      padding: isMobile ? '0.6rem 2rem 0.6rem 1rem' : '0.75rem 2rem 0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #4b5563',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      outline: 'none'
                    }}
                    required
                  />
                  <span style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    meses
                  </span>
                </div>
              </div>

              {/* Interest Rate */}
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  color: '#d1d5db', 
                  fontSize: isMobile ? '0.75rem' : '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Taxa de Juros
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      backgroundColor: '#374151',
                      color: 'white',
                      padding: isMobile ? '0.6rem 2rem 0.6rem 1rem' : '0.75rem 2rem 0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #4b5563',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0"
                    required
                  />
                  <span style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Registar
              </button>
              <button
                type="button"
                onClick={() => setShowLoanForm(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#4b5563',
                  color: 'white',
                  padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Tracking */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        padding: isMobile ? '1rem' : '1.5rem',
        border: '1px solid #374151'
      }}>
        <h3 style={{ 
          fontSize: isMobile ? '1rem' : '1.125rem', 
          fontWeight: '600', 
          color: 'white', 
          marginBottom: '1rem' 
        }}>
          Acompanhamento de Pagamentos
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? '1rem' : '1.5rem'
        }}>
          {loans.map((loan, index) => (
            <div key={index} style={{
              backgroundColor: '#111827',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: '1px solid #374151',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Membro:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>{loan.member}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Valor:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>MT {loan.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Data:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>{loan.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Vencimento:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>{loan.dueDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Status:</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: loan.status === 'Em atraso' ? '#ef4444' : '#10b981'
                }}>
                  {loan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanManagement;
