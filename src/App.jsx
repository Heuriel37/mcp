import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MemberManagement from './pages/MemberManagement';
import LoanManagement from './pages/LoanManagement';
import Reports from './pages/Reports';
import UsersManagement from './pages/UsersManagement';
import ClientPortal from './pages/ClientPortal';
 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está logado
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={(() => {
            let role = 'admin';
            try { role = localStorage.getItem('role') || 'admin'; } catch {}
            const allow = ['admin','tecnico'].includes(role);
            return allow ? <MemberManagement /> : <Navigate to="/" replace />;
          })()} />
          <Route path="/loans" element={(() => {
            let role = 'admin';
            try { role = localStorage.getItem('role') || 'admin'; } catch {}
            const allow = ['admin','tecnico','agente'].includes(role);
            return allow ? <LoanManagement /> : <Navigate to="/" replace />;
          })()} />
          <Route path="/reports" element={(() => {
            let role = 'admin';
            try { role = localStorage.getItem('role') || 'admin'; } catch {}
            const allow = ['admin','tecnico','agente'].includes(role);
            return allow ? <Reports /> : <Navigate to="/" replace />;
          })()} />
          <Route path="/users" element={(() => {
            let role = 'admin';
            try { role = localStorage.getItem('role') || 'admin'; } catch {}
            const allow = ['admin'].includes(role);
            return allow ? <UsersManagement /> : <Navigate to="/" replace />;
          })()} />
          <Route path="/portal" element={(() => {
            let role = 'admin';
            try { role = localStorage.getItem('role') || 'admin'; } catch {}
            const allow = ['cliente'].includes(role);
            return allow ? <ClientPortal /> : <Navigate to="/" replace />;
          })()} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
