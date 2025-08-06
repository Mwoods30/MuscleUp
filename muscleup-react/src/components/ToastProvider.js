import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import styled from 'styled-components';

// Custom Toast Container
const ToastContainer = styled.div`
  .toast-success {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 8px 30px rgba(72, 187, 120, 0.3);
    font-weight: 500;
  }

  .toast-error {
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 8px 30px rgba(245, 101, 101, 0.3);
    font-weight: 500;
  }

  .toast-loading {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
    font-weight: 500;
  }

  .toast-custom {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    color: #2d3748;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .toast-success,
    .toast-error,
    .toast-loading,
    .toast-custom {
      font-size: 0.875rem;
      padding: 0.875rem 1.25rem;
      margin: 0 1rem;
    }
  }
`;

// Toast notification functions
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    className: 'toast-success',
    duration: 4000,
    icon: '✅',
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    className: 'toast-error',
    duration: 5000,
    icon: '❌',
    ...options,
  });
};

export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    className: 'toast-loading',
    icon: '⏳',
    ...options,
  });
};

export const showCustomToast = (message, options = {}) => {
  return toast(message, {
    className: 'toast-custom',
    duration: 4000,
    icon: '💪',
    ...options,
  });
};

// Workout specific toasts
export const workoutToasts = {
  saved: () => showSuccessToast('Workout saved successfully! 💪'),
  deleted: () => showSuccessToast('Workout deleted'),
  completed: () => showSuccessToast('Great job! Workout completed! 🎉'),
  started: () => showCustomToast('Workout session started! Let\'s go! 🚀'),
  paused: () => showCustomToast('Workout paused. Take a breather! ⏸️'),
  resumed: () => showCustomToast('Back to the grind! 💯'),
  error: (message) => showErrorToast(message || 'Something went wrong with your workout'),
};

// Meal specific toasts
export const mealToasts = {
  logged: () => showSuccessToast('Meal logged successfully! 🍽️'),
  deleted: () => showSuccessToast('Meal deleted'),
  goalReached: () => showSuccessToast('Daily calorie goal reached! 🎯'),
  goalExceeded: () => showCustomToast('You\'ve exceeded your daily calorie goal'),
  reminderSet: () => showCustomToast('Meal reminder set! 🔔'),
  error: (message) => showErrorToast(message || 'Something went wrong with meal logging'),
};

// Profile specific toasts
export const profileToasts = {
  updated: () => showSuccessToast('Profile updated successfully! ✨'),
  photoUploaded: () => showSuccessToast('Profile photo updated! 📸'),
  error: (message) => showErrorToast(message || 'Failed to update profile'),
};

// Auth specific toasts
export const authToasts = {
  loginSuccess: () => showSuccessToast('Welcome back! 👋'),
  logoutSuccess: () => showCustomToast('See you later! 👋'),
  signupSuccess: () => showSuccessToast('Account created! Welcome to MuscleUp! 🎉'),
  error: (message) => showErrorToast(message || 'Authentication failed'),
  sessionExpired: () => showErrorToast('Session expired. Please log in again.'),
};

// Generic app toasts
export const appToasts = {
  offline: () => showErrorToast('You\'re offline. Changes will sync when connected.'),
  online: () => showSuccessToast('Back online! Syncing your data...'),
  syncComplete: () => showSuccessToast('Data synced successfully!'),
  updateAvailable: () => showCustomToast('New version available! Refresh to update.'),
  featureComingSoon: () => showCustomToast('This feature is coming soon! 🚀'),
};

// Toast Provider Component
export const ToastProvider = ({ children }) => (
  <ToastContainer>
    {children}
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
        },
        success: {
          style: {
            background: 'transparent',
          },
        },
        error: {
          style: {
            background: 'transparent',
          },
        },
      }}
    />
  </ToastContainer>
);

export default ToastProvider;
