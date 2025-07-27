// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Register function
  const register = async (username, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { 
        username, email, password 
      });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, password 
      });
      console.log('Login successful:', res.data);
      
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };

  // Verify user on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      register, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};