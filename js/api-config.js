// API Configuration for MuscleUp App
// Replace with your actual API keys

const API_CONFIG = {
    // USDA Food Data Central API
    usda: {
        baseUrl: 'https://api.nal.usda.gov/fdc/v1',
        apiKey: 'DEMO_KEY', // Get your free key at: https://fdc.nal.usda.gov/api-guide.html
        endpoints: {
            search: '/foods/search',
            details: '/food'
        }
    },
    
    // ExerciseDB API (via RapidAPI)
    exerciseDb: {
        baseUrl: 'https://exercisedb.p.rapidapi.com',
        apiKey: '32839774cbmsh556498079ea2029p1fa34fjsn90f01b9d9b78', // Get your free key at: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
        headers: {
            'X-RapidAPI-Key': '32839774cbmsh556498079ea2029p1fa34fjsn90f01b9d9b78',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        endpoints: {
            search: '/exercises/name',
            bodyPart: '/exercises/bodyPart',
            equipment: '/exercises/equipment',
            target: '/exercises/target'
        }
    },
    
    // Alternative: Edamam Food API
    edamam: {
        baseUrl: 'https://api.edamam.com/api/food-database/v2',
        appId: 'YOUR_EDAMAM_APP_ID', // Get free access at: https://developer.edamam.com/
        appKey: 'YOUR_EDAMAM_APP_KEY'
    },
    
    // Alternative: Spoonacular API
    spoonacular: {
        baseUrl: 'https://api.spoonacular.com',
        apiKey: 'YOUR_SPOONACULAR_KEY' // Get free access at: https://spoonacular.com/food-api
    }
};

// Helper function to make API requests
async function makeAPIRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Food search using USDA API
async function searchFoodUSDA(query, pageSize = 10) {
    const url = `${API_CONFIG.usda.baseUrl}${API_CONFIG.usda.endpoints.search}?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${API_CONFIG.usda.apiKey}`;
    
    try {
        const data = await makeAPIRequest(url);
        return data.foods?.map(food => ({
            name: food.description,
            calories: food.foodNutrients?.find(n => n.nutrientId === 1008)?.value || 0,
            protein: food.foodNutrients?.find(n => n.nutrientId === 1003)?.value || 0,
            carbs: food.foodNutrients?.find(n => n.nutrientId === 1005)?.value || 0,
            fat: food.foodNutrients?.find(n => n.nutrientId === 1004)?.value || 0,
            fdcId: food.fdcId,
            source: 'USDA'
        })) || [];
    } catch (error) {
        console.error('USDA API Error:', error);
        return [];
    }
}

// Exercise search using ExerciseDB API
async function searchExerciseDB(query) {
    const url = `${API_CONFIG.exerciseDb.baseUrl}${API_CONFIG.exerciseDb.endpoints.search}/${encodeURIComponent(query)}`;
    
    try {
        const data = await makeAPIRequest(url, {
            headers: API_CONFIG.exerciseDb.headers
        });
        
        return data.slice(0, 10).map(exercise => ({
            name: exercise.name,
            bodyPart: exercise.bodyPart,
            target: exercise.target,
            equipment: exercise.equipment,
            instructions: exercise.instructions,
            gifUrl: exercise.gifUrl,
            source: 'ExerciseDB'
        }));
    } catch (error) {
        console.error('ExerciseDB API Error:', error);
        return [];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, makeAPIRequest, searchFoodUSDA, searchExerciseDB };
}
