import React, { useState, useEffect } from 'react';
import { Leaf, User, Lock } from 'lucide-react';
import { users as mockUsers } from '../data/mockData';
import '../index.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return;
    let users = mockUsers || [];
    try {
      const raw = localStorage.getItem('users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) users = parsed;
      }
    } catch {}
    const found = (users || []).find(u => u.username === username && u.password === password);
    if (!found) {
      setError('Credenciais inválidas');
      return;
    }
    try {
      localStorage.setItem('role', found.role);
      localStorage.setItem('userName', found.name || found.username);
    } catch {}
    onLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1f2937',
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'center',
      padding: isMobile ? '2rem 1rem' : '1rem'
    }}>
      <div style={{ 
        maxWidth: isMobile ? '100%' : '28rem', 
        width: '100%',
        marginTop: isMobile ? '2rem' : '0'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <div style={{
            width: isMobile ? '4rem' : '5rem',
            height: isMobile ? '2.5rem' : '3rem',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
          <h1 style={{ 
            fontSize: isMobile ? '1.5rem' : '1.875rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '0.5rem' 
          }}>
            MALABO MICROCRÉDITO
          </h1>
          <p style={{ 
            color: '#d1d5db',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            SISTEMA DE GESTÃO DE MICROCRÉDITO
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          backgroundColor: '#374151',
          borderRadius: '0.5rem',
          padding: isMobile ? '1.5rem' : '2rem'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Username Field */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#4b5563',
                borderRadius: '0.5rem',
                padding: isMobile ? '0.875rem 0.75rem' : '0.75rem 1rem'
              }}>
                <User style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#4b5563',
                borderRadius: '0.5rem',
                padding: isMobile ? '0.875rem 0.75rem' : '0.75rem 1rem'
              }}>
                <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
            </div>

            {error && (
              <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: isMobile ? '1rem' : '0.875rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? '1.125rem' : '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Entrar
            </button>

            {/* Forgot Password */}
            <div style={{ textAlign: 'center' }}>
              <a href="#" style={{ 
                color: 'white', 
                fontSize: isMobile ? '1rem' : '0.875rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Esqueci a senha
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
