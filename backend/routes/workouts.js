const express = require('express');
const { body, validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/workouts
// @desc    Get user's workouts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate, 
      isTemplate = false 
    } = req.query;
    
    const query = { 
      user: req.user._id,
      isTemplate: isTemplate === 'true'
    };

    // Add date filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: -1, createdAt: -1 },
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    };

    const workouts = await Workout.find(query)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate);

    const total = await Workout.countDocuments(query);

    res.json({
      success: true,
      data: {
        workouts,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      }
    });

  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting workouts'
    });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get specific workout
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'firstName lastName');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      data: { workout }
    });

  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting workout'
    });
  }
});

// @route   POST /api/workouts
// @desc    Create new workout
// @access  Private
router.post('/', [
  auth,
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Workout name must be between 1 and 100 characters'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  body('exercises.*.name')
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('Duration must be between 1 and 600 minutes'),
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

    const workoutData = {
      ...req.body,
      user: req.user._id,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const workout = new Workout(workoutData);
    await workout.save();

    // Populate user data
    await workout.populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating workout'
    });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', [
  auth,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Workout name must be between 1 and 100 characters'),
  body('exercises')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('Duration must be between 1 and 600 minutes')
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

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout updated successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating workout'
    });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });

  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting workout'
    });
  }
});

// @route   GET /api/workouts/templates
// @desc    Get workout templates
// @access  Private
router.get('/templates/list', auth, async (req, res) => {
  try {
    const templates = await Workout.find({
      user: req.user._id,
      isTemplate: true
    }).sort({ templateName: 1 });

    res.json({
      success: true,
      data: { templates }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting workout templates'
    });
  }
});

// @route   POST /api/workouts/:id/template
// @desc    Save workout as template
// @access  Private
router.post('/:id/template', [
  auth,
  body('templateName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Template name must be between 1 and 100 characters')
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

    const originalWorkout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!originalWorkout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Create template from workout
    const templateData = {
      user: req.user._id,
      name: originalWorkout.name,
      exercises: originalWorkout.exercises,
      notes: originalWorkout.notes,
      isTemplate: true,
      templateName: req.body.templateName,
      date: new Date() // Templates get current date
    };

    const template = new Workout(templateData);
    await template.save();

    res.status(201).json({
      success: true,
      message: 'Workout template created successfully',
      data: { template }
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating workout template'
    });
  }
});

// @route   POST /api/workouts/from-template/:templateId
// @desc    Create workout from template
// @access  Private
router.post('/from-template/:templateId', [
  auth,
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
], async (req, res) => {
  try {
    const template = await Workout.findOne({
      _id: req.params.templateId,
      user: req.user._id,
      isTemplate: true
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Workout template not found'
      });
    }

    // Create new workout from template
    const workoutData = {
      user: req.user._id,
      name: template.name,
      exercises: template.exercises.map(exercise => ({
        ...exercise.toObject(),
        sets: exercise.sets.map(set => ({
          ...set.toObject(),
          // Clear actual values, keep structure
          reps: null,
          weight: null,
          duration: null,
          distance: null
        }))
      })),
      notes: template.notes,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      isTemplate: false
    };

    const workout = new Workout(workoutData);
    await workout.save();
    await workout.populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Workout created from template successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Create from template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating workout from template'
    });
  }
});

module.exports = router;
