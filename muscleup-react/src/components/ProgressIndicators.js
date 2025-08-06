import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Loading animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const wave = keyframes`
  0%, 60%, 100% { transform: initial; }
  30% { transform: translateY(-10px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// Circular Progress Ring
const ProgressRing = styled.div`
  position: relative;
  width: ${props => props.size || 60}px;
  height: ${props => props.size || 60}px;
`;

const ProgressSvg = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: #e2e8f0;
  stroke-width: ${props => props.strokeWidth || 8};
`;

const ProgressPath = styled.circle`
  fill: none;
  stroke: ${props => props.color || '#667eea'};
  stroke-width: ${props => props.strokeWidth || 8};
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
  filter: drop-shadow(0 0 6px ${props => props.color || '#667eea'}40);
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${props => props.size ? `${props.size * 0.2}px` : '12px'};
  font-weight: 600;
  color: ${props => props.color || '#667eea'};
`;

export const CircularProgress = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 8, 
  color = '#667eea',
  showText = true,
  animated = true 
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <ProgressRing size={size}>
      <ProgressSvg>
        <ProgressCircle
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
        />
        <ProgressPath
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          color={color}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: animated ? strokeDashoffset : circumference - (progress / 100) * circumference,
          }}
        />
      </ProgressSvg>
      {showText && (
        <ProgressText size={size} color={color}>
          {Math.round(progress)}%
        </ProgressText>
      )}
    </ProgressRing>
  );
};

// Linear Progress Bar
const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${props => props.height || 8}px;
  background: #e2e8f0;
  border-radius: ${props => props.height ? `${props.height / 2}px` : '4px'};
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.gradient || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
  border-radius: inherit;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${props => props.animated ? 'shimmer 2s infinite' : 'none'};
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
`;

export const LinearProgress = ({ 
  progress = 0, 
  height = 8, 
  color = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  label,
  showPercentage = true,
  animated = true,
  className
}) => {
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <ProgressLabel>
          <span>{label}</span>
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </ProgressLabel>
      )}
      <ProgressBarContainer height={height}>
        <ProgressBarFill
          gradient={color}
          animated={animated}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </ProgressBarContainer>
    </div>
  );
};

// Step Progress Indicator
const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 2rem 0;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 60%;
    right: -40%;
    height: 2px;
    background: ${props => props.completed ? '#48bb78' : '#e2e8f0'};
    z-index: 1;
    transition: background 0.3s ease;
  }
`;

const StepCircle = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? '#48bb78' : 
    props.active ? '#667eea' : '#e2e8f0'};
  color: ${props => (props.completed || props.active) ? 'white' : '#a0aec0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
  box-shadow: ${props => (props.completed || props.active) ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'};
`;

const StepLabel = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => 
    props.completed ? '#48bb78' : 
    props.active ? '#667eea' : '#a0aec0'};
  font-weight: 500;
  text-align: center;
`;

export const StepProgress = ({ steps = [], currentStep = 0 }) => {
  return (
    <StepContainer>
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;
        
        return (
          <Step key={index} completed={completed}>
            <StepCircle
              completed={completed}
              active={active}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              {completed ? '✓' : index + 1}
            </StepCircle>
            <StepLabel completed={completed} active={active}>
              {step}
            </StepLabel>
          </Step>
        );
      })}
    </StepContainer>
  );
};

// Loading Spinner Variants
const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
`;

export const LoadingSpinner = ({ size = 40, color = '#667eea', type = 'spin' }) => {
  const spinnerStyles = {
    spin: styled.div`
      width: ${size}px;
      height: ${size}px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid ${color};
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
    `,
    
    pulse: styled.div`
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      animation: ${pulse} 1.5s ease-in-out infinite;
    `,
    
    dots: styled.div`
      display: flex;
      gap: 4px;
      
      div {
        width: ${size / 4}px;
        height: ${size / 4}px;
        background: ${color};
        border-radius: 50%;
        animation: ${wave} 1.4s ease-in-out infinite both;
        
        &:nth-child(1) { animation-delay: -0.32s; }
        &:nth-child(2) { animation-delay: -0.16s; }
        &:nth-child(3) { animation-delay: 0s; }
      }
    `,
    
    bounce: styled.div`
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      animation: ${bounce} 2s infinite;
    `
  };

  const Spinner = spinnerStyles[type];

  if (type === 'dots') {
    return (
      <SpinnerContainer>
        <Spinner>
          <div></div>
          <div></div>
          <div></div>
        </Spinner>
      </SpinnerContainer>
    );
  }

  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

// Activity Indicator for workouts
const ActivityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const ActivityIcon = styled(motion.div)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ActivityText = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: #2d3748;
  }
  
  p {
    margin: 0;
    color: #4a5568;
    font-size: 0.875rem;
  }
`;

export const ActivityIndicator = ({ 
  icon = '💪', 
  title = 'Activity in Progress', 
  description = 'Working on something awesome...',
  pulse = true 
}) => {
  return (
    <ActivityContainer>
      <ActivityIcon
        animate={pulse ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </ActivityIcon>
      <ActivityText>
        <h4>{title}</h4>
        <p>{description}</p>
      </ActivityText>
      <LoadingSpinner size={24} type="dots" />
    </ActivityContainer>
  );
};

// Workout Progress Ring
export const WorkoutProgress = ({ 
  currentSet = 0, 
  totalSets = 0, 
  currentRep = 0, 
  targetReps = 0,
  restTime = 0 
}) => {
  const setProgress = totalSets > 0 ? (currentSet / totalSets) * 100 : 0;
  const repProgress = targetReps > 0 ? (currentRep / targetReps) * 100 : 0;

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress 
          progress={setProgress} 
          size={80} 
          color="#48bb78"
          showText={false}
        />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Sets: {currentSet}/{totalSets}
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <CircularProgress 
          progress={repProgress} 
          size={80} 
          color="#667eea"
          showText={false}
        />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Reps: {currentRep}/{targetReps}
        </div>
      </div>
      
      {restTime > 0 && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress 
            progress={100} 
            size={60} 
            color="#f56565"
            showText={false}
          />
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
            Rest: {restTime}s
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  CircularProgress,
  LinearProgress,
  StepProgress,
  LoadingSpinner,
  ActivityIndicator,
  WorkoutProgress
};
