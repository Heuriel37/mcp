import React, { useState } from 'react';
import { Plus, Link, Edit, Trash2 } from 'lucide-react';
import { members } from '../data/mockData';

const MemberManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    memberNumber: '',
    contact: ''
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    // Simular adição de membro
    console.log('Adicionar membro:', newMember);
    setShowAddForm(false);
    setNewMember({ name: '', memberNumber: '', contact: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: 'white' 
        }}>
          Gestão de Membros
        </h1>
      </div>

      {/* Add Member Button */}
      <div>
        <button
          onClick={() => setShowAddForm(true)}
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
          <span>Adicionar Membro</span>
        </button>
      </div>

      {/* Add Member Form Modal */}
      {showAddForm && (
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
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '28rem',
            margin: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: 'white', 
              marginBottom: '1rem' 
            }}>
              Adicionar Novo Membro
            </h2>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#d1d5db', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  style={{
                    width: '100%',
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#d1d5db', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Nº Membro
                </label>
                <input
                  type="text"
                  value={newMember.memberNumber}
                  onChange={(e) => setNewMember({...newMember, memberNumber: e.target.value})}
                  style={{
                    width: '100%',
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#d1d5db', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Contacto
                </label>
                <input
                  type="text"
                  value={newMember.contact}
                  onChange={(e) => setNewMember({...newMember, contact: e.target.value})}
                  style={{
                    width: '100%',
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
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
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#4b5563',
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

      {/* Members Table */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ backgroundColor: '#374151' }}>
              <tr>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#d1d5db', 
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nome
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#d1d5db', 
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nº Membro
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#d1d5db', 
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Contacto
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#d1d5db', 
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Situação
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={{ 
                  borderBottom: '1px solid #374151',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                >
                  <td style={{ 
                    color: 'white', 
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem'
                  }}>
                    {member.name}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem'
                  }}>
                    {member.memberNumber}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem'
                  }}>
                    {member.contact}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      <button style={{
                        color: '#9ca3af',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = 'white'}
                      onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                      >
                        <Link style={{ width: '1rem', height: '1rem' }} />
                      </button>
                      <button style={{
                        color: '#9ca3af',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = 'white'}
                      onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                      >
                        <Edit style={{ width: '1rem', height: '1rem' }} />
                      </button>
                      <button style={{
                        color: '#9ca3af',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#ef4444'}
                      onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                      >
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>
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

export default MemberManagement;
