// FILE: agrilink-frontend/src/context/AuthContext.jsx
import { createContext, useContext } from 'react';

// 1. Create the context container
export const AuthContext = createContext(null);

// 2. Custom hook for consuming auth state across your pages
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};