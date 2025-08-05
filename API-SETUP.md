# MuscleUp - API Integration Guide

## 🚀 Getting Started with APIs

Your MuscleUp fitness app now supports real-time food and exercise data through several APIs. Follow this guide to set up your API keys and start using the enhanced features.

## 🍽️ Food Database APIs

### 1. USDA FoodData Central API (Recommended - FREE)

**What it provides:**
- 900,000+ food items
- Detailed nutritional information
- Completely free to use
- Maintained by US Department of Agriculture

**Setup:**
1. Visit: https://fdc.nal.usda.gov/api-guide.html
2. Click "Get API Key"
3. Fill out the simple form
4. Replace `DEMO_KEY` in `js/api-config.js` with your key

**Benefits:**
- ✅ Free forever
- ✅ No request limits
- ✅ Comprehensive nutrition data
- ✅ Government-maintained accuracy

### 2. Edamam Food Database API (Alternative)

**Setup:**
1. Visit: https://developer.edamam.com/
2. Sign up for free account
3. Get your App ID and App Key
4. Update `js/api-config.js` with your credentials

**Free Tier:** 5,000 requests/month

## 🏋️ Exercise Database APIs

### 1. ExerciseDB API (Recommended)

**What it provides:**
- 1,300+ exercises with detailed instructions
- Body part targeting information
- Equipment requirements
- GIF demonstrations

**Setup:**
1. Visit: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
2. Sign up for RapidAPI account (free)
3. Subscribe to ExerciseDB (free tier available)
4. Copy your RapidAPI key
5. Replace `YOUR_RAPIDAPI_KEY` in `js/api-config.js`

**Free Tier:** 100 requests/day

### 2. Wger API (Alternative - Completely Free)

**Setup:**
1. Visit: https://wger.de/en/software/api
2. No API key required
3. Completely free and open source

## 📁 File Structure

```
MuscleUp/
├── index.html
├── styles.css
├── logo.png
├── js/
│   └── api-config.js      (API configuration)
└── pages/
    ├── log-workout.html   (Enhanced with exercise search)
    ├── log-workout.css
    ├── track-meals.html   (Enhanced with food search)
    ├── track-meals.css
    ├── signin.html
    └── signin.css
```

## 🔧 Implementation Features

### Food Search (Track Meals Page)
- **Real-time search** as you type
- **Debounced API calls** (500ms delay to avoid spam)
- **Nutritional breakdown** (protein, carbs, fats)
- **Fallback system** if API is unavailable
- **Loading indicators** and error handling

### Exercise Search (Log Workout Page)
- **Smart exercise suggestions** based on your input
- **Body part and equipment** information
- **Target muscle groups** displayed
- **Fallback exercise database** for offline use

## 🛠️ Customization Options

### Adding More APIs

You can easily add more APIs by updating `js/api-config.js`:

```javascript
// Add new API configuration
myNewApi: {
    baseUrl: 'https://api.example.com',
    apiKey: 'YOUR_KEY',
    endpoints: {
        search: '/search'
    }
}
```

### Rate Limiting

The current implementation includes:
- **Debouncing** to reduce API calls
- **Request timeout** handling
- **Graceful fallbacks** to local data

## 🎯 Next Steps

1. **Get your API keys** from the services above
2. **Update `js/api-config.js`** with your credentials
3. **Test the search functionality** in your app
4. **Customize the fallback data** with your preferred foods/exercises

## 💡 Pro Tips

- **Start with USDA API** - it's free and comprehensive
- **Use ExerciseDB** for the best exercise database
- **Keep fallback data** for offline functionality
- **Monitor your API usage** to stay within free tiers

## 🔐 Security Note

- Never commit your API keys to public repositories
- Consider using environment variables for production
- The current setup is perfect for development and testing

## 📞 Support

If you need help setting up any of these APIs:
1. Check the API documentation links above
2. Most APIs have excellent support documentation
3. Many offer free developer support

---

**Happy coding! Your MuscleUp app now has access to thousands of foods and exercises! 🚀💪**
