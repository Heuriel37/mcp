import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <main style={{
        flex: 1,
        marginLeft: isMobile ? '0' : '16rem',
        overflowY: 'auto',
        padding: isMobile ? '1rem' : '2rem'
      }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 1001,
              backgroundColor: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
