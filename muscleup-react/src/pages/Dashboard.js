import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
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

      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="dashboard-card stats-card">
          <h2>This Week</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{dashboardData.weeklyStats.workouts}</span>
              <span className="stat-label">Workouts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{dashboardData.weeklyStats.calories}</span>
              <span className="stat-label">Avg Calories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{dashboardData.weeklyStats.totalWorkoutTime}m</span>
              <span className="stat-label">Total Time</span>
            </div>
          </div>
        </div>

        {/* Today's Workouts */}
        <div className="dashboard-card">
          <h2>Today's Workouts</h2>
          {dashboardData.todayWorkouts.length > 0 ? (
            <div className="activity-list">
              {dashboardData.todayWorkouts.map((workout, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon workout-icon">💪</div>
                  <div className="activity-details">
                    <h3>{workout.name}</h3>
                    <p>{workout.duration} minutes • {workout.exercises?.length || 0} exercises</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No workouts logged today</p>
              <Link to="/log-workout" className="btn-primary">
                Log Workout
              </Link>
            </div>
          )}
        </div>

        {/* Today's Meals */}
        <div className="dashboard-card">
          <h2>Today's Nutrition</h2>
          {dashboardData.todayMeals.length > 0 ? (
            <div className="activity-list">
              {dashboardData.todayMeals.slice(0, 3).map((meal, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon meal-icon">🍽️</div>
                  <div className="activity-details">
                    <h3>{meal.mealType}</h3>
                    <p>{meal.calories || 0} calories</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No meals logged today</p>
              <Link to="/track-meals" className="btn-primary">
                Track Meals
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}-icon`}>
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
