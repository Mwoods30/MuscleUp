import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import HighImpactFeatures from '../components/HighImpactFeatures';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    todayWorkouts: [],
    todayMeals: [],
    weeklyStats: {
      workouts: 0,
      calories: 0,
      totalWorkoutTime: 0
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's workouts and meals
      const [workoutsRes, mealsRes] = await Promise.all([
        axios.get(`/api/workouts?startDate=${today}&endDate=${today}`),
        axios.get(`/api/meals/daily/${today}`)
      ]);

      setDashboardData({
        todayWorkouts: workoutsRes.data.data?.workouts || [],
        todayMeals: mealsRes.data.data?.meals || [],
        weeklyStats: {
          workouts: 5, // Mock data for now
          calories: 1850,
          totalWorkoutTime: 150
        },
        recentActivity: [
          { type: 'workout', name: 'Morning Run', time: '2 hours ago' },
          { type: 'meal', name: 'Protein Shake', time: '3 hours ago' },
          { type: 'workout', name: 'Weight Training', time: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getGreeting()}, {user?.name || 'User'}!</h1>
        <p>Ready to crush your fitness goals today?</p>
      </div>

      {/* High Impact Features Showcase */}
      <HighImpactFeatures />

      <div className="dashboard-content">
        {/* Today's Overview */}
        <div className="dashboard-card overview">
          <h2>Today's Overview</h2>
          <div className="overview-stats">
            <div className="stat-item">
              <div className="stat-icon">💪</div>
              <div className="stat-details">
                <h3>{dashboardData.todayWorkouts.length}</h3>
                <p>Workouts</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🍽️</div>
              <div className="stat-details">
                <h3>{dashboardData.todayMeals.length}</h3>
                <p>Meals Logged</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">�</div>
              <div className="stat-details">
                <h3>{dashboardData.weeklyStats.calories}</h3>
                <p>Calories</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-details">
                <h3>{dashboardData.weeklyStats.totalWorkoutTime}</h3>
                <p>Minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="dashboard-card progress">
          <h2>This Week's Progress</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <div className="progress-label">
                <span>Workouts Completed</span>
                <span>{dashboardData.weeklyStats.workouts}/7</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill workout-progress"
                  style={{ width: `${(dashboardData.weeklyStats.workouts / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'workout' ? '💪' : '🍽️'}
                </div>
                <div className="activity-details">
                  <h3>{activity.name}</h3>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link 
              to="/log-workout"
              className="action-btn workout-btn"
            >
              <span className="action-icon">💪</span>
              Log Workout
            </Link>
            <Link 
              to="/track-meals"
              className="action-btn meal-btn"
            >
              <span className="action-icon">🍽️</span>
              Track Meal
            </Link>
            <Link 
              to="/profile"
              className="action-btn profile-btn"
            >
              <span className="action-icon">👤</span>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
