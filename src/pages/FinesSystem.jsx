import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { members, fines } from '../data/mockData';

const FinesSystem = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [fineAmount, setFineAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular registro de multa
    console.log('Registrar multa:', { member: selectedMember, amount: fineAmount });
    setFineAmount(0);
    setSelectedMember('');
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
      <div>
        <h1 style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: 0
        }}>
          Multas e Penalizações
        </h1>
      </div>

      {/* Fine Form */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: isMobile ? '1rem' : '1.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
          {/* Member Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#6b7280', 
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
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
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
                color: '#6b7280',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#6b7280', 
              fontSize: isMobile ? '0.75rem' : '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Valor
            </label>
            <input
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(Number(e.target.value))}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                outline: 'none'
              }}
              placeholder="0"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
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

      {/* Fines History */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: isMobile ? '1rem' : '1.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <h3 style={{ 
          fontSize: isMobile ? '1rem' : '1.125rem', 
          fontWeight: '600', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          Histórico de Penalizações Aplicadas
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#6b7280', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Membro
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#6b7280', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Motivo
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#6b7280', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ 
                    color: '#1f2937', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    {fine.member}
                  </td>
                  <td style={{ 
                    color: '#6b7280', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    {fine.reason}
                  </td>
                  <td style={{ 
                    color: '#1f2937', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    MT {fine.amount.toLocaleString()}
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

export default FinesSystem;

