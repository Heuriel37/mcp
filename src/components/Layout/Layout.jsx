import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/members':
        return 'Gestão de Membros';
      case '/savings':
        return 'Sistema de Poupanças';
      case '/loans':
        return 'Gestão de Empréstimos';
      case '/fines':
        return 'Sistema de Multas';
      case '/profit-sharing':
        return 'Partilha de Lucros';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#111827'
    }}>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Fixed Header for Mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4rem',
          backgroundColor: '#111827',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 1000
        }}>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: 'white',
            margin: 0
          }}>
            {getPageTitle()}
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}
      
      <main style={{
        flex: 1,
        marginLeft: isMobile ? '0' : '16rem',
        overflowY: 'auto',
        padding: isMobile ? '1rem' : '2rem',
        paddingTop: isMobile ? '5rem' : '2rem'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
