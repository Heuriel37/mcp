import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { members, fines } from '../data/mockData';

const FinesSystem = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [fineAmount, setFineAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular registro de multa
    console.log('Registrar multa:', { member: selectedMember, amount: fineAmount });
    setFineAmount(0);
    setSelectedMember('');
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
          Multas e Penalizações
        </h1>
      </div>

      {/* Fine Form */}
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
              value={fineAmount}
              onChange={(e) => setFineAmount(Number(e.target.value))}
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

      {/* Fines History */}
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
          Histórico de Penalizações Aplicadas
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
                  Motivo
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
              </tr>
            </thead>
            <tbody>
              {fines.map((fine, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ 
                    color: 'white', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {fine.member}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {fine.reason}
                  </td>
                  <td style={{ 
                    color: 'white', 
                    padding: '0.75rem 0',
                    fontSize: '0.875rem'
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
