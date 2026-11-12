import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isSeller, isCheckingSellerAuth } = useAppContext();
  const location = useLocation();

  if (isCheckingSellerAuth) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;
  }

  if (!isSeller) {
    return <Navigate to='/seller-login' replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
