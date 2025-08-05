import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitnessGoal: user?.fitnessGoal || '',
    activityLevel: user?.activityLevel || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fitnessGoals = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'gain_muscle', label: 'Gain Muscle' },
    { value: 'maintain', label: 'Maintain Weight' },
    { value: 'improve_fitness', label: 'Improve Fitness' },
    { value: 'build_strength', label: 'Build Strength' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (Little/no exercise)' },
    { value: 'light', label: 'Light (1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (2x/day, intense)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const response = await axios.put('/api/users/profile', profile);
      
      if (response.data.success) {
        updateUser(response.data.data.user);
        setSuccess(true);
        setIsEditing(false);
        
        // Show success message for 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setSuccess(true);
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/export-data');
      
      if (response.data.success) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `muscleup-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/users/delete-account');
      
      if (response.data.success) {
        alert('Account deleted successfully. You will be logged out.');
        logout();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const weightKg = parseFloat(profile.weight) * 0.453592; // lbs to kg
      const heightM = parseFloat(profile.height) * 0.0254; // inches to meters
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal', color: '#27ae60' };
    if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>👤 Profile</h1>
        <p>Manage your account and fitness preferences</p>
      </div>

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          {error}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-grid">
          {/* Profile Info Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              <button 
                type="button" 
                onClick={() => setIsEditing(!isEditing)}
                className="edit-btn"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={profile.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="13"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight (lbs)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={profile.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="50"
                    max="500"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="height">Height (inches)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="36"
                  max="96"
                  step="0.1"
                />
              </div>

              {isEditing && (
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>

          {/* Fitness Goals Card */}
          <div className="profile-card">
            <h2>Fitness Goals</h2>
            
            <div className="form-group">
              <label htmlFor="fitnessGoal">Primary Goal</label>
              <select
                id="fitnessGoal"
                name="fitnessGoal"
                value={profile.fitnessGoal}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select a goal</option>
                {fitnessGoals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select activity level</option>
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Health Stats Card */}
          <div className="profile-card">
            <h2>Health Stats</h2>
            
            {bmi && bmiInfo ? (
              <div className="bmi-section">
                <div className="bmi-display">
                  <span className="bmi-number">{bmi}</span>
                  <span className="bmi-label">BMI</span>
                </div>
                <div 
                  className="bmi-category"
                  style={{ color: bmiInfo.color }}
                >
                  {bmiInfo.category}
                </div>
                <div className="bmi-info">
                  <small>BMI is calculated from your height and weight</small>
                </div>
              </div>
            ) : (
              <div className="empty-stats">
                <p>Add your height and weight to see your BMI</p>
              </div>
            )}
          </div>

          {/* Account Actions Card */}
          <div className="profile-card">
            <h2>Account Actions</h2>
            
            <div className="action-buttons">
              <button 
                className="action-btn change-password-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                🔒 Change Password
              </button>
              
              <button 
                className="action-btn export-data-btn"
                onClick={handleExportData}
                disabled={loading}
              >
                📊 Export Data
              </button>
              
              <button 
                className="action-btn logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
              
              <button 
                className="action-btn delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                ⚠️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>⚠️ This action cannot be undone!</p>
              <p>Deleting your account will permanently remove:</p>
              <ul>
                <li>Your profile information</li>
                <li>All workout data</li>
                <li>All meal tracking data</li>
                <li>Progress history</li>
              </ul>
              <p>Are you sure you want to delete your account?</p>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
