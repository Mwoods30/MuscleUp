import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { showCustomToast } from './ToastProvider';

const ChartContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 1rem 0;
    color: #2d3748;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ChartSelector = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 1rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    
    &.active {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }
    
    &:hover:not(.active) {
      background: #f7fafc;
      border-color: #cbd5e0;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
      font-size: 0.875rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea, #764ba2'});
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  
  .value {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.875rem;
    opacity: 0.9;
  }
`;

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ color: '#2d3748', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ 
            color: entry.color, 
            margin: '0.25rem 0',
            fontSize: '0.875rem'
          }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Workout Progress Chart
export const WorkoutProgressChart = ({ data = [] }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample data if none provided
  const sampleData = data.length ? data : [
    { date: '2025-07-30', weight: 185, reps: 120, sets: 15 },
    { date: '2025-07-31', weight: 187, reps: 125, sets: 16 },
    { date: '2025-08-01', weight: 186, reps: 130, sets: 18 },
    { date: '2025-08-02', weight: 188, reps: 135, sets: 17 },
    { date: '2025-08-03', weight: 190, reps: 140, sets: 19 },
    { date: '2025-08-04', weight: 189, reps: 145, sets: 20 },
    { date: '2025-08-05', weight: 192, reps: 150, sets: 22 }
  ];

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartHeader>
        <h3>💪 Workout Progress</h3>
        <TimeRangeSelector>
          {['7d', '1m', '3m', '6m'].map(range => (
            <button
              key={range}
              className={timeRange === range ? 'active' : ''}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '1m' ? '1 Month' : 
               range === '3m' ? '3 Months' : '6 Months'}
            </button>
          ))}
        </TimeRangeSelector>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#718096"
            fontSize={12}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#718096" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            name="Weight Lifted (lbs)"
          />
          <Line 
            type="monotone" 
            dataKey="reps" 
            stroke="#48bb78" 
            strokeWidth={3}
            dot={{ fill: '#48bb78', strokeWidth: 2, r: 4 }}
            name="Total Reps"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Nutrition Breakdown Chart
export const NutritionChart = ({ data = [] }) => {
  const sampleData = data.length ? data : [
    { name: 'Protein', value: 150, color: '#667eea' },
    { name: 'Carbs', value: 300, color: '#48bb78' },
    { name: 'Fat', value: 80, color: '#ed8936' },
    { name: 'Fiber', value: 25, color: '#9f7aea' }
  ];

  const totalCalories = sampleData.reduce((sum, item) => {
    const calories = item.name === 'Protein' ? item.value * 4 :
                    item.name === 'Carbs' ? item.value * 4 :
                    item.name === 'Fat' ? item.value * 9 : item.value;
    return sum + calories;
  }, 0);

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3>🥗 Today's Nutrition</h3>
      
      <StatsGrid>
        <StatCard gradient="#667eea, #764ba2">
          <div className="value">{totalCalories}</div>
          <div className="label">Total Calories</div>
        </StatCard>
        <StatCard gradient="#48bb78, #38a169">
          <div className="value">{sampleData.find(d => d.name === 'Protein')?.value || 0}g</div>
          <div className="label">Protein</div>
        </StatCard>
        <StatCard gradient="#ed8936, #dd6b20">
          <div className="value">{sampleData.find(d => d.name === 'Carbs')?.value || 0}g</div>
          <div className="label">Carbohydrates</div>
        </StatCard>
        <StatCard gradient="#9f7aea, #805ad5">
          <div className="value">{sampleData.find(d => d.name === 'Fat')?.value || 0}g</div>
          <div className="label">Fat</div>
        </StatCard>
      </StatsGrid>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={sampleData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {sampleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Weekly Activity Chart
export const WeeklyActivityChart = ({ data = [] }) => {
  const sampleData = data.length ? data : [
    { day: 'Mon', workouts: 2, calories: 2200, duration: 90 },
    { day: 'Tue', workouts: 1, calories: 1800, duration: 45 },
    { day: 'Wed', workouts: 0, calories: 2000, duration: 0 },
    { day: 'Thu', workouts: 2, calories: 2400, duration: 120 },
    { day: 'Fri', workouts: 1, calories: 1900, duration: 60 },
    { day: 'Sat', workouts: 3, calories: 2600, duration: 150 },
    { day: 'Sun', workouts: 1, calories: 2100, duration: 75 }
  ];

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3>📅 Weekly Activity</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" stroke="#718096" fontSize={12} />
          <YAxis stroke="#718096" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="workouts" 
            fill="#667eea" 
            name="Workouts"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="duration" 
            fill="#48bb78" 
            name="Duration (min)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Goal Progress Radial Chart
export const GoalProgressChart = ({ goals = [] }) => {
  const sampleGoals = goals.length ? goals : [
    { name: 'Weekly Workouts', current: 5, target: 6, color: '#667eea' },
    { name: 'Weight Loss', current: 8, target: 15, color: '#48bb78' },
    { name: 'Muscle Gain', current: 3, target: 5, color: '#ed8936' },
    { name: 'Endurance', current: 12, target: 20, color: '#9f7aea' }
  ];

  const chartData = sampleGoals.map(goal => ({
    ...goal,
    progress: Math.min((goal.current / goal.target) * 100, 100),
    remaining: Math.max(100 - (goal.current / goal.target) * 100, 0)
  }));

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3>🎯 Goal Progress</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={chartData}>
          <RadialBar
            dataKey="progress"
            cornerRadius={10}
            fill="#667eea"
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {sampleGoals.map((goal, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0.5rem',
            background: '#f7fafc',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#4a5568', fontSize: '0.875rem' }}>{goal.name}</span>
            <span style={{ 
              color: goal.color, 
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {goal.current}/{goal.target}
            </span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

// Interactive Chart Dashboard
export const ChartDashboard = ({ workoutData, nutritionData, activityData, goalData }) => {
  const [activeChart, setActiveChart] = useState('progress');

  const handleChartChange = (chartType) => {
    setActiveChart(chartType);
    showCustomToast(`Switched to ${chartType} view 📊`);
  };

  return (
    <div>
      <ChartHeader>
        <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.5rem' }}>📊 Analytics Dashboard</h2>
        <ChartSelector 
          value={activeChart} 
          onChange={(e) => handleChartChange(e.target.value)}
        >
          <option value="progress">Workout Progress</option>
          <option value="nutrition">Nutrition Breakdown</option>
          <option value="activity">Weekly Activity</option>
          <option value="goals">Goal Progress</option>
        </ChartSelector>
      </ChartHeader>

      {activeChart === 'progress' && <WorkoutProgressChart data={workoutData} />}
      {activeChart === 'nutrition' && <NutritionChart data={nutritionData} />}
      {activeChart === 'activity' && <WeeklyActivityChart data={activityData} />}
      {activeChart === 'goals' && <GoalProgressChart goals={goalData} />}
    </div>
  );
};

export default ChartDashboard;
