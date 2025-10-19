import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut
} from 'lucide-react';

const Sidebar = ({ isMobile, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/members', icon: Users, label: 'Gestão de Membros' },
    { path: '/loans', icon: CreditCard, label: 'Gestão de Empréstimos' },
    { path: '/reports', icon: LayoutDashboard, label: 'Relatórios' },
    { path: '/users', icon: Users, label: 'Utilizadores' }
  ];

  const role = (() => {
    try { return localStorage.getItem('role') || 'admin'; } catch { return 'admin'; }
  })();

  const allowedByRole = (item) => {
    switch (role) {
      case 'admin':
        return true; // Admin vê todos
      case 'tecnico':
        // Técnico não vê Utilizadores
        return item.path !== '/users';
      case 'agente':
        return item.path === '/' || item.path === '/loans' || item.path === '/reports';
      case 'cliente':
        return item.path === '/';
      default:
        return item.path === '/';
    }
  };

  const visibleMenu = menuItems.filter(allowedByRole);

  return (
    <div style={{
      width: isMobile ? '100%' : '16rem',
      backgroundColor: '#ffffff',
      height: '100vh',
      position: 'fixed',
      left: isMobile ? (sidebarOpen ? '0' : '-100%') : '0',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      transition: 'left 0.3s ease',
      borderRight: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <img 
              src="/malabo-logo.svg" 
              alt="Malabo Microcrédito" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <span style={{
            color: '#374151',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            MALABO MICROCRÉDITO
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{
        flex: 1,
        padding: '1rem'
      }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#2563eb' : 'transparent',
                    color: isActive ? 'white' : '#6b7280',
                    transition: 'all 0.2s',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        {/* Logout Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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
          zIndex: 60
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '24rem',
            margin: '1rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Confirmar Saída
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              marginBottom: '1.5rem' 
            }}>
              Tem certeza que deseja sair do sistema?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('role');
                    localStorage.removeItem('userName');
                  } catch {}
                  window.location.replace('/');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Sim, Sair
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#4b5563',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
