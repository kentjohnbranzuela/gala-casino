
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';

const Index = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (userType === 'admin') {
      navigate('/admin');
    }
  }, [isLoggedIn, userType, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (userType === 'admin') {
    return <Navigate to="/admin" />;
  }

  return <HomePage />;
};

export default Index;
