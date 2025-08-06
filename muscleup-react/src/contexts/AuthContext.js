import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('muscleup_token'));

  // Configure axios defaults
  useEffect(() => {
    // Set base URL for API calls
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Checking authentication status...');
      const storedToken = localStorage.getItem('muscleup_token');
      const storedUser = localStorage.getItem('muscleup_user');
      
      console.log('📝 Stored token:', storedToken ? 'Found' : 'None');
      console.log('👤 Stored user:', storedUser ? 'Found' : 'None');
      
      if (storedToken && storedUser) {
        try {
          // Set base URL
          axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          console.log('✅ User authenticated from storage:', userData.email);
          
          // Optionally fetch fresh user data from server
          try {
            const response = await axios.get('/api/users/profile');
            if (response.data.success) {
              const freshUserData = response.data.user;
              setUser(freshUserData);
              localStorage.setItem('muscleup_user', JSON.stringify(freshUserData));
            }
          } catch (fetchError) {
            console.log('Failed to fetch fresh user data, using stored data');
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          logout();
        }
      } else {
        console.log('🚫 No stored authentication found');
      }
      
      console.log('✅ Authentication check complete');
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('muscleup_token', newToken);
      localStorage.setItem('muscleup_user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      const { token: newToken, user: userInfo } = response.data;
      
      setToken(newToken);
      setUser(userInfo);
      
      localStorage.setItem('muscleup_token', newToken);
      localStorage.setItem('muscleup_user', JSON.stringify(userInfo));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: userInfo };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const oauthLogin = async (provider, accessToken) => {
    try {
      const response = await axios.post('/api/oauth/auth', {
        provider,
        accessToken
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('muscleup_token', newToken);
      localStorage.setItem('muscleup_user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'OAuth login failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('muscleup_token');
    localStorage.removeItem('muscleup_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('muscleup_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    oauthLogin,
    logout,
    updateUser,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
