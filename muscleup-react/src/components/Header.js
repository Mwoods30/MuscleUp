import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeSystem';

const HeaderContainer = styled.header`
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)'
  };
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(255, 255, 255, 0.4)'
  };
  border-left: none;
  border-right: none;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    ${props => props.theme.mode === 'dark' 
      ? '0 2px 16px rgba(255, 107, 107, 0.1)'
      : '0 2px 16px rgba(102, 126, 234, 0.1)'
    },
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  }
  
  &:error {
    display: none;
  }
`;

const LogoText = styled.h1`
  color: ${props => props.theme.colors.textInverse};
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.5),
    ${props => props.theme.mode === 'dark' 
      ? '0 0 20px rgba(255, 107, 107, 0.3)'
      : '0 0 20px rgba(102, 126, 234, 0.3)'
    };
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(45deg, #fff 0%, #FF6B6B 30%, #DC143C 70%, #fff 100%)'
    : 'linear-gradient(45deg, #fff 0%, #667eea 30%, #764ba2 70%, #fff 100%)'
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.theme.mode === 'dark' 
      ? 'linear-gradient(90deg, transparent, #FF6B6B, transparent)'
      : 'linear-gradient(90deg, transparent, #667eea, transparent)'
    };
    border-radius: 1px;
    transition: background 0.3s ease;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.textInverse};
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const WelcomeText = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 107, 107, 0.2)'
    : 'rgba(102, 126, 234, 0.2)'
  };
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 107, 107, 0.4)'
    : 'rgba(102, 126, 234, 0.4)'
  };
  color: ${props => props.theme.colors.textInverse};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 107, 107, 0.3)'
      : 'rgba(102, 126, 234, 0.3)'
    };
    border-color: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 107, 107, 0.6)'
      : 'rgba(102, 126, 234, 0.6)'
    };
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.mode === 'dark' 
      ? '0 4px 16px rgba(255, 107, 107, 0.3)'
      : '0 4px 16px rgba(102, 126, 234, 0.3)'
    };
  }
`;

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    // Use the correct base path for GitHub Pages
    const basePath = process.env.NODE_ENV === 'production' ? '/MuscleUp' : '';
    window.location.href = `${basePath}/signin`;
  };

  const handleImageError = (e) => {
    console.log('Logo failed to load, trying alternative paths...');
    // Try alternative paths
    if (e.target.src.includes('logo.png')) {
      e.target.src = '/MuscleUp/logo.png'; // For GitHub Pages
    } else if (e.target.src.includes('/MuscleUp/logo.png')) {
      e.target.style.display = 'none'; // Hide if all attempts fail
    }
  };

  return (
    <HeaderContainer>
      <Logo>
        <LogoImage 
          src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="MuscleUp Logo"
          onError={handleImageError}
        />
        <LogoText>MuscleUp</LogoText>
      </Logo>
      
      {isAuthenticated && user && (
        <UserInfo>
          <ThemeToggle compact />
          <WelcomeText>Welcome, {user.name || user.email}!</WelcomeText>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserInfo>
      )}
    </HeaderContainer>
  );
};

export default Header;
