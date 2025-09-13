import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { LoginPage } from '@/components/LoginPage';
import { SignupPage } from '@/components/SignupPage';
import { authStore } from '@/lib/auth';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authStore.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authStore.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleSignupSuccess = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentPage('signup')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    );
  }

  return <Dashboard />;
};

export default Index;
