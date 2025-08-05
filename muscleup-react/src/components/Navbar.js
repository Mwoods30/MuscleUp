import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faDumbbell, faUtensils, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-left: none;
  border-right: none;
  padding: 1.2rem 2rem;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(255, 107, 107, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    gap: 3rem;
    transition: left 0.3s ease;
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.isActive ? '#fff' : 'rgba(255, 255, 255, 0.9)'};
  text-decoration: none;
  font-weight: ${props => props.isActive ? '700' : '600'};
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.isActive ? 
    'linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(220, 20, 60, 0.2) 100%)' : 
    'transparent'};
  border: 2px solid ${props => props.isActive ? 'rgba(255, 107, 107, 0.5)' : 'transparent'};
  text-shadow: ${props => props.isActive ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.3)'};
  box-shadow: ${props => props.isActive ? 
    '0 4px 20px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)' : 
    'none'};

  &:hover {
    color: #fff;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(220, 20, 60, 0.3) 100%);
    border-color: rgba(255, 107, 107, 0.6);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 25px rgba(255, 107, 107, 0.4),
      inset 0 1px 0 rgba(255,255,255,0.3);
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    background: ${props => props.isActive ? 
      'linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(220, 20, 60, 0.3) 100%)' : 
      'rgba(255, 255, 255, 0.1)'};
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  position: relative;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NavContainer>
      <NavContent>
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
