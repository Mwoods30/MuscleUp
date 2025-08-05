import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faGavel, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  margin-top: auto;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    color: #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
    border-color: rgba(78, 205, 196, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(78, 205, 196, 0.2);
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink to="/privacy-policy">
            <FontAwesomeIcon icon={faShield} />
            Privacy Policy
          </FooterLink>
          <FooterLink to="/terms-of-service">
            <FontAwesomeIcon icon={faGavel} />
            Terms of Service
          </FooterLink>
          <FooterLink to="/contact">
            <FontAwesomeIcon icon={faEnvelope} />
            Contact Us
          </FooterLink>
        </FooterLinks>
        
        <Copyright>
          © 2025 MuscleUp. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
