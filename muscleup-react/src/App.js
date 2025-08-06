import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import Home from './pages/Home'; // Unused for now
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import TrackMeals from './pages/TrackMeals';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2d 25%, #8B0000 50%, #DC143C 75%, #FF6B6B 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(220, 20, 60, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2d 25%, #8B0000 50%, #DC143C 75%, #FF6B6B 100%)',
        color: '#fff',
        fontSize: '1.4rem',
        fontWeight: '500',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid rgba(255,255,255,0.3)', 
          borderTop: '4px solid #FF6B6B',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite' 
        }}></div>
        Loading MuscleUp...
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// Public Route component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2d 25%, #8B0000 50%, #DC143C 75%, #FF6B6B 100%)',
        color: '#fff',
        fontSize: '1.4rem',
        fontWeight: '500',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid rgba(255,255,255,0.3)', 
          borderTop: '4px solid #FF6B6B',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite' 
        }}></div>
        Loading MuscleUp...
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppContainer>
      {isAuthenticated && <Header />}
      <MainContent>
        {isAuthenticated && <Navbar />}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/log-workout" 
              element={
                <ProtectedRoute>
                  <LogWorkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/track-meals" 
              element={
                <ProtectedRoute>
                  <TrackMeals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms-of-service" 
              element={<TermsOfService />} 
            />
            <Route 
              path="/contact" 
              element={<div>Contact Page - Coming Soon</div>} 
            />
            {/* Catch all route - redirect to home or signin */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/" : "/signin"} replace />} 
            />
          </Routes>
        </div>
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/MuscleUp' : '/'}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
