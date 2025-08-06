import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const SignInContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SignInCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 16px 64px rgba(0, 0, 0, 0.3),
    0 8px 32px rgba(255, 107, 107, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    border-radius: 25px;
    pointer-events: none;
  }
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff 0%, #FF6B6B 30%, #DC143C 70%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
  position: relative;
  z-index: 1;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.25rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? 
    'linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(220, 20, 60, 0.3) 100%)' : 
    'transparent'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: ${props => props.active ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'};
  box-shadow: ${props => props.active ? 
    '0 4px 15px rgba(255, 107, 107, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)' : 
    'none'};

  &:hover {
    background: ${props => props.active ? 
      'linear-gradient(135deg, rgba(255, 107, 107, 0.5) 0%, rgba(220, 20, 60, 0.4) 100%)' :
      'rgba(255, 107, 107, 0.2)'};
    color: #fff;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-sizing: border-box;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #FF6B6B;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0 25px rgba(255, 107, 107, 0.4),
      0 4px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.18);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: #FF6B6B;
  }
`;

const SubmitButton = styled.button`
  padding: 1.2rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #FF6B6B 0%, #DC143C 50%, #8B0000 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 
    0 6px 25px rgba(255, 107, 107, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 10px 35px rgba(255, 107, 107, 0.5),
      0 4px 15px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, #FF7F7F 0%, #E6143C 50%, #9B0000 100%);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    &::before {
      display: none;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  span {
    padding: 0 1.5rem;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 0.5rem 1rem;
    backdrop-filter: blur(10px);
  }
`;

const OAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &.google:hover {
    border-color: #db4437;
    box-shadow: 
      0 6px 25px rgba(219, 68, 55, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &.facebook:hover {
    border-color: #3b5998;
    box-shadow: 
      0 6px 25px rgba(59, 89, 152, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &.apple:hover {
    border-color: #333;
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DemoSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const DemoTitle = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const DemoInfo = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
`;

const DemoButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const DemoButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(220, 20, 60, 0.1) 100%);
  border: 2px solid rgba(255, 107, 107, 0.4);
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 15px rgba(255, 107, 107, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, rgba(75, 181, 67, 0.15) 0%, rgba(46, 125, 50, 0.1) 100%);
  border: 2px solid rgba(75, 181, 67, 0.4);
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 15px rgba(75, 181, 67, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ForgotPassword = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 1.5rem;
  display: block;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;

  &:hover {
    color: #fff;
    background: rgba(255, 107, 107, 0.15);
    border-color: rgba(255, 107, 107, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }
`;

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, oauthLogin } = useAuth(); // eslint-disable-line no-unused-vars
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError(result.error);
        }
      } else {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    
    setLoading(false);
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      setError('');
      
      // For development/demo purposes, create a demo account
      if (provider === 'Google') {
        // Simulate Google OAuth response
        const demoUser = {
          name: 'Demo User (Google)',
          email: 'demo.google@muscleup.com',
          password: 'demo123',
          provider: 'google'
        };
        
        const result = await register(demoUser);
        if (result.success) {
          setSuccess(`Welcome! Signed in with ${provider}. Redirecting...`);
          setTimeout(() => navigate('/'), 2000);
        } else {
          // Try to login if user already exists
          const loginResult = await login(demoUser.email, demoUser.password);
          if (loginResult.success) {
            setSuccess(`Welcome back! Signed in with ${provider}. Redirecting...`);
            setTimeout(() => navigate('/'), 2000);
          } else {
            setError(`Failed to sign in with ${provider}: ${loginResult.error}`);
          }
        }
      } else if (provider === 'Facebook') {
        // Simulate Facebook OAuth response
        const demoUser = {
          name: 'Demo User (Facebook)',
          email: 'demo.facebook@muscleup.com',
          password: 'demo123',
          provider: 'facebook'
        };
        
        const result = await register(demoUser);
        if (result.success) {
          setSuccess(`Welcome! Signed in with ${provider}. Redirecting...`);
          setTimeout(() => navigate('/'), 2000);
        } else {
          // Try to login if user already exists
          const loginResult = await login(demoUser.email, demoUser.password);
          if (loginResult.success) {
            setSuccess(`Welcome back! Signed in with ${provider}. Redirecting...`);
            setTimeout(() => navigate('/'), 2000);
          } else {
            setError(`Failed to sign in with ${provider}: ${loginResult.error}`);
          }
        }
      } else if (provider === 'Apple') {
        // Simulate Apple OAuth response
        const demoUser = {
          name: 'Demo User (Apple)',
          email: 'demo.apple@muscleup.com',
          password: 'demo123',
          provider: 'apple'
        };
        
        const result = await register(demoUser);
        if (result.success) {
          setSuccess(`Welcome! Signed in with ${provider}. Redirecting...`);
          setTimeout(() => navigate('/'), 2000);
        } else {
          // Try to login if user already exists
          const loginResult = await login(demoUser.email, demoUser.password);
          if (loginResult.success) {
            setSuccess(`Welcome back! Signed in with ${provider}. Redirecting...`);
            setTimeout(() => navigate('/'), 2000);
          } else {
            setError(`Failed to sign in with ${provider}: ${loginResult.error}`);
          }
        }
      } else {
        setError(`${provider} OAuth integration is coming soon!`);
      }
    } catch (err) {
      console.error(`OAuth error for ${provider}:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (demoType) => {
    try {
      setLoading(true);
      setError('');
      
      let demoCredentials;
      
      if (demoType === 'user') {
        demoCredentials = {
          name: 'Demo User',
          email: 'demo@muscleup.com',
          password: 'demo123'
        };
      } else if (demoType === 'admin') {
        demoCredentials = {
          name: 'Demo Admin',
          email: 'admin@muscleup.com',
          password: 'admin123'
        };
      }

      // Try to register first (in case user doesn't exist)
      const registerResult = await register(demoCredentials);
      if (registerResult.success) {
        setSuccess(`Welcome ${demoCredentials.name}! Demo account created. Redirecting...`);
        setTimeout(() => navigate('/'), 2000);
      } else {
        // If registration fails (user exists), try to login
        const loginResult = await login(demoCredentials.email, demoCredentials.password);
        if (loginResult.success) {
          setSuccess(`Welcome back ${demoCredentials.name}! Redirecting...`);
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError(`Demo login failed: ${loginResult.error}`);
        }
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <SignInContainer>
      <SignInCard>
        <Title>MuscleUp</Title>
        
        <TabContainer>
          <Tab active={!isSignUp} onClick={() => setIsSignUp(false)}>
            Sign In
          </Tab>
          <Tab active={isSignUp} onClick={() => setIsSignUp(true)}>
            Sign Up
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <InputGroup>
              <InputIcon>
                <FontAwesomeIcon icon={faUser} />
              </InputIcon>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required={isSignUp}
              />
            </InputGroup>
          )}

          <InputGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faEnvelope} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faLock} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </PasswordToggle>
          </InputGroup>

          {isSignUp && (
            <InputGroup>
              <InputIcon>
                <FontAwesomeIcon icon={faLock} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={isSignUp}
              />
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </SubmitButton>
        </Form>

        {!isSignUp && (
          <ForgotPassword to="/forgot-password">
            Forgot your password?
          </ForgotPassword>
        )}

        <Divider>
          <span>or continue with</span>
        </Divider>

        <OAuthButtons>
          <OAuthButton 
            type="button" 
            className="google"
            onClick={() => handleOAuthLogin('Google')}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faGoogle} />
            Continue with Google
          </OAuthButton>
          
          <OAuthButton 
            type="button" 
            className="facebook"
            onClick={() => handleOAuthLogin('Facebook')}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faFacebook} />
            Continue with Facebook
          </OAuthButton>
          
          <OAuthButton 
            type="button" 
            className="apple"
            onClick={() => handleOAuthLogin('Apple')}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faApple} />
            Continue with Apple
          </OAuthButton>
        </OAuthButtons>

        <DemoSection>
          <DemoTitle>🚀 Quick Start - Try Demo Mode</DemoTitle>
          <DemoInfo>
            Test MuscleUp instantly with our demo accounts. No registration required!
          </DemoInfo>
          <DemoButtons>
            <DemoButton
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
            >
              👤 Demo User Login
            </DemoButton>
            <DemoButton
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              👑 Demo Admin Login
            </DemoButton>
          </DemoButtons>
        </DemoSection>
      </SignInCard>
    </SignInContainer>
  );
};

export default SignIn;
