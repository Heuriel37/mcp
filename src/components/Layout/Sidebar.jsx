import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  AlertTriangle,
  Leaf,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isMobile, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/members', icon: Users, label: 'Gestão de Membros' },
    { path: '/savings', icon: BookOpen, label: 'Registo de Poupanças' },
    { path: '/loans', icon: CreditCard, label: 'Gestão de Empréstimos' },
    { path: '/fines', icon: AlertTriangle, label: 'Multas e Penalizações' }
  ];

  return (
    <div style={{
      width: isMobile ? '100%' : '16rem',
      backgroundColor: '#1f2937',
      height: '100vh',
      position: 'fixed',
      left: isMobile ? (sidebarOpen ? '0' : '-100%') : '0',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      transition: 'left 0.3s ease'
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            NOVA ESPERANÇA
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{
        flex: 1,
        padding: '1rem'
      }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
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
                    color: isActive ? 'white' : '#d1d5db',
                    transition: 'all 0.2s',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#374151';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
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
        <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              color: '#d1d5db',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
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
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '24rem',
            margin: '1rem',
            border: '1px solid #374151'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: 'white', 
              marginBottom: '1rem' 
            }}>
              Confirmar Saída
            </h3>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '0.875rem', 
              marginBottom: '1.5rem' 
            }}>
              Tem certeza que deseja sair do sistema?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  window.location.reload();
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
