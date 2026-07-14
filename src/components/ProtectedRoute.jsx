import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

function ProtectedRoute({children}) {
const {user}=useAuth();
console.log(user)   
    if (!user) return <Navigate to="/" replace />;

  return children;
    
  
}

export default ProtectedRoute