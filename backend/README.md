# MuscleUp Backend

A robust Node.js/Express backend API for the MuscleUp fitness tracking application with user authentication, workout logging, and meal tracking.

## Features

- 🔐 **User Authentication** - JWT-based auth with bcrypt password hashing
- 👤 **User Management** - Profile management, preferences, and dashboard
- 💪 **Workout Tracking** - Log workouts, create templates, track progress
- 🍽️ **Meal Tracking** - Log meals, track nutrition, daily summaries
- 📊 **Analytics** - User statistics, progress tracking, and insights
- 🛡️ **Security** - Rate limiting, input validation, CORS protection
- 🗄️ **Database** - MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd /Users/matthewwoods/MuscleUp/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy the `.env` file and update with your values:
   ```bash
   cp .env .env.local
   ```

4. **Install and start MongoDB**:
   ```bash
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/muscleup

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# API Keys (Optional - for future API integrations)
USDA_API_KEY=your-usda-api-key
RAPIDAPI_KEY=your-rapidapi-key
EDAMAM_APP_ID=your-edamam-app-id
EDAMAM_APP_KEY=your-edamam-app-key
SPOONACULAR_API_KEY=your-spoonacular-key
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile
- `POST /verify-token` - Verify JWT token
- `POST /change-password` - Change user password

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /dashboard` - Get dashboard data
- `GET /stats` - Get user statistics
- `DELETE /account` - Deactivate account

### Workouts (`/api/workouts`)
- `GET /` - Get user workouts (paginated)
- `POST /` - Create new workout
- `GET /:id` - Get specific workout
- `PUT /:id` - Update workout
- `DELETE /:id` - Delete workout
- `GET /templates/list` - Get workout templates
- `POST /:id/template` - Save workout as template
- `POST /from-template/:templateId` - Create workout from template

### Meals (`/api/meals`)
- `GET /` - Get user meals (paginated)
- `POST /` - Create new meal
- `GET /:id` - Get specific meal
- `PUT /:id` - Update meal
- `DELETE /:id` - Delete meal
- `GET /daily/:date` - Get all meals for specific date
- `GET /nutrition/summary` - Get nutrition summary

## Data Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  dateOfBirth: Date,
  gender: String,
  height: Number, // cm
  weight: Number, // kg
  activityLevel: String,
  fitnessGoals: [String],
  preferences: Object,
  // ... more fields
}
```

### Workout Model
```javascript
{
  user: ObjectId,
  name: String,
  date: Date,
  duration: Number, // minutes
  exercises: [{
    name: String,
    bodyPart: String,
    target: String,
    equipment: String,
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      distance: Number,
      restTime: Number,
      notes: String
    }]
  }],
  caloriesBurned: Number,
  notes: String,
  mood: String,
  intensity: String,
  tags: [String],
  isTemplate: Boolean,
  templateName: String
}
```

### Meal Model
```javascript
{
  user: ObjectId,
  date: Date,
  mealType: String, // breakfast, lunch, dinner, snack
  foods: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    macros: {
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number
    },
    fdcId: String,
    source: String
  }],
  totalCalories: Number,
  totalMacros: Object,
  notes: String,
  moodAfterMeal: String,
  tags: [String]
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Error Handling

All API responses follow a consistent format:

```javascript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- MongoDB injection protection

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media authentication
- [ ] File upload for profile pictures
- [ ] Push notifications
- [ ] Advanced analytics and reporting
- [ ] Social features (friends, sharing)
- [ ] Integration with fitness trackers

## Health Check

Visit `http://localhost:5000/api/health` to check if the API is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the ISC License.
