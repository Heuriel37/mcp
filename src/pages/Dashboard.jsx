import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, AlertCircle } from 'lucide-react';
import { dashboardData } from '../data/mockData';

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

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '1rem' : '2rem'
    }}>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: isMobile ? '1rem' : '1.5rem' 
      }}>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <h3 style={{ 
            color: '#9ca3af', 
            fontSize: isMobile ? '0.75rem' : '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.5rem' 
          }}>
            Total Poupado
          </h3>
          <p style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            MT {dashboardData.totalSaved.toLocaleString()}
          </p>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <h3 style={{ 
            color: '#9ca3af', 
            fontSize: isMobile ? '0.75rem' : '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.5rem' 
          }}>
            Total Emprestado
          </h3>
          <p style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            MT {dashboardData.totalLoaned.toLocaleString()}
          </p>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <h3 style={{ 
            color: '#9ca3af', 
            fontSize: isMobile ? '0.75rem' : '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.5rem' 
          }}>
            Próximos Pagamentos
          </h3>
          <p style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            MT {dashboardData.upcomingPayments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts and Alerts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
        gap: isMobile ? '1rem' : '1.5rem' 
      }}>
        {/* Monthly Evolution Chart */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem', 
            fontWeight: '600', 
            color: 'white', 
            marginBottom: '1rem' 
          }}>
            Evolução Mensal
          </h3>
          <div style={{ height: isMobile ? '12rem' : '16rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#f9fafb',
                    fontSize: '0.875rem'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: isMobile ? '1rem' : '1.5rem',
          border: '1px solid #374151'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem', 
            fontWeight: '600', 
            color: 'white', 
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
                  <Calendar style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem', color: '#60a5fa' }} />
                ) : (
                  <AlertCircle style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem', color: '#f87171' }} />
                )}
                <span style={{ 
                  color: '#d1d5db', 
                  fontSize: isMobile ? '0.75rem' : '0.875rem' 
                }}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Savings Table */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #374151'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: 'white', 
          marginBottom: '1rem' 
        }}>
          Registo de Poupanças Recentes
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Membro
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Data
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  color: '#9ca3af', 
                  padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '500'
                }}>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentSavings.map((saving, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ 
                    color: 'white', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    {saving.member}
                  </td>
                  <td style={{ 
                    color: '#d1d5db', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    {saving.date}
                  </td>
                  <td style={{ 
                    color: 'white', 
                    padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    MT {saving.amount.toLocaleString()}
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

export default Dashboard;
