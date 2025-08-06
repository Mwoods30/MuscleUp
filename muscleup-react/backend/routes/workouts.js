const express = require('express');
const router = express.Router();

// In-memory storage for workouts (replace with MongoDB later)
let workouts = [];
let workoutIdCounter = 1;

// Get all workouts for a user
router.get('/', (req, res) => {
  const userId = req.user?.id;
  const userWorkouts = workouts.filter(w => w.userId === userId);
  
  res.json({
    success: true,
    data: {
      workouts: userWorkouts
    }
  });
});

// Get a specific workout
router.get('/:id', (req, res) => {
  const workoutId = parseInt(req.params.id);
  const userId = req.user?.id;
  
  const workout = workouts.find(w => w.id === workoutId && w.userId === userId);
  
  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  
  res.json({
    success: true,
    workout
  });
});

// Create a new workout
router.post('/', (req, res) => {
  try {
    const { name, exercises, duration, date, notes } = req.body;
    const userId = req.user?.id;

    if (!name || !exercises) {
      return res.status(400).json({ message: 'Please provide workout name and exercises' });
    }

    const workout = {
      id: workoutIdCounter++,
      userId,
      name,
      exercises: exercises || [],
      duration: duration || 0,
      date: date || new Date(),
      notes: notes || '',
      createdAt: new Date()
    };

    workouts.push(workout);

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      workout
    });

  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Server error creating workout' });
  }
});

// Update a workout
router.put('/:id', (req, res) => {
  try {
    const workoutId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { name, exercises, duration, date, notes } = req.body;

    const workoutIndex = workouts.findIndex(w => w.id === workoutId && w.userId === userId);
    
    if (workoutIndex === -1) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update workout
    workouts[workoutIndex] = {
      ...workouts[workoutIndex],
      name: name || workouts[workoutIndex].name,
      exercises: exercises || workouts[workoutIndex].exercises,
      duration: duration !== undefined ? duration : workouts[workoutIndex].duration,
      date: date || workouts[workoutIndex].date,
      notes: notes !== undefined ? notes : workouts[workoutIndex].notes,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Workout updated successfully',
      workout: workouts[workoutIndex]
    });

  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Server error updating workout' });
  }
});

// Delete a workout
router.delete('/:id', (req, res) => {
  try {
    const workoutId = parseInt(req.params.id);
    const userId = req.user?.id;

    const workoutIndex = workouts.findIndex(w => w.id === workoutId && w.userId === userId);
    
    if (workoutIndex === -1) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workouts.splice(workoutIndex, 1);

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });

  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Server error deleting workout' });
  }
});

module.exports = router;
