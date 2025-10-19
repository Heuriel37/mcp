import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, AlertCircle } from 'lucide-react';
import { dashboardData, loans, payments } from '../data/mockData';

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const parsePtDate = (str) => {
    const parts = (str || '').split('/');
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  };

  const totals = useMemo(() => {
    const totalLoaned = (loans || []).reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalPaid = (payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const today = new Date();
    const overdueLoans = (loans || []).filter((l) => {
      const d = parsePtDate(l.dueDate);
      return d && d < today; 
    });
    const overdueCount = overdueLoans.length;
    const overdueAmount = overdueLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    return { totalLoaned, totalPaid, overdueCount, overdueAmount };
  }, []);

  const role = (() => { try { return localStorage.getItem('role') || 'admin'; } catch { return 'admin'; } })();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '1rem' : '2rem',
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
          Dashboard
        </h1>
      </div>

      {/* Metrics Cards (por perfil) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '1rem' : '1.5rem' 
      }}>
        {((role === 'admin') || (role === 'tecnico')) && (
          <>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Total Emprestado</h3>
              <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#10b981' }}>MT {totals.totalLoaned.toLocaleString()}</p>
            </div>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Em Atraso (Qtd)</h3>
              <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{totals.overdueCount}</p>
            </div>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Em Atraso (Montante)</h3>
              <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>MT {totals.overdueAmount.toLocaleString()}</p>
            </div>
          </>
        )}
        {(role === 'agente') && (
          <>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Em Atraso (Qtd)</h3>
              <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{totals.overdueCount}</p>
            </div>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Em Atraso (Montante)</h3>
              <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>MT {totals.overdueAmount.toLocaleString()}</p>
            </div>
          </>
        )}
        {(role === 'cliente') && (
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <h3 style={{ color: '#6b7280', fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Em Atraso (Qtd)</h3>
            <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{totals.overdueCount}</p>
          </div>
        )}
      </div>

      {/* Charts and Alerts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
        gap: isMobile ? '1rem' : '1.5rem' 
      }}>
        {/* Monthly Evolution Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '1rem' 
          }}>
            Evolução Mensal
          </h3>
          <div style={{ height: isMobile ? '12rem' : '16rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    color: '#1f2937',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '1rem' 
          }}>
            Alertas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            {dashboardData.alerts.map((alert, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? '0.5rem' : '0.75rem' 
              }}>
                {alert.type === 'meeting' ? (
                  <Calendar style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem', color: '#10b981' }} />
                ) : (
                  <AlertCircle style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem', color: '#ef4444' }} />
                )}
                <span style={{ 
                  color: alert.type === 'payment' ? '#ef4444' : '#6b7280', 
                  fontSize: isMobile ? '0.75rem' : '0.875rem' 
                }}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
