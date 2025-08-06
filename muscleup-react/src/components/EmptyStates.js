import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, 
  faUtensils, 
  faUser, 
  faSearch, 
  faWifi,
  faExclamationTriangle,
  faPlus,
  faChartLine,
  faCalendarAlt,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

const EmptyStateContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  min-height: ${props => props.minHeight || '300px'};
  color: #4a5568;
`;

const EmptyStateIcon = styled(motion.div)`
  font-size: 4rem;
  color: #a0aec0;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: #718096;
  margin: 0 0 2rem 0;
  max-width: 400px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
`;

const EmptyStateButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
  }
`;

const EmptyStateIllustration = styled(motion.div)`
  width: 200px;
  height: 150px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea20 0%, #764ba240 100%)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 3rem;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 112px;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

// Base Empty State Component
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick, 
  minHeight,
  illustration,
  className 
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <EmptyStateContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      minHeight={minHeight}
      className={className}
    >
      {illustration ? (
        <EmptyStateIllustration variants={itemVariants}>
          {illustration}
        </EmptyStateIllustration>
      ) : (
        <EmptyStateIcon variants={itemVariants}>
          {typeof icon === 'string' ? icon : <FontAwesomeIcon icon={icon} />}
        </EmptyStateIcon>
      )}
      
      <motion.div variants={itemVariants}>
        <EmptyStateTitle>{title}</EmptyStateTitle>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <EmptyStateDescription>{description}</EmptyStateDescription>
      </motion.div>
      
      {buttonText && onButtonClick && (
        <EmptyStateButton
          variants={itemVariants}
          onClick={onButtonClick}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faPlus} />
          {buttonText}
        </EmptyStateButton>
      )}
    </EmptyStateContainer>
  );
};

// Workout Empty State
export const WorkoutEmptyState = ({ onStartWorkout }) => (
  <EmptyState
    illustration="💪"
    title="No Workouts Yet"
    description="Ready to start your fitness journey? Log your first workout and begin tracking your progress toward your goals!"
    buttonText="Start First Workout"
    onButtonClick={onStartWorkout}
  />
);

// Meals Empty State
export const MealsEmptyState = ({ onLogMeal }) => (
  <EmptyState
    illustration="🍽️"
    title="No Meals Logged Today"
    description="Keep track of your nutrition! Log your meals to monitor calories, macros, and maintain a healthy diet."
    buttonText="Log Your First Meal"
    onButtonClick={onLogMeal}
  />
);

// Profile Empty State
export const ProfileEmptyState = ({ onSetupProfile }) => (
  <EmptyState
    icon={faUser}
    title="Complete Your Profile"
    description="Tell us about yourself! Add your details to get personalized recommendations and track your fitness journey."
    buttonText="Setup Profile"
    onButtonClick={onSetupProfile}
  />
);

// Search Empty State
export const SearchEmptyState = ({ searchTerm }) => (
  <EmptyState
    icon={faSearch}
    title="No Results Found"
    description={searchTerm ? 
      `We couldn't find anything matching "${searchTerm}". Try different keywords or check your spelling.` :
      "Start typing to search through your workouts, meals, and exercises."
    }
  />
);

// Offline Empty State
export const OfflineEmptyState = ({ onRetry }) => (
  <EmptyState
    icon={faWifi}
    title="You're Offline"
    description="Check your internet connection and try again. Your data will sync automatically when you're back online."
    buttonText="Try Again"
    onButtonClick={onRetry}
  />
);

// Error Empty State
export const ErrorEmptyState = ({ onRetry, message }) => (
  <EmptyState
    icon={faExclamationTriangle}
    title="Something Went Wrong"
    description={message || "We encountered an error while loading your data. Please try again."}
    buttonText="Retry"
    onButtonClick={onRetry}
  />
);

// Analytics Empty State
export const AnalyticsEmptyState = ({ onLogActivity }) => (
  <EmptyState
    icon={faChartLine}
    title="No Data to Show Yet"
    description="Start logging your workouts and meals to see detailed analytics and track your progress over time."
    buttonText="Log Activity"
    onButtonClick={onLogActivity}
  />
);

// Calendar Empty State
export const CalendarEmptyState = ({ onScheduleWorkout, selectedDate }) => (
  <EmptyState
    icon={faCalendarAlt}
    title="No Activities Scheduled"
    description={selectedDate ? 
      `No workouts or meals planned for ${selectedDate}. Add some activities to stay on track!` :
      "Plan your fitness routine by scheduling workouts and meal prep sessions."
    }
    buttonText="Schedule Workout"
    onButtonClick={onScheduleWorkout}
  />
);

// Favorites Empty State
export const FavoritesEmptyState = ({ onExplore }) => (
  <EmptyState
    icon={faHeart}
    title="No Favorites Yet"
    description="Mark exercises, meals, or workouts as favorites to quickly access them later."
    buttonText="Explore Exercises"
    onButtonClick={onExplore}
  />
);

// Generic Loading Empty State
export const LoadingEmptyState = ({ title = "Loading...", description }) => (
  <EmptyStateContainer>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ fontSize: '3rem', marginBottom: '1rem' }}
    >
      ⏳
    </motion.div>
    <EmptyStateTitle>{title}</EmptyStateTitle>
    {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
  </EmptyStateContainer>
);

// Success Empty State (for completed tasks)
export const SuccessEmptyState = ({ title, description, onContinue, buttonText = "Continue" }) => (
  <EmptyState
    illustration="🎉"
    title={title || "All Done!"}
    description={description || "Great job! You've completed everything on your list."}
    buttonText={buttonText}
    onButtonClick={onContinue}
  />
);

// Feature Coming Soon State
export const ComingSoonState = ({ feature }) => (
  <EmptyState
    illustration="🚀"
    title="Coming Soon"
    description={`${feature} is in development and will be available soon. Stay tuned for updates!`}
  />
);

// Maintenance State
export const MaintenanceState = ({ onRefresh }) => (
  <EmptyState
    illustration="🔧"
    title="Under Maintenance"
    description="We're making improvements to give you a better experience. Please check back in a few minutes."
    buttonText="Refresh"
    onButtonClick={onRefresh}
  />
);

// Stats Empty State with different variations
export const StatsEmptyState = ({ type = 'general', onAction }) => {
  const configs = {
    workouts: {
      illustration: '📊',
      title: 'No Workout Stats',
      description: 'Complete a few workouts to see your strength and endurance progress.',
      buttonText: 'Log Workout'
    },
    nutrition: {
      illustration: '🥗',
      title: 'No Nutrition Data',
      description: 'Track your meals for a few days to see nutrition insights and trends.',
      buttonText: 'Log Meal'
    },
    progress: {
      illustration: '📈',
      title: 'Track Your Progress',
      description: 'Log activities consistently to see detailed progress charts and achievements.',
      buttonText: 'Get Started'
    },
    general: {
      illustration: '📊',
      title: 'No Statistics Available',
      description: 'Start using the app to generate meaningful statistics and insights.',
      buttonText: 'Begin Journey'
    }
  };

  const config = configs[type] || configs.general;

  return (
    <EmptyState
      illustration={config.illustration}
      title={config.title}
      description={config.description}
      buttonText={config.buttonText}
      onButtonClick={onAction}
    />
  );
};

export default {
  EmptyState,
  WorkoutEmptyState,
  MealsEmptyState,
  ProfileEmptyState,
  SearchEmptyState,
  OfflineEmptyState,
  ErrorEmptyState,
  AnalyticsEmptyState,
  CalendarEmptyState,
  FavoritesEmptyState,
  LoadingEmptyState,
  SuccessEmptyState,
  ComingSoonState,
  MaintenanceState,
  StatsEmptyState
};
