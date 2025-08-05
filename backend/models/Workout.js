const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
    maxlength: [100, 'Workout name cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: false,
    min: [1, 'Duration must be at least 1 minute'],
    max: [600, 'Duration cannot exceed 600 minutes']
  },
  exercises: [{
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true
    },
    bodyPart: {
      type: String,
      required: false
    },
    target: {
      type: String,
      required: false
    },
    equipment: {
      type: String,
      required: false
    },
    sets: [{
      reps: {
        type: Number,
        required: false,
        min: [1, 'Reps must be at least 1']
      },
      weight: {
        type: Number,
        required: false,
        min: [0, 'Weight cannot be negative']
      },
      duration: {
        type: Number, // in seconds for time-based exercises
        required: false,
        min: [1, 'Duration must be at least 1 second']
      },
      distance: {
        type: Number, // in meters
        required: false,
        min: [0, 'Distance cannot be negative']
      },
      restTime: {
        type: Number, // in seconds
        required: false,
        min: [0, 'Rest time cannot be negative']
      },
      notes: {
        type: String,
        maxlength: [200, 'Notes cannot exceed 200 characters']
      }
    }],
    notes: {
      type: String,
      maxlength: [500, 'Exercise notes cannot exceed 500 characters']
    }
  }],
  caloriesBurned: {
    type: Number,
    required: false,
    min: [0, 'Calories burned cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Workout notes cannot exceed 1000 characters']
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    required: false
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very-high'],
    required: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String,
    required: function() { return this.isTemplate; },
    maxlength: [100, 'Template name cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total sets
workoutSchema.virtual('totalSets').get(function() {
  return this.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
});

// Virtual for total volume (weight * reps)
workoutSchema.virtual('totalVolume').get(function() {
  return this.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + ((set.weight || 0) * (set.reps || 0));
    }, 0);
  }, 0);
});

// Index for faster queries
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, isTemplate: 1 });
workoutSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
