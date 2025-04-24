
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  excludeRole?: 'admin' | 'user';
}

const AuthProtection: React.FC<AuthProtectionProps> = ({ 
  children, 
  requiredRole, 
  excludeRole 
}) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to access this page');
    } else if (requiredRole && userType !== requiredRole) {
      toast.error(`You need ${requiredRole} access for this page`);
    } else if (excludeRole && userType === excludeRole) {
      toast.error(`This page is not available for ${excludeRole} users`);
    }
  }, [isLoggedIn, userType, requiredRole, excludeRole]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (excludeRole && userType === excludeRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthProtection;
