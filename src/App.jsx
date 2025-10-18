import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MemberManagement from './pages/MemberManagement';
import SavingsSystem from './pages/SavingsSystem';
import LoanManagement from './pages/LoanManagement';
import FinesSystem from './pages/FinesSystem';

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
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/savings" element={<SavingsSystem />} />
          <Route path="/loans" element={<LoanManagement />} />
          <Route path="/fines" element={<FinesSystem />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
