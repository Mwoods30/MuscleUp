const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: [true, 'Meal type is required']
  },
  foods: [{
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.1, 'Quantity must be at least 0.1']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['g', 'kg', 'oz', 'lb', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'serving']
    },
    calories: {
      type: Number,
      required: false,
      min: [0, 'Calories cannot be negative']
    },
    macros: {
      protein: {
        type: Number,
        required: false,
        min: [0, 'Protein cannot be negative']
      },
      carbohydrates: {
        type: Number,
        required: false,
        min: [0, 'Carbohydrates cannot be negative']
      },
      fat: {
        type: Number,
        required: false,
        min: [0, 'Fat cannot be negative']
      },
      fiber: {
        type: Number,
        required: false,
        min: [0, 'Fiber cannot be negative']
      },
      sugar: {
        type: Number,
        required: false,
        min: [0, 'Sugar cannot be negative']
      },
      sodium: {
        type: Number,
        required: false,
        min: [0, 'Sodium cannot be negative']
      }
    },
    fdcId: {
      type: String,
      required: false // For USDA database reference
    },
    source: {
      type: String,
      enum: ['USDA', 'Edamam', 'Spoonacular', 'manual'],
      default: 'manual'
    }
  }],
  totalCalories: {
    type: Number,
    required: false,
    min: [0, 'Total calories cannot be negative']
  },
  totalMacros: {
    protein: {
      type: Number,
      required: false,
      min: [0, 'Total protein cannot be negative']
    },
    carbohydrates: {
      type: Number,
      required: false,
      min: [0, 'Total carbohydrates cannot be negative']
    },
    fat: {
      type: Number,
      required: false,
      min: [0, 'Total fat cannot be negative']
    },
    fiber: {
      type: Number,
      required: false,
      min: [0, 'Total fiber cannot be negative']
    },
    sugar: {
      type: Number,
      required: false,
      min: [0, 'Total sugar cannot be negative']
    },
    sodium: {
      type: Number,
      required: false,
      min: [0, 'Total sodium cannot be negative']
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  moodAfterMeal: {
    type: String,
    enum: ['energized', 'satisfied', 'sleepy', 'bloated', 'nauseous', 'normal'],
    required: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to calculate totals
mealSchema.pre('save', function(next) {
  // Calculate total calories and macros
  this.totalCalories = this.foods.reduce((total, food) => total + (food.calories || 0), 0);
  
  this.totalMacros = {
    protein: this.foods.reduce((total, food) => total + (food.macros?.protein || 0), 0),
    carbohydrates: this.foods.reduce((total, food) => total + (food.macros?.carbohydrates || 0), 0),
    fat: this.foods.reduce((total, food) => total + (food.macros?.fat || 0), 0),
    fiber: this.foods.reduce((total, food) => total + (food.macros?.fiber || 0), 0),
    sugar: this.foods.reduce((total, food) => total + (food.macros?.sugar || 0), 0),
    sodium: this.foods.reduce((total, food) => total + (food.macros?.sodium || 0), 0)
  };
  
  next();
});

// Virtual for food count
mealSchema.virtual('foodCount').get(function() {
  return this.foods.length;
});

// Index for faster queries
mealSchema.index({ user: 1, date: -1, mealType: 1 });
mealSchema.index({ user: 1, date: -1 });
mealSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Meal', mealSchema);
