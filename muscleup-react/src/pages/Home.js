import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faUtensils, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: #fff;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #FF6B6B, #DC143C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const PersonalizedGreeting = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  text-align: center;
`;

const GreetingText = styled.h2`
  color: #FF6B6B;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const MotivationalText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(78, 205, 196, 0.4);
    box-shadow: 0 16px 64px rgba(78, 205, 196, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #FF6B6B;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const FeatureTitle = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  margin-top: 3rem;
  text-align: center;
`;

const StatsTitle = styled.h2`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatItem = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

const Home = () => {
  const { user } = useAuth();

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>Transform Your Fitness Journey</HeroTitle>
        <HeroSubtitle>
          Track workouts, monitor nutrition, and achieve your fitness goals with our comprehensive platform
        </HeroSubtitle>
      </Hero>

      {user && (
        <PersonalizedGreeting>
          <GreetingText>Welcome back, {user.name || user.email.split('@')[0]}! 💪</GreetingText>
          <MotivationalText>
            Ready to crush your fitness goals today? Every workout counts towards your transformation!
          </MotivationalText>
        </PersonalizedGreeting>
      )}

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <FontAwesomeIcon icon={faDumbbell} />
          </FeatureIcon>
          <FeatureTitle>Workout Tracking</FeatureTitle>
          <FeatureDescription>
            Log your exercises, sets, reps, and weights. Track your progress over time and see your strength gains.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FontAwesomeIcon icon={faUtensils} />
          </FeatureIcon>
          <FeatureTitle>Nutrition Monitoring</FeatureTitle>
          <FeatureDescription>
            Track your meals, calories, and macronutrients. Get insights into your eating habits and optimize your diet.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FontAwesomeIcon icon={faChartLine} />
          </FeatureIcon>
          <FeatureTitle>Progress Analytics</FeatureTitle>
          <FeatureDescription>
            Visualize your fitness journey with detailed charts and statistics. See your improvements over time.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FontAwesomeIcon icon={faUsers} />
          </FeatureIcon>
          <FeatureTitle>Community Support</FeatureTitle>
          <FeatureDescription>
            Connect with like-minded fitness enthusiasts. Share your achievements and get motivated by others.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <StatsSection>
        <StatsTitle>Your Fitness at a Glance</StatsTitle>
        <StatsGrid>
          <StatItem>
            <StatNumber>0</StatNumber>
            <StatLabel>Workouts Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>0</StatNumber>
            <StatLabel>Meals Logged</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>0</StatNumber>
            <StatLabel>Days Active</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>0</StatNumber>
            <StatLabel>Goals Achieved</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;
