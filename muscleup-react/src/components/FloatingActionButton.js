import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDumbbell, faUtensils, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { showCustomToast } from './ToastProvider';

const FABContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const MainFAB = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
  }
`;

const ActionButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1rem;
    margin-bottom: 0.625rem;
  }
`;

const WorkoutButton = styled(ActionButton)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  box-shadow: 0 4px 20px rgba(72, 187, 120, 0.3);
  
  &:hover {
    box-shadow: 0 6px 25px rgba(72, 187, 120, 0.4);
  }
`;

const MealButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  box-shadow: 0 4px 20px rgba(237, 137, 54, 0.3);
  
  &:hover {
    box-shadow: 0 6px 25px rgba(237, 137, 54, 0.4);
  }
`;

const PhotoButton = styled(ActionButton)`
  background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
  box-shadow: 0 4px 20px rgba(159, 122, 234, 0.3);
  
  &:hover {
    box-shadow: 0 6px 25px rgba(159, 122, 234, 0.4);
  }
`;

const ActionLabel = styled(motion.div)`
  position: absolute;
  right: 60px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.8);
  }
  
  @media (max-width: 768px) {
    right: 52px;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
  }
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleWorkoutClick = () => {
    setIsOpen(false);
    navigate('/log-workout');
    showCustomToast('Ready to crush your workout! 💪');
  };

  const handleMealClick = () => {
    setIsOpen(false);
    navigate('/track-meals');
    showCustomToast('Time to fuel your body! 🍽️');
  };

  const handlePhotoClick = () => {
    setIsOpen(false);
    showCustomToast('Progress photo feature coming soon! 📸');
  };

  const fabVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 }
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0 },
    open: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20, scale: 0 },
    open: { opacity: 1, y: 0, scale: 1 }
  };

  const labelVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <FABContainer>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div variants={itemVariants}>
                <PhotoButton
                  onClick={handlePhotoClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => {}}
                  onHoverEnd={() => {}}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  <ActionLabel
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    Progress Photo
                  </ActionLabel>
                </PhotoButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <MealButton
                  onClick={handleMealClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faUtensils} />
                  <ActionLabel
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    Log Meal
                  </ActionLabel>
                </MealButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <WorkoutButton
                  onClick={handleWorkoutClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faDumbbell} />
                  <ActionLabel
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    Log Workout
                  </ActionLabel>
                </WorkoutButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <MainFAB
          onClick={toggleMenu}
          variants={fabVariants}
          animate={isOpen ? "open" : "closed"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faPlus} />
        </MainFAB>
      </FABContainer>
    </>
  );
};

export default FloatingActionButton;
