import React, { createContext, useContext, useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';

// Theme definitions
export const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    info: '#4299e1',
    
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f7fafc',
    backgroundTertiary: '#edf2f7',
    
    // Surface colors
    surface: '#ffffff',
    surfaceHover: '#f7fafc',
    surfaceActive: '#edf2f7',
    
    // Text colors
    textPrimary: '#2d3748',
    textSecondary: '#4a5568',
    textTertiary: '#718096',
    textInverse: '#ffffff',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f7fafc',
    borderDark: '#cbd5e0',
    
    // Shadow colors
    shadowLight: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowHeavy: 'rgba(0, 0, 0, 0.25)',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSuccess: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    gradientWarning: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    gradientDanger: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
  }
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    secondary: '#764ba2',
    success: '#68d391',
    warning: '#f6ad55',
    danger: '#fc8181',
    info: '#63b3ed',
    
    // Background colors
    background: '#1a202c',
    backgroundSecondary: '#2d3748',
    backgroundTertiary: '#4a5568',
    
    // Surface colors
    surface: '#2d3748',
    surfaceHover: '#4a5568',
    surfaceActive: '#718096',
    
    // Text colors
    textPrimary: '#f7fafc',
    textSecondary: '#e2e8f0',
    textTertiary: '#cbd5e0',
    textInverse: '#2d3748',
    
    // Border colors
    border: '#4a5568',
    borderLight: '#718096',
    borderDark: '#2d3748',
    
    // Shadow colors
    shadowLight: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.4)',
    shadowHeavy: 'rgba(0, 0, 0, 0.6)',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSuccess: 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)',
    gradientWarning: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    gradientDanger: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
  }
};

// Global styles that respond to theme
const GlobalThemeStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  /* Custom scrollbar for dark mode */
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
  
  /* Selection colors */
  ::selection {
    background: ${props => props.theme.colors.primary}40;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

// Theme Provider Component
export const CustomThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('muscleup-theme');
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      setThemeMode(systemTheme);
    }
  }, [systemTheme]);

  // Save theme to localStorage
  const changeTheme = (mode) => {
    setThemeMode(mode);
    if (mode === 'system') {
      localStorage.removeItem('muscleup-theme');
    } else {
      localStorage.setItem('muscleup-theme', mode);
    }
  };

  // Determine actual theme based on mode
  const getActualTheme = () => {
    if (themeMode === 'system') {
      return systemTheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const contextValue = {
    themeMode,
    actualTheme: getActualTheme(),
    changeTheme,
    isDark: getActualTheme().mode === 'dark',
    systemTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={getActualTheme()}>
        <GlobalThemeStyles />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component
const ToggleContainer = styled(motion.div)`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ToggleButton = styled(motion.button)`
  position: relative;
  padding: 0.5rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.surfaceHover};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-right: 0.5rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ThemeToggle = ({ showLabel = true, compact = false }) => {
  const { themeMode, changeTheme, isDark } = useTheme();

  const buttonVariants = {
    active: { scale: 1, backgroundColor: 'var(--primary)' },
    inactive: { scale: 1, backgroundColor: 'transparent' }
  };

  if (compact) {
    return (
      <ToggleButton
        active={isDark}
        onClick={() => changeTheme(isDark ? 'light' : 'dark')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
      </ToggleButton>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {showLabel && <ToggleLabel>Theme:</ToggleLabel>}
      <ToggleContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ToggleButton
          active={themeMode === 'light'}
          onClick={() => changeTheme('light')}
          variants={buttonVariants}
          animate={themeMode === 'light' ? 'active' : 'inactive'}
          title="Light mode"
        >
          <FontAwesomeIcon icon={faSun} />
        </ToggleButton>
        
        <ToggleButton
          active={themeMode === 'system'}
          onClick={() => changeTheme('system')}
          variants={buttonVariants}
          animate={themeMode === 'system' ? 'active' : 'inactive'}
          title="System mode"
        >
          <FontAwesomeIcon icon={faDesktop} />
        </ToggleButton>
        
        <ToggleButton
          active={themeMode === 'dark'}
          onClick={() => changeTheme('dark')}
          variants={buttonVariants}
          animate={themeMode === 'dark' ? 'active' : 'inactive'}
          title="Dark mode"
        >
          <FontAwesomeIcon icon={faMoon} />
        </ToggleButton>
      </ToggleContainer>
    </div>
  );
};

// Themed components that can be used throughout the app
export const ThemedCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadowLight};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 6px 25px ${props => props.theme.colors.shadowMedium};
    transform: translateY(-2px);
  }
`;

export const ThemedButton = styled(motion.button)`
  background: ${props => props.variant === 'primary' ? props.theme.colors.gradientPrimary : 
                     props.variant === 'secondary' ? 'transparent' : props.theme.colors.surface};
  color: ${props => props.variant === 'primary' ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: 2px solid ${props => props.variant === 'secondary' ? props.theme.colors.primary : 'transparent'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.theme.colors.shadowMedium};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ThemedInput = styled.input`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

// Theme-aware Navigation Bar
export const ThemedNavbar = styled.nav`
  background: ${props => props.theme.colors.surface}95;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

// Auto theme detection hook
export const useAutoTheme = () => {
  const { changeTheme } = useTheme();
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('muscleup-theme');
      if (!savedTheme || savedTheme === 'system') {
        changeTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [changeTheme]);
};

// Theme transition animation
export const ThemeTransition = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  z-index: 9999;
  pointer-events: none;
`;
