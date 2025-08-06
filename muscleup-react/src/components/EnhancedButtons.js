import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Enhanced button animations
const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
  }
`;

// Base button styles with enhanced interactions
const BaseButton = styled(motion.button)`
  position: relative;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  outline: none;
  user-select: none;
  
  &:focus-visible {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  // Ripple effect
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }
  
  &:active::before {
    width: 300px;
    height: 300px;
    animation: ${ripple} 0.3s ease-out;
  }
`;

// Primary button with gradient and enhanced effects
export const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  // Loading state
  ${props => props.loading && css`
    pointer-events: none;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

// Secondary button
export const SecondaryButton = styled(BaseButton)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 2rem;
  
  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
`;

// Success button
export const SuccessButton = styled(BaseButton)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.75rem 2rem;
  box-shadow: 0 4px 20px rgba(72, 187, 120, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(72, 187, 120, 0.4);
  }
`;

// Danger button
export const DangerButton = styled(BaseButton)`
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  padding: 0.75rem 2rem;
  box-shadow: 0 4px 20px rgba(245, 101, 101, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(245, 101, 101, 0.4);
  }
`;

// Icon button
export const IconButton = styled(BaseButton)`
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  
  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.1);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

// Floating button with pulse animation
export const FloatingButton = styled(BaseButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  z-index: 1000;
  animation: ${pulse} 2s infinite;
  
  &:hover:not(:disabled) {
    animation: none;
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
  }
`;

// Shimmer button for special actions
export const ShimmerButton = styled(BaseButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  color: white;
  padding: 1rem 2rem;
  animation: ${shimmer} 2s linear infinite;
  
  &:hover:not(:disabled) {
    animation: none;
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
`;

// Glow button for achievements
export const GlowButton = styled(BaseButton)`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #744210;
  padding: 0.75rem 2rem;
  font-weight: 700;
  animation: ${glow} 1.5s ease-in-out infinite;
  
  &:hover:not(:disabled) {
    animation: none;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 40px rgba(255, 215, 0, 0.4);
  }
`;

// Toggle button
export const ToggleButton = styled(BaseButton)`
  background: ${props => props.active ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: 2px solid ${props => props.active ? 'transparent' : '#667eea'};
  padding: 0.5rem 1rem;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? 
      'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' : 
      'rgba(102, 126, 234, 0.1)'};
    transform: translateY(-1px);
  }
`;

// Card with hover effects
export const InteractiveCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

// Input with enhanced focus states
export const EnhancedInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
    transition: color 0.2s;
  }
  
  &:focus::placeholder {
    color: #cbd5e0;
  }
`;

// Progress button that shows completion
export const ProgressButton = styled(BaseButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress || 0}%;
    background: rgba(255, 255, 255, 0.2);
    transition: width 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
`;

// Framer Motion button variants
export const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  loading: { 
    scale: [1, 1.02, 1],
    transition: { duration: 1, repeat: Infinity }
  }
};

// Enhanced motion button
export const MotionButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Export all button animation presets
export const buttonAnimations = {
  primary: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.98, y: 0 },
    transition: { duration: 0.2 }
  },
  bounce: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },
  slide: {
    whileHover: { x: 5 },
    whileTap: { x: 0 },
    transition: { duration: 0.2 }
  },
  rotate: {
    whileHover: { rotate: 5 },
    whileTap: { rotate: 0 },
    transition: { duration: 0.2 }
  }
};

export default {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  DangerButton,
  IconButton,
  FloatingButton,
  ShimmerButton,
  GlowButton,
  ToggleButton,
  InteractiveCard,
  EnhancedInput,
  ProgressButton,
  MotionButton,
  buttonVariants,
  buttonAnimations
};
