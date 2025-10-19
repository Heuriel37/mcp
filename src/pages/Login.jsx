import React, { useState, useEffect } from 'react';
import { Leaf, User, Lock, Eye, EyeOff } from 'lucide-react';
import { users as mockUsers } from '../data/mockData';
import '../index.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    const u = (username || '').trim();
    const p = (password || '').trim();
    if (!u || !p) return;
    let localUsers = [];
    try {
      const raw = localStorage.getItem('users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localUsers = parsed;
      } else {
        // semear opcionalmente
        localStorage.setItem('users', JSON.stringify(mockUsers || []));
        localUsers = mockUsers || [];
      }
    } catch {
      localUsers = mockUsers || [];
    }
    const mapByUser = new Map();
    (mockUsers || []).forEach(usr => { if (usr && usr.username) mapByUser.set(String(usr.username).toLowerCase(), usr); });
    (localUsers || []).forEach(usr => { if (usr && usr.username) mapByUser.set(String(usr.username).toLowerCase(), usr); });
    const candidate = mapByUser.get(u.toLowerCase());
    const found = candidate && String(candidate.password) === p ? candidate : null;
    if (!found) {
      setError('Credenciais inválidas');
      return;
    }
    try {
      localStorage.setItem('role', found.role);
      localStorage.setItem('userName', found.name || found.username);
      localStorage.setItem('username', found.username);
    } catch {}
    onLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
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
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            MALABO MICROCRÉDITO
          </h1>
          <p style={{ 
            color: '#6b7280',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            SISTEMA DE GESTÃO DE MICROCRÉDITO
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: isMobile ? '1.5rem' : '2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Username Field */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                padding: isMobile ? '0.875rem 0.75rem' : '0.75rem 1rem',
                border: '1px solid #d1d5db'
              }}>
                <User style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#1f2937',
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
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                padding: isMobile ? '0.875rem 0.75rem' : '0.75rem 1rem',
                border: '1px solid #d1d5db'
              }}>
                <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#1f2937',
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    marginLeft: '0.25rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '1.125rem', height: '1.125rem' }} />
                  ) : (
                    <Eye style={{ width: '1.125rem', height: '1.125rem' }} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>
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
                color: '#2563eb', 
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
