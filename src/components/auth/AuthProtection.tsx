
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const AuthProtection: React.FC<AuthProtectionProps> = ({ children, requiredRole }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to access this page');
    } else if (requiredRole === 'admin' && userType !== 'admin') {
      toast.error('You need admin access for this page');
    }
  }, [isLoggedIn, userType, requiredRole]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && userType !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthProtection;
