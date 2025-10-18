import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { members, loans } from '../data/mockData';

const LoanManagement = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanMonths, setLoanMonths] = useState(9);
  const [interestRate, setInterestRate] = useState(0);

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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: 'white' 
        }}>
          Gestão de Empréstimos
        </h1>
      </div>

      {/* Loan Form */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #374151'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Member Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#d1d5db', 
              fontSize: '0.875rem', 
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
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
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
                    {member.name}
                  </option>
                ))}
              </select>
              <ChevronDown style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
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
              fontSize: '0.875rem', 
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
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              placeholder="0"
              required
            />
          </div>

          {/* Loan Details Row */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Months */}
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                color: '#d1d5db', 
                fontSize: '0.875rem', 
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
                    padding: '0.75rem 2rem 0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
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
                  fontSize: '0.875rem'
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
                fontSize: '0.875rem', 
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
                    padding: '0.75rem 2rem 0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
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
                  fontSize: '0.875rem'
                }}>
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              alignSelf: 'flex-start',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Registar
          </button>
        </form>
      </div>

      {/* Payment Tracking */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #374151'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: 'white', 
          marginBottom: '1rem' 
        }}>
          Acompanhamento de Pagamentos
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: '0.75rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Membro
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: '0.75rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Valor
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: '0.75rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Data
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: '0.75rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Data de Vencimento
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: '0.75rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ 
                    color: 'white', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {loan.member}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    MT {loan.amount.toLocaleString()}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {loan.date}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {loan.dueDate}
                  </td>
                  <td style={{ 
                    color: loan.status === 'Em atraso' ? '#ef4444' : '#10b981', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {loan.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanManagement;
