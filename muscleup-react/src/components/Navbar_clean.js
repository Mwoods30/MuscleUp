import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faDumbbell, faUtensils, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 26, 0.98) 100%);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    flex-direction: column;
    justify-content: center;
    gap: 2.5rem;
    transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    z-index: 9999;
    padding: 2rem;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    gap: 2rem;
    padding: 1.5rem;
  }
`;

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  ${props => props.isActive && `
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    font-weight: 600;
  `}

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    color: white;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    width: 80%;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    
    ${props => props.isActive && `
      background: rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.5);
    `}
    
    &:hover {
      background: rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.5);
      transform: translateY(-2px);
      color: white;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.875rem 1.5rem;
    width: 90%;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: #667eea;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10000;
  position: relative;
  padding: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10001;
  width: 50px;
  height: 50px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: rotate(90deg) scale(1.1);
  }

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    top: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Toggle body scroll lock
    if (!isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove('menu-open');
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NavContainer>
      <NavContent>
        <Brand>💪 MuscleUp</Brand>
        
        <MenuToggle onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuToggle>

        <NavLinks isOpen={isOpen}>
          <CloseButton isOpen={isOpen} onClick={closeMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>

          <NavLink 
            to="/" 
            isActive={location.pathname === '/'}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faHome} />
            Home
          </NavLink>

          <NavLink 
            to="/log-workout" 
            isActive={location.pathname === '/log-workout'}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faDumbbell} />
            Log Workout
          </NavLink>

          <NavLink 
            to="/track-meals" 
            isActive={location.pathname === '/track-meals'}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faUtensils} />
            Track Meals
          </NavLink>

          <NavLink 
            to="/profile" 
            isActive={location.pathname === '/profile'}
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faUser} />
            Profile
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;
