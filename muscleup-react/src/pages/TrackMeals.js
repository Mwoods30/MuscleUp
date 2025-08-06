import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './TrackMeals.css';

const TrackMeals = () => {
  const { user } = useAuth(); // eslint-disable-line no-unused-vars
  const [meal, setMeal] = useState({
    mealType: 'breakfast',
    foods: [],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [currentFood, setCurrentFood] = useState({
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '🌞' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍿' }
  ];

  const handleMealChange = (e) => {
    const { name, value } = e.target;
    setMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setCurrentFood(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFood = () => {
    if (!currentFood.name.trim()) {
      alert('Please enter a food name');
      return;
    }

    const food = {
      id: Date.now(),
      name: currentFood.name.trim(),
      quantity: parseFloat(currentFood.quantity) || 1,
      calories: parseFloat(currentFood.calories) || 0,
      protein: parseFloat(currentFood.protein) || 0,
      carbs: parseFloat(currentFood.carbs) || 0,
      fat: parseFloat(currentFood.fat) || 0
    };

    setMeal(prev => ({
      ...prev,
      foods: [...prev.foods, food]
    }));

    // Reset current food form
    setCurrentFood({
      name: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
  };

  const removeFood = (foodId) => {
    setMeal(prev => ({
      ...prev,
      foods: prev.foods.filter(food => food.id !== foodId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (meal.foods.length === 0) {
      alert('Please add at least one food item');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Calculate totals
      const totals = meal.foods.reduce((acc, food) => ({
        calories: acc.calories + (food.calories * food.quantity),
        protein: acc.protein + (food.protein * food.quantity),
        carbs: acc.carbs + (food.carbs * food.quantity),
        fat: acc.fat + (food.fat * food.quantity)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      const mealData = {
        mealType: meal.mealType,
        foods: meal.foods,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        date: meal.date,
        notes: meal.notes.trim()
      };

      await axios.post('/api/meals', mealData);
      
      setSuccess(true);
      
      // Reset form
      setMeal({
        mealType: 'breakfast',
        foods: [],
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error logging meal:', error);
      alert('Failed to log meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMealTotals = () => {
    return meal.foods.reduce((acc, food) => ({
      calories: acc.calories + (food.calories * food.quantity),
      protein: acc.protein + (food.protein * food.quantity),
      carbs: acc.carbs + (food.carbs * food.quantity),
      fat: acc.fat + (food.fat * food.quantity)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = getMealTotals();

  return (
    <div className="track-meals">
      <div className="meals-header">
        <h1>🍽️ Track Meals</h1>
        <p>Log your nutrition and stay on track</p>
      </div>

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Meal logged successfully!
        </div>
      )}

      <div className="meals-container">
        <form onSubmit={handleSubmit} className="meals-form">
          {/* Meal Type and Date */}
          <div className="form-section">
            <h2>Meal Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mealType">Meal Type</label>
                <select
                  id="mealType"
                  name="mealType"
                  value={meal.mealType}
                  onChange={handleMealChange}
                  className="meal-type-select"
                >
                  {mealTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={meal.date}
                  onChange={handleMealChange}
                />
              </div>
            </div>
          </div>

          {/* Add Food */}
          <div className="form-section">
            <h2>Add Food Item</h2>
            <div className="food-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="foodName">Food Name *</label>
                  <input
                    type="text"
                    id="foodName"
                    name="name"
                    value={currentFood.name}
                    onChange={handleFoodChange}
                    placeholder="e.g., Chicken Breast, Apple"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={currentFood.quantity}
                    onChange={handleFoodChange}
                    placeholder="1"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calories">Calories</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={currentFood.calories}
                    onChange={handleFoodChange}
                    placeholder="250"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="protein">Protein (g)</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={currentFood.protein}
                    onChange={handleFoodChange}
                    placeholder="25"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carbs">Carbs (g)</label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={currentFood.carbs}
                    onChange={handleFoodChange}
                    placeholder="30"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fat">Fat (g)</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={currentFood.fat}
                    onChange={handleFoodChange}
                    placeholder="10"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              <button type="button" onClick={addFood} className="add-food-btn">
                Add Food Item
              </button>
            </div>
          </div>

          {/* Food List */}
          {meal.foods.length > 0 && (
            <div className="form-section">
              <h2>Food Items ({meal.foods.length})</h2>
              <div className="foods-list">
                {meal.foods.map((food) => (
                  <div key={food.id} className="food-item">
                    <div className="food-info">
                      <h3>{food.name}</h3>
                      <div className="food-details">
                        <span>Qty: {food.quantity}</span>
                        <span>{(food.calories * food.quantity).toFixed(0)} cal</span>
                        <span>P: {(food.protein * food.quantity).toFixed(1)}g</span>
                        <span>C: {(food.carbs * food.quantity).toFixed(1)}g</span>
                        <span>F: {(food.fat * food.quantity).toFixed(1)}g</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFood(food.id)}
                      className="remove-food-btn"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Summary */}
          {meal.foods.length > 0 && (
            <div className="form-section">
              <h2>Nutrition Summary</h2>
              <div className="nutrition-summary">
                <div className="nutrition-item">
                  <span className="nutrition-number">{totals.calories.toFixed(0)}</span>
                  <span className="nutrition-label">Calories</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-number">{totals.protein.toFixed(1)}g</span>
                  <span className="nutrition-label">Protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-number">{totals.carbs.toFixed(1)}g</span>
                  <span className="nutrition-label">Carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-number">{totals.fat.toFixed(1)}g</span>
                  <span className="nutrition-label">Fat</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="form-section">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={meal.notes}
              onChange={handleMealChange}
              placeholder="Any additional notes about this meal..."
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-meal-btn" disabled={loading}>
            {loading ? 'Logging Meal...' : 'Log Meal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackMeals;
