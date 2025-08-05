const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('height').optional().isFloat({ min: 50, max: 300 }),
  body('weight').optional().isFloat({ min: 20, max: 500 }),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']),
  body('activityLevel').optional().isIn(['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extra-active'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'email', 'dateOfBirth', 'gender',
      'height', 'weight', 'activityLevel', 'fitnessGoals', 'preferences'
    ];

    const updates = {};
    
    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is being changed and if it's already taken
    if (updates.email && updates.email !== req.user.email) {
      const existingUser = await User.findByEmail(updates.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email address is already in use'
        });
      }
    }

    // Convert dateOfBirth to Date if provided
    if (updates.dateOfBirth) {
      updates.dateOfBirth = new Date(updates.dateOfBirth);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - today.getDay());

    // Get today's workouts and meals
    const [todayWorkouts, todayMeals, weekWorkouts, weekMeals] = await Promise.all([
      Workout.find({
        user: userId,
        date: { $gte: startOfToday }
      }).sort({ createdAt: -1 }),
      
      Meal.find({
        user: userId,
        date: { $gte: startOfToday }
      }).sort({ createdAt: -1 }),
      
      Workout.find({
        user: userId,
        date: { $gte: startOfWeek }
      }).sort({ date: -1 }),
      
      Meal.find({
        user: userId,
        date: { $gte: startOfWeek }
      }).sort({ date: -1 })
    ]);

    // Calculate today's totals
    const todayCaloriesConsumed = todayMeals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);
    const todayCaloriesBurned = todayWorkouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);

    // Calculate weekly totals
    const weeklyWorkoutCount = weekWorkouts.length;
    const weeklyCaloriesBurned = weekWorkouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);
    const weeklyCaloriesConsumed = weekMeals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);

    // Calculate weekly averages
    const weeklyAvgCaloriesConsumed = Math.round(weeklyCaloriesConsumed / 7);
    const weeklyAvgCaloriesBurned = Math.round(weeklyCaloriesBurned / 7);

    res.json({
      success: true,
      data: {
        today: {
          workouts: todayWorkouts.length,
          caloriesConsumed: todayCaloriesConsumed,
          caloriesBurned: todayCaloriesBurned,
          netCalories: todayCaloriesConsumed - todayCaloriesBurned,
          recentWorkouts: todayWorkouts.slice(0, 3),
          recentMeals: todayMeals.slice(0, 3)
        },
        thisWeek: {
          workouts: weeklyWorkoutCount,
          totalCaloriesConsumed: weeklyCaloriesConsumed,
          totalCaloriesBurned: weeklyCaloriesBurned,
          avgCaloriesConsumed: weeklyAvgCaloriesConsumed,
          avgCaloriesBurned: weeklyAvgCaloriesBurned
        },
        user: req.user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard data'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // days
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const [workouts, meals] = await Promise.all([
      Workout.find({
        user: userId,
        date: { $gte: daysAgo }
      }).sort({ date: 1 }),
      
      Meal.find({
        user: userId,
        date: { $gte: daysAgo }
      }).sort({ date: 1 })
    ]);

    // Group data by date for charts
    const dailyData = {};
    
    // Initialize all dates in range
    for (let d = new Date(daysAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dailyData[dateKey] = {
        date: dateKey,
        workouts: 0,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        totalVolume: 0
      };
    }

    // Add workout data
    workouts.forEach(workout => {
      const dateKey = workout.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].workouts += 1;
        dailyData[dateKey].caloriesBurned += workout.caloriesBurned || 0;
        dailyData[dateKey].totalVolume += workout.totalVolume || 0;
      }
    });

    // Add meal data
    meals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].caloriesConsumed += meal.totalCalories || 0;
      }
    });

    // Calculate totals and averages
    const totalWorkouts = workouts.length;
    const totalCaloriesConsumed = meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);
    const totalCaloriesBurned = workouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);
    const totalVolume = workouts.reduce((total, workout) => total + (workout.totalVolume || 0), 0);

    const avgCaloriesConsumed = Math.round(totalCaloriesConsumed / parseInt(period));
    const avgCaloriesBurned = Math.round(totalCaloriesBurned / parseInt(period));
    const avgWorkoutsPerWeek = Math.round((totalWorkouts / parseInt(period)) * 7);

    res.json({
      success: true,
      data: {
        period: parseInt(period),
        totals: {
          workouts: totalWorkouts,
          caloriesConsumed: totalCaloriesConsumed,
          caloriesBurned: totalCaloriesBurned,
          totalVolume: Math.round(totalVolume),
          netCalories: totalCaloriesConsumed - totalCaloriesBurned
        },
        averages: {
          caloriesConsumed: avgCaloriesConsumed,
          caloriesBurned: avgCaloriesBurned,
          workoutsPerWeek: avgWorkoutsPerWeek
        },
        dailyData: Object.values(dailyData)
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user statistics'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    // Instead of deleting, we'll deactivate the account
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      deactivatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating account'
    });
  }
});

module.exports = router;
