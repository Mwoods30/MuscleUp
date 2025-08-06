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
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1rem;
    position: sticky;
    top: 0;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
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
    font-size: 1.4rem;
    padding: 1.2rem 2rem;
    width: 80%;
    text-align: center;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(220, 20, 60, 0.2) 100%);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 30px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.5) 0%, rgba(220, 20, 60, 0.4) 100%);
      border-color: rgba(255, 107, 107, 0.6);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
    }
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 1rem 1.5rem;
    width: 90%;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(220, 20, 60, 0.1) 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10000;
  position: relative;
  padding: 0.8rem 1rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(220, 20, 60, 0.3) 100%);
    border-color: rgba(255, 107, 107, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    display: block;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 0.7rem 0.9rem;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(220, 20, 60, 0.2) 100%);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 10001;
  width: 60px;
  height: 60px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.5) 0%, rgba(220, 20, 60, 0.4) 100%);
    border-color: rgba(255, 107, 107, 0.7);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    top: 1.5rem;
    right: 1.5rem;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
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
