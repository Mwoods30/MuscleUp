const express = require('express');
const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  const { password: _, ...userResponse } = req.user;
  res.json({
    success: true,
    user: userResponse
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  try {
    const { name, email, age, weight, height, fitnessGoal, activityLevel } = req.body;
    const userId = req.user.id;

    // Get users array from parent scope (we'll need to pass it in server.js)
    // For now, we'll use a workaround by accessing the global users array
    if (!global.muscleUpUsers) {
      global.muscleUpUsers = [];
    }
    
    // Find and update user in the global users array
    const userIndex = global.muscleUpUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      // Update user data
      const updatedUser = {
        ...global.muscleUpUsers[userIndex],
        name: name || global.muscleUpUsers[userIndex].name,
        email: email || global.muscleUpUsers[userIndex].email,
        age: age || global.muscleUpUsers[userIndex].age,
        weight: weight || global.muscleUpUsers[userIndex].weight,
        height: height || global.muscleUpUsers[userIndex].height,
        fitnessGoal: fitnessGoal || global.muscleUpUsers[userIndex].fitnessGoal,
        activityLevel: activityLevel || global.muscleUpUsers[userIndex].activityLevel,
        updatedAt: new Date()
      };
      
      global.muscleUpUsers[userIndex] = updatedUser;
      req.user = updatedUser;
    }

    const { password: _, ...userResponse } = req.user;
    
    console.log('Profile updated for user:', userId, 'Data:', { name, email, age, weight, height, fitnessGoal, activityLevel });
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating profile' 
    });
  }
});

// Change password
router.put('/change-password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user in global array
    const userIndex = global.muscleUpUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = global.muscleUpUsers[userIndex];
    
    // Check current password (in production, this should be hashed)
    if (user.password !== currentPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password (in production, this should be hashed)
    global.muscleUpUsers[userIndex].password = newPassword;
    global.muscleUpUsers[userIndex].updatedAt = new Date();

    console.log('Password changed for user:', userId);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error changing password' 
    });
  }
});

// Export user data
router.get('/export-data', (req, res) => {
  try {
    const userId = req.user.id;
    const { password: _, ...userData } = req.user;

    const exportData = {
      user: userData,
      exportDate: new Date().toISOString(),
      dataVersion: '1.0',
      workouts: [], // TODO: Add actual workout data when implemented
      meals: [], // TODO: Add actual meal data when implemented
      progress: [] // TODO: Add actual progress data when implemented
    };

    console.log('Data exported for user:', userId);

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error exporting data' 
    });
  }
});

// Delete account
router.delete('/delete-account', (req, res) => {
  try {
    const userId = req.user.id;

    // Find and remove user from global array
    const userIndex = global.muscleUpUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Remove user data
    global.muscleUpUsers.splice(userIndex, 1);
    
    console.log('Account deleted for user:', userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting account' 
    });
  }
});

// Get user stats/dashboard
router.get('/stats', (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would typically aggregate data from workouts and meals
    // For now, we'll return mock data
    const stats = {
      totalWorkouts: 0,
      totalMeals: 0,
      avgCaloriesPerDay: 0,
      workoutsThisWeek: 0,
      currentStreak: 0,
      joinDate: req.user.createdAt
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error getting user stats' });
  }
});

// Delete user account
router.delete('/account', (req, res) => {
  try {
    // In a real app, this would delete all user data
    res.json({
      success: true,
      message: 'Account deletion requested. This feature is not fully implemented yet.'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

module.exports = router;
