# 💪 MuscleUp - Complete Fitness Tracking Web Application

![MuscleUp Logo](logo.png)

MuscleUp is a comprehensive fitness tracking web application that helps users monitor their workouts, track nutrition, and achieve their fitness goals. Built with modern web technologies and featuring a beautiful glassmorphism design with enhanced authentication.

## 🌟 Features

### 🔐 **Enhanced Authentication**
- **Multiple Sign-In Options**: Email/Password, Google, Facebook, Apple OAuth
- **Demo Mode**: Instant access with demo accounts (Demo User & Admin)
- **Secure Registration**: Email validation and password requirements
- **Modern UI**: Glass-morphism design with improved visibility and contrast
- **Real-time Validation**: Instant feedback on form inputs
- **Auto-redirect**: Seamless navigation after authentication

### 🏋️‍♂️ **Workout Tracking**
- Log exercises with sets, reps, and weights
- Exercise search integration with ExerciseDB API
- Workout history and progress tracking
- Custom workout routines

### 🍎 **Nutrition Tracking**
- Food logging with USDA Food API integration
- Calorie and macronutrient tracking
- Meal planning and history
- Nutritional goal setting

### 👤 **User Management**
- User registration and authentication
- JWT-based secure sessions
- OAuth integration (Google, Facebook, Apple)
- Profile customization with fitness goals

### 📊 **Progress Analytics**
- Visual progress charts and statistics
- BMI calculations and health metrics
- Achievement tracking and milestones
- Personalized recommendations

### 🎨 **Modern UI/UX**
- Enhanced glassmorphism design with better contrast
- White accents for improved visibility
- Smooth animations and hover effects
- Responsive design for all devices
- Mobile-first approach with enhanced touch interactions

## � Quick Start

### Try Demo Mode (Instant Access)
1. Visit the application
2. Click **"👤 Demo User Login"** or **"👑 Demo Admin Login"**
3. Start using MuscleUp immediately!

### OAuth Demo
- Click **"Continue with Google/Facebook/Apple"** for OAuth simulation
- Demo accounts created automatically

### Create Your Account
- Click **"Sign Up"** → Enter details → Start your fitness journey!

## 🛠️ Technology Stack

### Frontend
- **React 19+** - Modern UI library with hooks
- **Styled Components** - CSS-in-JS styling solution
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **FontAwesome** - Comprehensive icon library
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### APIs & Integrations
- **ExerciseDB API** - Exercise database and search
- **USDA Food Data Central API** - Nutrition information
- **Google OAuth 2.0** - Social authentication
- **Facebook Login** - Social authentication
- **Apple Sign-In** - Social authentication

### Security
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Data Validation** - Input sanitization
- **SSL/TLS Encryption** - Secure data transmission

## 📁 Project Structure

```
MuscleUp/
├── 📄 index.html              # Main homepage
├── 🎨 styles.css              # Global styles and components
├── 🖼️ logo.png                # Application logo
├── 📋 OAuth_Setup_Guide.md    # OAuth configuration guide
├── 📁 pages/                  # Application pages
│   ├── 🔐 signin.html         # Authentication page
│   ├── 🏋️ log-workout.html    # Workout logging
│   ├── 🍽️ track-meals.html    # Nutrition tracking
│   ├── 📜 privacy-policy.html # Privacy policy
│   ├── 📋 terms-of-service.html # Terms of service
│   ├── 🎨 signin.css          # Sign-in page styles
│   ├── 🏋️ log-workout.css     # Workout page styles
│   ├── 🍽️ track-meals.css     # Meals page styles
│   └── ⚖️ legal.css           # Legal pages styles
└── 📁 backend/                # Server-side application
    ├── 🚀 server.js           # Main server file
    ├── 📦 package.json        # Dependencies and scripts
    ├── 🔧 .env.example        # Environment variables template
    ├── 📁 models/             # Database models
    │   ├── 👤 User.js         # User model
    │   ├── 🏋️ Workout.js      # Workout model
    │   └── 🍽️ Meal.js         # Meal model
    ├── 📁 routes/             # API routes
    │   ├── 🔐 auth.js         # Authentication routes
    │   ├── 👤 users.js        # User management routes
    │   ├── 🏋️ workouts.js     # Workout routes
    │   ├── 🍽️ meals.js        # Meal routes
    │   └── 🔗 oauth.js        # OAuth routes
    └── 📁 middleware/         # Custom middleware
        ├── 🔐 auth.js         # Authentication middleware
        ├── 🛡️ security.js     # Security middleware
        └── ✅ validation.js   # Input validation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/muscleup.git
   cd muscleup
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Open `index.html` in your browser
   - Or serve it with a local web server for full functionality

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/muscleup
# or use MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/muscleup

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys
EXERCISEDB_API_KEY=your-exercisedb-api-key
USDA_API_KEY=your-usda-api-key

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
APPLE_SERVICE_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🔧 Configuration

### OAuth Setup
Follow the detailed [OAuth Setup Guide](OAuth_Setup_Guide.md) to configure:
- Google OAuth 2.0
- Facebook Login
- Apple Sign-In

### API Keys
1. **ExerciseDB API**: Get your key from [RapidAPI](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. **USDA Food API**: Register at [USDA Food Data Central](https://fdc.nal.usda.gov/api-guide.html)

## 📱 Features Overview

### Authentication System
- ✅ Email/Password registration and login
- ✅ Social login (Google, Facebook, Apple)
- ✅ JWT-based session management
- ✅ Password reset functionality
- ✅ Email verification

### Workout Management
- ✅ Exercise database integration
- ✅ Custom workout creation
- ✅ Set, rep, and weight tracking
- ✅ Workout history and analytics
- ✅ Progress visualization

### Nutrition Tracking
- ✅ Food database integration
- ✅ Calorie and macro tracking
- ✅ Meal planning and logging
- ✅ Nutritional goal setting
- ✅ Progress monitoring

### User Experience
- ✅ Responsive design (mobile-first)
- ✅ Modern glassmorphism UI
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation
- ✅ Accessibility features

## 🛡️ Security Features

- **Authentication**: JWT tokens with secure expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Data Validation**: Input sanitization and validation
- **Rate Limiting**: API endpoint protection
- **CORS Protection**: Configured for secure cross-origin requests
- **Security Headers**: Helmet.js implementation
- **OAuth Security**: Secure third-party authentication

## 📊 Database Models

### User Model
- Personal information and preferences
- Fitness goals and activity levels
- OAuth provider linking
- Security and verification fields

### Workout Model
- Exercise details and parameters
- Workout sessions and history
- Progress tracking data
- User associations

### Meal Model
- Food items and nutritional data
- Meal compositions and timing
- Calorie and macro calculations
- User meal history

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### OAuth
- `POST /api/oauth/auth` - OAuth authentication
- `GET /api/oauth/config` - OAuth configuration
- `DELETE /api/oauth/unlink/:provider` - Unlink OAuth provider

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Meals
- `GET /api/meals` - Get user meals
- `POST /api/meals` - Log new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

## 🎨 Design System

### Color Palette
- **Primary**: Linear gradient (#fa2d2d to #d41872)
- **Background**: Linear gradient (#f5f7fa to #c3cfe2)
- **Glass**: rgba(255, 255, 255, 0.9) with backdrop blur
- **Text**: #333 (primary), #666 (secondary), #999 (muted)

### Typography
- **Primary Font**: Segoe UI, Helvetica, Arial, sans-serif
- **Headings**: Font weights 600-700 with gradient text
- **Body**: Font weight 400-500 with proper line height
- **Responsive**: clamp() functions for fluid typography

### Components
- **Glassmorphism Cards**: Translucent backgrounds with blur effects
- **Gradient Buttons**: Interactive with hover animations
- **Modern Forms**: Clean inputs with floating labels
- **Responsive Navigation**: Mobile hamburger with smooth transitions

## 📄 Legal Pages

- **Privacy Policy**: Comprehensive data protection and user rights
- **Terms of Service**: Service usage terms and legal disclaimers
- **Health Disclaimers**: Important fitness and health-related notices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ExerciseDB API** for comprehensive exercise database
- **USDA Food Data Central** for nutritional information
- **Font Awesome** for beautiful icons
- **MongoDB** for flexible data storage
- **Express.js** for robust web framework

## 📞 Support

For support, email support@muscleup.com or create an issue in this repository.

## 🔄 Changelog

### Version 1.0.0 (August 2025)
- ✅ Initial release with full functionality
- ✅ Complete authentication system
- ✅ Workout and nutrition tracking
- ✅ OAuth integration
- ✅ Responsive design implementation
- ✅ Legal pages and privacy compliance

---

**Made with ❤️ for fitness enthusiasts everywhere!**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-v14+-blue)
![MongoDB](https://img.shields.io/badge/mongodb-v4+-green)
