import React from 'react';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SwipeContainer = styled(motion.div)`
  position: relative;
  touch-action: pan-y;
  user-select: none;
`;

const SwipeIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  z-index: 1;
  
  ${props => props.direction === 'left' && `
    left: 0;
    background: linear-gradient(90deg, #e53e3e 0%, transparent 100%);
    border-radius: 0 8px 8px 0;
  `}
  
  ${props => props.direction === 'right' && `
    right: 0;
    background: linear-gradient(90deg, transparent 0%, #48bb78 100%);
    border-radius: 8px 0 0 8px;
  `}
`;

// Swipeable Card Component
export const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  leftAction = 'Delete',
  rightAction = 'Complete',
  leftColor = '#e53e3e',
  rightColor = '#48bb78',
  disabled = false,
  className = ''
}) => {
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const [showIndicator, setShowIndicator] = React.useState('');

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (disabled) return;
      
      const offset = eventData.deltaX;
      setSwipeOffset(offset);
      
      if (offset > 50) {
        setShowIndicator('right');
      } else if (offset < -50) {
        setShowIndicator('left');
      } else {
        setShowIndicator('');
      }
    },
    onSwiped: () => {
      if (disabled) return;
      
      setSwipeOffset(0);
      setShowIndicator('');
    },
    onSwipedLeft: () => {
      if (disabled) return;
      
      if (Math.abs(swipeOffset) > 100 && onSwipeLeft) {
        onSwipeLeft();
      }
    },
    onSwipedRight: () => {
      if (disabled) return;
      
      if (Math.abs(swipeOffset) > 100 && onSwipeRight) {
        onSwipeRight();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <SwipeContainer
      {...handlers}
      className={className}
      animate={{ x: disabled ? 0 : swipeOffset }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {showIndicator === 'left' && (
        <SwipeIndicator
          direction="left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {leftAction}
        </SwipeIndicator>
      )}
      
      {showIndicator === 'right' && (
        <SwipeIndicator
          direction="right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {rightAction}
        </SwipeIndicator>
      )}
      
      {children}
    </SwipeContainer>
  );
};

// Navigation Swipe Hook
export const useNavigationSwipe = (navigate) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Could navigate to next page or show next content
      console.log('Swiped left - navigate forward');
    },
    onSwipedRight: () => {
      // Could go back or show previous content
      console.log('Swiped right - navigate back');
      if (window.history.length > 1) {
        navigate(-1);
      }
    },
    preventDefaultTouchmoveEvent: false,
    trackMouse: false, // Only track touch for navigation
    trackTouch: true,
  });

  return handlers;
};

// Pull to Refresh Component
export const PullToRefresh = ({ onRefresh, children, threshold = 60 }) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isPulling, setIsPulling] = React.useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === 'Down' && window.scrollY === 0) {
        setIsPulling(true);
        setPullDistance(Math.min(eventData.deltaY, threshold * 2));
      }
    },
    onSwiped: async (eventData) => {
      if (isPulling && pullDistance >= threshold && onRefresh) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setIsPulling(false);
          setPullDistance(0);
        }
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }
    },
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
  });

  return (
    <div {...handlers} style={{ position: 'relative' }}>
      {(isPulling || isRefreshing) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: pullDistance > 0 ? Math.min(pullDistance, threshold) : 0,
            opacity: pullDistance > 20 ? 1 : 0
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.875rem',
            overflow: 'hidden'
          }}
        >
          {isRefreshing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: '1rem' }}
              >
                ⟳
              </motion.div>
              Refreshing...
            </div>
          ) : pullDistance >= threshold ? (
            'Release to refresh'
          ) : (
            'Pull down to refresh'
          )}
        </motion.div>
      )}
      {children}
    </div>
  );
};

// Swipe Tutorial Component
export const SwipeTutorial = ({ onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    {
      title: 'Swipe Right',
      description: 'Swipe right on items to mark them as complete',
      icon: '➡️',
      demo: 'right'
    },
    {
      title: 'Swipe Left',
      description: 'Swipe left on items to delete them',
      icon: '⬅️',
      demo: 'left'
    },
    {
      title: 'Pull Down',
      description: 'Pull down on any page to refresh your data',
      icon: '⬇️',
      demo: 'down'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {steps[currentStep].icon}
        </div>
        
        <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>
          {steps[currentStep].title}
        </h3>
        
        <p style={{ marginBottom: '2rem', color: '#4a5568' }}>
          {steps[currentStep].description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: currentStep === 0 ? '#f7fafc' : 'white',
              color: currentStep === 0 ? '#a0aec0' : '#4a5568',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentStep ? '#667eea' : '#e2e8f0'
                }}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#667eea',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#667eea',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeableCard;
