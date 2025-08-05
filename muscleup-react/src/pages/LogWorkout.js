import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './LogWorkout.css';

const LogWorkout = () => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState({
    name: '',
    exercises: [],
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    const exercise = {
      id: Date.now(),
      name: currentExercise.name.trim(),
      sets: parseInt(currentExercise.sets) || 0,
      reps: parseInt(currentExercise.reps) || 0,
      weight: parseFloat(currentExercise.weight) || 0,
      duration: parseInt(currentExercise.duration) || 0
    };

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));

    // Reset current exercise form
    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      duration: ''
    });
  };

  const removeExercise = (exerciseId) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workout.name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (workout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const workoutData = {
        name: workout.name.trim(),
        exercises: workout.exercises,
        duration: parseInt(workout.duration) || 0,
        date: workout.date,
        notes: workout.notes.trim()
      };

      await axios.post('/api/workouts', workoutData);
      
      setSuccess(true);
      
      // Reset form
      setWorkout({
        name: '',
        exercises: [],
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutSummary = () => {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
    const totalReps = workout.exercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);
    const totalWeight = workout.exercises.reduce((sum, ex) => sum + (ex.weight || 0), 0);
    
    return { totalSets, totalReps, totalWeight };
  };

  const { totalSets, totalReps, totalWeight } = getWorkoutSummary();

  return (
    <div className="log-workout">
      <div className="workout-header">
        <h1>💪 Log Workout</h1>
        <p>Track your training session</p>
      </div>

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Workout logged successfully!
        </div>
      )}

      <div className="workout-container">
        <form onSubmit={handleSubmit} className="workout-form">
          {/* Workout Basic Info */}
          <div className="form-section">
            <h2>Workout Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Workout Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={workout.name}
                  onChange={handleWorkoutChange}
                  placeholder="e.g., Push Day, Morning Run"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={workout.date}
                  onChange={handleWorkoutChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={workout.duration}
                  onChange={handleWorkoutChange}
                  placeholder="60"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Add Exercise */}
          <div className="form-section">
            <h2>Add Exercise</h2>
            <div className="exercise-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exerciseName">Exercise Name *</label>
                  <input
                    type="text"
                    id="exerciseName"
                    name="name"
                    value={currentExercise.name}
                    onChange={handleExerciseChange}
                    placeholder="e.g., Bench Press, Squats"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sets">Sets</label>
                  <input
                    type="number"
                    id="sets"
                    name="sets"
                    value={currentExercise.sets}
                    onChange={handleExerciseChange}
                    placeholder="3"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reps">Reps</label>
                  <input
                    type="number"
                    id="reps"
                    name="reps"
                    value={currentExercise.reps}
                    onChange={handleExerciseChange}
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight (lbs)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={currentExercise.weight}
                    onChange={handleExerciseChange}
                    placeholder="135"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exerciseDuration">Duration (min)</label>
                  <input
                    type="number"
                    id="exerciseDuration"
                    name="duration"
                    value={currentExercise.duration}
                    onChange={handleExerciseChange}
                    placeholder="For cardio"
                    min="1"
                  />
                </div>
              </div>
              <button type="button" onClick={addExercise} className="add-exercise-btn">
                Add Exercise
              </button>
            </div>
          </div>

          {/* Exercise List */}
          {workout.exercises.length > 0 && (
            <div className="form-section">
              <h2>Exercises ({workout.exercises.length})</h2>
              <div className="exercises-list">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="exercise-item">
                    <div className="exercise-info">
                      <h3>{exercise.name}</h3>
                      <div className="exercise-details">
                        {exercise.sets > 0 && <span>{exercise.sets} sets</span>}
                        {exercise.reps > 0 && <span>{exercise.reps} reps</span>}
                        {exercise.weight > 0 && <span>{exercise.weight} lbs</span>}
                        {exercise.duration > 0 && <span>{exercise.duration} min</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      className="remove-exercise-btn"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workout Summary */}
          {workout.exercises.length > 0 && (
            <div className="form-section">
              <h2>Workout Summary</h2>
              <div className="workout-summary">
                <div className="summary-item">
                  <span className="summary-number">{totalSets}</span>
                  <span className="summary-label">Total Sets</span>
                </div>
                <div className="summary-item">
                  <span className="summary-number">{totalReps}</span>
                  <span className="summary-label">Total Reps</span>
                </div>
                <div className="summary-item">
                  <span className="summary-number">{totalWeight.toFixed(1)}</span>
                  <span className="summary-label">Total Weight (lbs)</span>
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
              value={workout.notes}
              onChange={handleWorkoutChange}
              placeholder="How did the workout feel? Any observations..."
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-workout-btn" disabled={loading}>
            {loading ? 'Logging Workout...' : 'Log Workout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWorkout;
