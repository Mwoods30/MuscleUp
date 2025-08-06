import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { InteractiveCharts, ChartDashboard } from './InteractiveCharts';
import { AdvancedSearch, WorkoutSearch, MealSearch } from './AdvancedSearch';
import { DragDropList, WorkoutList, ExerciseList } from './DragDropList';
import { ImageUpload, ProgressPhotos, ProfilePictureUpload } from './ImageUpload';
import { ThemeToggle } from './ThemeSystem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faSearch,
  faGripVertical,
  faCamera,
  faMoon,
  faSun,
  faDumbbell,
  faUtensils,
  faUser,
  faCalendar,
  faBolt,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';

const FeaturesContainer = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const FeatureSection = styled(motion.section)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadowLight};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px ${props => props.theme.colors.shadowMedium};
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
`;

// Sample data for demonstrations
const sampleWorkouts = [
  {
    id: '1',
    name: 'Morning Push Workout',
    description: 'Chest, shoulders, and triceps focus',
    duration: 45,
    exercises: ['Push-ups', 'Bench Press', 'Shoulder Press'],
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    date: new Date().toISOString(),
    completed: false
  },
  {
    id: '2',
    name: 'Evening Pull Session',
    description: 'Back and biceps strengthening',
    duration: 50,
    exercises: ['Pull-ups', 'Rows', 'Bicep Curls'],
    muscleGroups: ['back', 'arms'],
    difficulty: 'advanced',
    date: new Date(Date.now() - 86400000).toISOString(),
    completed: true
  },
  {
    id: '3',
    name: 'Leg Day Power',
    description: 'Complete lower body workout',
    duration: 60,
    exercises: ['Squats', 'Deadlifts', 'Lunges'],
    muscleGroups: ['legs'],
    difficulty: 'advanced',
    date: new Date(Date.now() - 172800000).toISOString(),
    completed: true
  }
];

const sampleMeals = [
  {
    id: '1',
    name: 'Protein Power Bowl',
    description: 'Quinoa, chicken, and vegetables',
    calories: 450,
    protein: 35,
    ingredients: ['quinoa', 'chicken breast', 'broccoli', 'avocado'],
    dietType: ['high-protein'],
    date: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Green Smoothie',
    description: 'Spinach, banana, and protein powder',
    calories: 280,
    protein: 25,
    ingredients: ['spinach', 'banana', 'protein powder', 'almond milk'],
    dietType: ['vegetarian', 'keto'],
    date: new Date(Date.now() - 86400000).toISOString()
  }
];

const sampleProgressPhotos = [
  {
    id: '1',
    name: 'Front Progress - January',
    src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDMTIwIDQwIDEzMCA2MCAx' + 'MzAgMTAwQzEzMCAxNDAgMTIwIDE2MCAxMDAgMTYwQzgwIDE2MCA3MCAxNDAgNzAgMTAwQzcwIDYwIDgwIDQwIDEwMCA0MFoiIGZpbGw9IiNEREU3RkYiLz4KPHN2Zz4K',
    size: 1024000,
    type: 'image/svg+xml',
    uploadedAt: new Date().toISOString(),
    description: 'Starting point progress photo',
    weight: 180,
    bodyFat: 15
  }
];

export const HighImpactFeatures = () => {
  const [workouts, setWorkouts] = useState(sampleWorkouts);
  const [meals] = useState(sampleMeals);
  const [progressPhotos, setProgressPhotos] = useState(sampleProgressPhotos);
  const [workoutSearchResults, setWorkoutSearchResults] = useState(sampleWorkouts);
  const [mealSearchResults, setMealSearchResults] = useState(sampleMeals);

  const handleWorkoutReorder = (newWorkouts) => {
    setWorkouts(newWorkouts);
  };

  const handleWorkoutToggleComplete = (id) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id ? { ...workout, completed: !workout.completed } : workout
    ));
  };

  const handleAddWorkout = (newWorkout) => {
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const handleUploadProgressPhoto = (newPhoto) => {
    setProgressPhotos(prev => [...prev, newPhoto]);
  };

  const handleDeleteProgressPhoto = (photoId) => {
    setProgressPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  return (
    <FeaturesContainer>
      {/* Interactive Charts Section */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faChartLine} />
            </SectionIcon>
            Interactive Charts & Analytics
          </SectionTitle>
        </SectionHeader>
        
        <CardDescription>
          Comprehensive data visualization with responsive charts, progress tracking, and workout analytics.
        </CardDescription>
        
        <ChartDashboard />
      </FeatureSection>

      {/* Dark Mode Theme System */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faMoon} />
            </SectionIcon>
            Dark Mode Theme System
          </SectionTitle>
          <ThemeToggle showLabel={false} />
        </SectionHeader>
        
        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faSun} />
              Light Theme
            </CardTitle>
            <CardDescription>
              Clean, bright interface with excellent readability and modern design elements.
            </CardDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faMoon} />
              Dark Theme
            </CardTitle>
            <CardDescription>
              Easy on the eyes with carefully crafted dark colors that reduce strain during extended use.
            </CardDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>

      {/* Advanced Search Section */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faSearch} />
            </SectionIcon>
            Advanced Search & Filtering
          </SectionTitle>
        </SectionHeader>
        
        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faDumbbell} />
              Workout Search
            </CardTitle>
            <CardDescription>
              Find workouts by name, exercises, muscle groups, or difficulty with intelligent fuzzy search.
            </CardDescription>
            <WorkoutSearch 
              workouts={sampleWorkouts}
              onResults={setWorkoutSearchResults}
            />
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faUtensils} />
              Meal Search
            </CardTitle>
            <CardDescription>
              Search meals by ingredients, cuisine, diet type, or nutritional content with advanced filters.
            </CardDescription>
            <MealSearch 
              meals={sampleMeals}
              onResults={setMealSearchResults}
            />
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>

      {/* Drag & Drop Section */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faGripVertical} />
            </SectionIcon>
            Drag & Drop Interface
          </SectionTitle>
        </SectionHeader>
        
        <CardDescription>
          Intuitive drag-and-drop functionality for reordering workouts, exercises, and meal plans.
        </CardDescription>
        
        <WorkoutList
          workouts={workouts}
          onReorder={handleWorkoutReorder}
          onToggleComplete={handleWorkoutToggleComplete}
          onAdd={handleAddWorkout}
          showAddForm={false}
        />
      </FeatureSection>

      {/* Image Upload Section */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faCamera} />
            </SectionIcon>
            Image Upload & Progress Photos
          </SectionTitle>
        </SectionHeader>
        
        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faUser} />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload and manage your profile picture with automatic image optimization.
            </CardDescription>
            <ProfilePictureUpload
              currentImage={null}
              onUpload={(image) => console.log('Profile image uploaded:', image)}
            />
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>
              <FontAwesomeIcon icon={faBolt} />
              Progress Photos
            </CardTitle>
            <CardDescription>
              Track your transformation with progress photos, weight tracking, and body measurements.
            </CardDescription>
            <ProgressPhotos
              photos={progressPhotos}
              onUpload={handleUploadProgressPhoto}
              onDelete={handleDeleteProgressPhoto}
            />
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>

      {/* Feature Summary */}
      <FeatureSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>
              <FontAwesomeIcon icon={faTarget} />
            </SectionIcon>
            High-Impact Features Summary
          </SectionTitle>
        </SectionHeader>
        
        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>🎯 User Experience</CardTitle>
            <CardDescription>
              Enhanced with loading skeletons, toast notifications, floating action buttons, and smooth animations that provide professional-level user feedback.
            </CardDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>📊 Data Visualization</CardTitle>
            <CardDescription>
              Interactive charts with workout progress tracking, nutrition analysis, weekly activity views, and goal progress monitoring.
            </CardDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>🔍 Smart Search</CardTitle>
            <CardDescription>
              Advanced fuzzy search with intelligent filtering, search history, and category-specific search for workouts and meals.
            </CardDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle>🎨 Theme System</CardTitle>
            <CardDescription>
              Complete dark/light mode implementation with system preference detection and smooth theme transitions across all components.
            </CardDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>
    </FeaturesContainer>
  );
};

export default HighImpactFeatures;
