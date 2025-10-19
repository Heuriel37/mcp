import React, { useEffect, useMemo, useState } from 'react';
import { users as mockUsers } from '../data/mockData';

const safeLoadUsers = () => {
  try {
    const raw = localStorage.getItem('users');
    if (!raw) {
      // semear se não existir
      try { localStorage.setItem('users', JSON.stringify(mockUsers || [])); } catch {}
      return mockUsers || [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        // se array vazio, semear mock
        try { localStorage.setItem('users', JSON.stringify(mockUsers || [])); } catch {}
        return mockUsers || [];
      }
      return parsed;
    }
    // inválido, semear mock
    try { localStorage.setItem('users', JSON.stringify(mockUsers || [])); } catch {}
    return mockUsers || [];
  } catch {
    try { localStorage.setItem('users', JSON.stringify(mockUsers || [])); } catch {}
    return mockUsers || [];
  }
};

const saveUsers = (list) => {
  try { localStorage.setItem('users', JSON.stringify(list)); } catch {}
};

const UsersManagement = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [list, setList] = useState(safeLoadUsers());
  const [form, setForm] = useState({ id: null, username: '', password: '', role: 'tecnico', name: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { saveUsers(list); }, [list]);

  const resetForm = () => setForm({ id: null, username: '', password: '', role: 'tecnico', name: '' });

  const handleSave = () => {
    if (!form.username || !form.password || !form.role) return;
    if (editingId) {
      setList(list.map(u => (u.id === editingId ? { ...u, username: form.username, password: form.password, role: form.role, name: form.name || form.username } : u)));
      setEditingId(null);
    } else {
      const nextId = list.length ? Math.max(...list.map(u => u.id || 0)) + 1 : 1;
      const newUser = { id: nextId, username: form.username, password: form.password, role: form.role, name: form.name || form.username };
      setList([...list, newUser]);
    }
    resetForm();
    setShowModal(false);
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({ id: u.id, username: u.username, password: u.password, role: u.role, name: u.name });
    setShowModal(true);
  };

  const startAdd = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setList(list.filter(u => u.id !== id));
    if (editingId === id) { setEditingId(null); resetForm(); }
  };

  const rows = useMemo(() => list, [list]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem', backgroundColor: '#fff', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestão de Utilizadores</h1>
        <button
          onClick={startAdd}
          style={{
            backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Adicionar Utilizador
        </button>
      </div>

      {/* Cards de Utilizadores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {rows.map((u) => (
          <div key={u.id} style={{
            backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1rem', fontWeight: 600 }}>{u.name || u.username}</h3>
              <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>{u.role}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <p style={{ margin: 0 }}>Usuário: <span style={{ color: '#1f2937', fontWeight: 500 }}>{u.username}</span></p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => startEdit(u)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Editar</button>
              <button onClick={() => handleDelete(u.id)} style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Remover</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Nenhum utilizador cadastrado.</div>
        )}
      </div>

      {/* Modal Adicionar/Editar */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '1rem' }}>{editingId ? 'Editar Utilizador' : 'Adicionar Utilizador'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Usuário</label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Senha</label>
                <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nome</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Perfil</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: '100%', backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                  <option value="admin">Administrador</option>
                  <option value="tecnico">Técnico/Administrativo</option>
                  <option value="agente">Agente de Campo</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={handleSave} style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>{editingId ? 'Atualizar' : 'Adicionar'}</button>
              <button onClick={() => { setShowModal(false); setEditingId(null); resetForm(); }} style={{ flex: 1, backgroundColor: '#6b7280', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
