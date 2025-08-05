const express = require('express');
const { body, validationResult } = require('express-validator');
const Meal = require('../models/Meal');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/meals
// @desc    Get user's meals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate, 
      mealType 
    } = req.query;
    
    const query = { user: req.user._id };

    // Add date filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Add meal type filtering if provided
    if (mealType) {
      query.mealType = mealType;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: -1, createdAt: -1 }
    };

    const meals = await Meal.find(query)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .populate('user', 'firstName lastName');

    const total = await Meal.countDocuments(query);

    res.json({
      success: true,
      data: {
        meals,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      }
    });

  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting meals'
    });
  }
});

// @route   GET /api/meals/:id
// @desc    Get specific meal
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'firstName lastName');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: { meal }
    });

  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting meal'
    });
  }
});

// @route   POST /api/meals
// @desc    Create new meal
// @access  Private
router.post('/', [
  auth,
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('foods')
    .isArray({ min: 1 })
    .withMessage('At least one food item is required'),
  body('foods.*.name')
    .trim()
    .notEmpty()
    .withMessage('Food name is required'),
  body('foods.*.quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be at least 0.1'),
  body('foods.*.unit')
    .isIn(['g', 'kg', 'oz', 'lb', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'serving'])
    .withMessage('Invalid unit'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
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

    const mealData = {
      ...req.body,
      user: req.user._id,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const meal = new Meal(mealData);
    await meal.save();

    // Populate user data
    await meal.populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: { meal }
    });

  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating meal'
    });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update meal
// @access  Private
router.put('/:id', [
  auth,
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('foods')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one food item is required'),
  body('foods.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Food name is required'),
  body('foods.*.quantity')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be at least 0.1')
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

    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal updated successfully',
      data: { meal }
    });

  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating meal'
    });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete meal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });

  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting meal'
    });
  }
});

// @route   GET /api/meals/daily/:date
// @desc    Get all meals for a specific date
// @access  Private
router.get('/daily/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const meals = await Meal.find({
      user: req.user._id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).sort({ createdAt: 1 });

    // Group meals by type
    const mealsByType = {
      breakfast: meals.filter(meal => meal.mealType === 'breakfast'),
      lunch: meals.filter(meal => meal.mealType === 'lunch'),
      dinner: meals.filter(meal => meal.mealType === 'dinner'),
      snack: meals.filter(meal => meal.mealType === 'snack')
    };

    // Calculate daily totals
    const dailyTotals = {
      calories: meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0),
      protein: meals.reduce((total, meal) => total + (meal.totalMacros?.protein || 0), 0),
      carbohydrates: meals.reduce((total, meal) => total + (meal.totalMacros?.carbohydrates || 0), 0),
      fat: meals.reduce((total, meal) => total + (meal.totalMacros?.fat || 0), 0),
      fiber: meals.reduce((total, meal) => total + (meal.totalMacros?.fiber || 0), 0),
      sugar: meals.reduce((total, meal) => total + (meal.totalMacros?.sugar || 0), 0),
      sodium: meals.reduce((total, meal) => total + (meal.totalMacros?.sodium || 0), 0)
    };

    res.json({
      success: true,
      data: {
        date: req.params.date,
        meals: mealsByType,
        totals: dailyTotals,
        mealCount: meals.length
      }
    });

  } catch (error) {
    console.error('Get daily meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting daily meals'
    });
  }
});

// @route   GET /api/meals/nutrition/summary
// @desc    Get nutrition summary for date range
// @access  Private
router.get('/nutrition/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const meals = await Meal.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    // Group by date for daily breakdown
    const dailyBreakdown = {};
    
    meals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      
      if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = {
          date: dateKey,
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          meals: 0
        };
      }
      
      dailyBreakdown[dateKey].calories += meal.totalCalories || 0;
      dailyBreakdown[dateKey].protein += meal.totalMacros?.protein || 0;
      dailyBreakdown[dateKey].carbohydrates += meal.totalMacros?.carbohydrates || 0;
      dailyBreakdown[dateKey].fat += meal.totalMacros?.fat || 0;
      dailyBreakdown[dateKey].fiber += meal.totalMacros?.fiber || 0;
      dailyBreakdown[dateKey].meals += 1;
    });

    // Calculate totals and averages
    const totalDays = Object.keys(dailyBreakdown).length || 1;
    const totals = {
      calories: meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0),
      protein: meals.reduce((total, meal) => total + (meal.totalMacros?.protein || 0), 0),
      carbohydrates: meals.reduce((total, meal) => total + (meal.totalMacros?.carbohydrates || 0), 0),
      fat: meals.reduce((total, meal) => total + (meal.totalMacros?.fat || 0), 0),
      fiber: meals.reduce((total, meal) => total + (meal.totalMacros?.fiber || 0), 0),
      meals: meals.length
    };

    const averages = {
      calories: Math.round(totals.calories / totalDays),
      protein: Math.round(totals.protein / totalDays),
      carbohydrates: Math.round(totals.carbohydrates / totalDays),
      fat: Math.round(totals.fat / totalDays),
      fiber: Math.round(totals.fiber / totalDays),
      mealsPerDay: Math.round(totals.meals / totalDays)
    };

    res.json({
      success: true,
      data: {
        dateRange: { startDate, endDate },
        totals,
        averages,
        dailyBreakdown: Object.values(dailyBreakdown)
      }
    });

  } catch (error) {
    console.error('Get nutrition summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting nutrition summary'
    });
  }
});

module.exports = router;
