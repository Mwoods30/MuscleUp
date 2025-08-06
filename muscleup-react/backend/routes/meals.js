const express = require('express');
const router = express.Router();

// In-memory storage for meals (replace with MongoDB later)
let meals = [];
let mealIdCounter = 1;

// Get all meals for a user
router.get('/', (req, res) => {
  const userId = req.user?.id;
  const userMeals = meals.filter(m => m.userId === userId);
  
  res.json({
    success: true,
    data: {
      meals: userMeals
    }
  });
});

// Get meals for a specific date
router.get('/date/:date', (req, res) => {
  const userId = req.user?.id;
  const targetDate = req.params.date;
  
  const dateMeals = meals.filter(m => 
    m.userId === userId && 
    m.date.toISOString().split('T')[0] === targetDate
  );
  
  res.json({
    success: true,
    meals: dateMeals
  });
});

// Get daily meals (for dashboard)
router.get('/daily/:date', (req, res) => {
  const userId = req.user?.id;
  const targetDate = req.params.date;
  
  const dateMeals = meals.filter(m => {
    if (m.userId !== userId) return false;
    
    // Handle both string dates and Date objects
    const mealDate = typeof m.date === 'string' ? m.date : m.date.toISOString().split('T')[0];
    return mealDate === targetDate;
  });
  
  res.json({
    success: true,
    data: {
      meals: dateMeals
    }
  });
});

// Get a specific meal
router.get('/:id', (req, res) => {
  const mealId = parseInt(req.params.id);
  const userId = req.user?.id;
  
  const meal = meals.find(m => m.id === mealId && m.userId === userId);
  
  if (!meal) {
    return res.status(404).json({ message: 'Meal not found' });
  }
  
  res.json({
    success: true,
    meal
  });
});

// Create a new meal
router.post('/', (req, res) => {
  try {
    const { name, foods, calories, protein, carbs, fat, date, mealType } = req.body;
    const userId = req.user?.id;

    if (!name || !foods) {
      return res.status(400).json({ message: 'Please provide meal name and foods' });
    }

    const meal = {
      id: mealIdCounter++,
      userId,
      name,
      foods: foods || [],
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      date: new Date(date) || new Date(),
      mealType: mealType || 'other', // breakfast, lunch, dinner, snack, other
      createdAt: new Date()
    };

    meals.push(meal);

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      meal
    });

  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ message: 'Server error logging meal' });
  }
});

// Update a meal
router.put('/:id', (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { name, foods, calories, protein, carbs, fat, date, mealType } = req.body;

    const mealIndex = meals.findIndex(m => m.id === mealId && m.userId === userId);
    
    if (mealIndex === -1) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update meal
    meals[mealIndex] = {
      ...meals[mealIndex],
      name: name || meals[mealIndex].name,
      foods: foods || meals[mealIndex].foods,
      calories: calories !== undefined ? calories : meals[mealIndex].calories,
      protein: protein !== undefined ? protein : meals[mealIndex].protein,
      carbs: carbs !== undefined ? carbs : meals[mealIndex].carbs,
      fat: fat !== undefined ? fat : meals[mealIndex].fat,
      date: date ? new Date(date) : meals[mealIndex].date,
      mealType: mealType || meals[mealIndex].mealType,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Meal updated successfully',
      meal: meals[mealIndex]
    });

  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ message: 'Server error updating meal' });
  }
});

// Delete a meal
router.delete('/:id', (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    const userId = req.user?.id;

    const mealIndex = meals.findIndex(m => m.id === mealId && m.userId === userId);
    
    if (mealIndex === -1) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    meals.splice(mealIndex, 1);

    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });

  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ message: 'Server error deleting meal' });
  }
});

// Get nutrition summary for a date range
router.get('/nutrition/summary', (req, res) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;
    
    let filteredMeals = meals.filter(m => m.userId === userId);
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredMeals = filteredMeals.filter(m => {
        const mealDate = new Date(m.date);
        return mealDate >= start && mealDate <= end;
      });
    }
    
    const summary = filteredMeals.reduce((acc, meal) => {
      acc.totalCalories += meal.calories || 0;
      acc.totalProtein += meal.protein || 0;
      acc.totalCarbs += meal.carbs || 0;
      acc.totalFat += meal.fat || 0;
      acc.mealCount += 1;
      return acc;
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealCount: 0
    });
    
    res.json({
      success: true,
      summary,
      period: { startDate, endDate }
    });
    
  } catch (error) {
    console.error('Nutrition summary error:', error);
    res.status(500).json({ message: 'Server error getting nutrition summary' });
  }
});

module.exports = router;
