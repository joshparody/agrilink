// FILE: agrilink-frontend/src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // 💡 OPTIMIZATION: Seed initial states synchronously from localStorage to prevent route-guard flashes
  const [token, setToken] = useState(() => localStorage.getItem('agrilink_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_profile');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('agrilink_token'));
  const [loading, setLoading] = useState(true);

  // Synchronous Sign Out
  const logout = () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('role'); // Clean up role tracking if stored
    
    delete API.defaults.headers.common['Authorization'];
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Lifecycle Session Hook: Validates token with backend silently on browser reload
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('agrilink_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await API.get('/auth/me'); 

        if (response.data && response.data.data?.user) {
          const currentUser = response.data.data.user;
          setUser(currentUser);
          localStorage.setItem('user_profile', JSON.stringify(currentUser));
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session validation lifecycle failure:', error.message);
        logout(); 
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  // Async User Sign-In Action
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });

      if (response.data.status === 'success') {
        const { token: jwtToken, data } = response.data;

        localStorage.setItem('agrilink_token', jwtToken);
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.setItem('role', data.user?.role);

        API.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

        setToken(jwtToken);
        setUser(data.user);
        setIsAuthenticated(true);

        // 🚨 FIX: Return the user object directly so LoginPage can read the role simply
        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Login implementation handling failure:', error.response?.data || error.message);
      throw error;
    }
  };

  // Async User Onboarding Action
  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);

      if (response.data.status === 'success') {
        const { token: jwtToken, data } = response.data;

        localStorage.setItem('agrilink_token', jwtToken);
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.setItem('role', data.user?.role);

        API.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

        setToken(jwtToken);
        setUser(data.user);
        setIsAuthenticated(true);

        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Registration implementation handling failure:', error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};