import React, { useState, useEffect } from 'react';
import { Plus, Link, Edit, Trash2 } from 'lucide-react';
import { members } from '../data/mockData';
import Toast from '../components/Toast';

const MemberManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    memberNumber: '',
    contact: ''
  });
  const [localMembers, setLocalMembers] = useState(members);
  const [showEditForm, setShowEditForm] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const handleAddMember = (e) => {
    e.preventDefault();
    console.log('Adicionar membro:', newMember);
    const newMemberWithId = { ...newMember, id: localMembers.length + 1, status: 'active' };
    setLocalMembers([...localMembers, newMemberWithId]);
    showToast(`Membro ${newMember.name} adicionado com sucesso!`, 'success');
    setShowAddForm(false);
    setNewMember({ name: '', memberNumber: '', contact: '' });
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleLinkMember = (memberId) => {
    console.log('Linkar membro:', memberId);
    showToast(`Membro ${memberId} linkado! (Simulação)`, 'info');
  };

  const handleEditMember = (member) => {
    console.log('Editar membro:', member.id);
    setMemberToEdit(member);
    setShowEditForm(true);
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      console.log('Deletar membro:', memberToDelete.id);
      const updatedMembers = localMembers.filter(m => m.id !== memberToDelete.id);
      setLocalMembers(updatedMembers);
      showToast(`Membro ${memberToDelete.name} (${memberToDelete.id}) deletado com sucesso!`, 'success');
      setMemberToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setMemberToDelete(null);
    setShowDeleteModal(false);
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    console.log('Atualizar membro:', memberToEdit);
    const updatedMembers = localMembers.map(m => 
      m.id === memberToEdit.id ? memberToEdit : m
    );
    setLocalMembers(updatedMembers);
    showToast(`Membro ${memberToEdit.name} atualizado com sucesso!`, 'success');
    setMemberToEdit(null);
    setShowEditForm(false);
  };

  const handleToggleStatus = (member) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    const updatedMembers = localMembers.map(m => 
      m.id === member.id ? { ...m, status: newStatus } : m
    );
    setLocalMembers(updatedMembers);
    showToast(`Membro ${member.name} agora está ${newStatus === 'active' ? 'Ativo' : 'Inativo'}!`, 'info');
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
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
              Adicionar Novo Membro
            </h2>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
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
                  Nº Membro
                </label>
                <input
                  type="text"
                  value={newMember.memberNumber}
                  onChange={(e) => setNewMember({...newMember, memberNumber: e.target.value})}
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
                  Contacto
                </label>
                <input
                  type="text"
                  value={newMember.contact}
                  onChange={(e) => setNewMember({...newMember, contact: e.target.value})}
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
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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

      {/* Members Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {localMembers.map((member) => (
          <div key={member.id} style={{
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
                {member.name}
              </h3>
              <span style={{
                backgroundColor: member.status === 'active' ? '#10b981' : '#ef4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {member.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <p>Nº Membro: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{member.memberNumber}</span></p>
              <p>Contacto: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{member.contact}</span></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleLinkMember(member.id)}
                  style={{
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  <Link style={{ width: '1rem', height: '1rem' }} />
                </button>
                <button
                  onClick={() => handleEditMember(member)}
                  style={{
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  <Edit style={{ width: '1rem', height: '1rem' }} />
                </button>
                <button
                  onClick={() => handleDeleteMember(member)}
                  style={{
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
              {/* Status Toggle Switch */}
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={member.status === 'active'}
                  onChange={() => handleToggleStatus(member)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '2.5rem',
                  height: '1.25rem',
                  borderRadius: '0.625rem',
                  backgroundColor: member.status === 'active' ? '#10b981' : '#d1d5db',
                  position: 'relative',
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '0.125rem',
                    left: member.status === 'active' ? '1.3rem' : '0.125rem',
                    transition: 'left 0.2s'
                  }} />
                </div>
                <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleCloseToast} 
        />
      )}
    </div>
  );
};

export default MemberManagement;