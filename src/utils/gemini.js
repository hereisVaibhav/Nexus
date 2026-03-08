import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.trim() : "";
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME || "gemma-3-27b-it";

if (API_KEY) {
  console.log("Gemini API Key Debug:");
  console.log("- Status: Loaded");
  console.log("- Length:", API_KEY.length);
  console.log("- Prefix:", API_KEY.substring(0, 7) + "...");
  console.log("- Suffix: ..." + API_KEY.slice(-5));
} else {
  console.warn("Gemini API Key Status: MISSING");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateWorkout = async (workoutDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const { level, type, duration, equipment, goal } = workoutDetails;

    const equipmentStr = equipment ? `Strictly use only this equipment: ${equipment}.` : 'Bodyweight only (No Equipment).';
    const goalStr = goal ? `Training Goal: ${goal}. Adjust sets, reps, and rest times strictly for this physiological goal.` : 'Standard balanced fitness goal.';

    const prompt = `Generate a structured ${type} workout for a ${level} level. It should take approximately ${duration}. 
        
        PREMIUM CONSTRAINTS:
        - ${equipmentStr}
        - ${goalStr}

        Return the response in JSON format with the following keys:
        - title: String (catchy title)
        - category: String (Workout)
        - instructions: String (short summary)
        - duration: String (e.g. "10 min")
        - fullSteps: String (detailed step-by-step instructions separated by full stops)
        - benefit: String (one concise sentence about the physical or mental benefit of this workout).
        Ensure the JSON is valid and only return the JSON block.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Error generating workout:", error);
    if (error.status === 429) {
      console.error("Quota exceeded for Gemini API. Please try again later.");
    }
    throw error;
  }
};

export const generateBreathing = async (mood) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Generate a breathing technique for someone feeling ${mood}.
        Return the response in JSON format with the following keys:
        - title: String (catchy name)
        - category: String (Breathing)
        - instructions: String (short summary)
        - duration: String (e.g. "5 min")
        - fullSteps: String (detailed step-by-step instructions separated by full stops)
        - benefit: String (one concise sentence explaining how this technique helps the user).
        Ensure the JSON is valid and only return the JSON block.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Error generating breathing session:", error);
    throw error;
  }
};

export const generateMeal = async (diet, calories, style, ingredients) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Generate a ${style} ${diet} meal recipe roughly ${calories} calories. 
        Available ingredients: ${ingredients || "any"}.
        Return the response in JSON format with the following keys:
        - title: String (catchy name)
        - category: String (Meal)
        - ingredients: String (comma separated list)
        - instructions: String (short summary)
        - recipe: String (detailed step-by-step cooking instructions separated by full stops)
        - benefit: String (one concise sentence about the nutritional or energy benefit of this meal).
        Ensure the JSON is valid and only return the JSON block.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Error generating meal:", error);
    throw error;
  }
};


export const generateDailyRoutineAI = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Generate a personalized daily wellness routine consisting of exactly one workout, one breathing session, and one healthy meal.
        Return the response in JSON format with the following structure:
        {
          "workout": {
            "title": "String",
            "category": "Workout",
            "instructions": "String (short summary)",
            "duration": "String (e.g. 10 min)",
            "fullSteps": "String (detailed steps separated by full stops)",
            "benefit": "String"
          },
          "breathing": {
            "title": "String",
            "category": "Breathing",
            "instructions": "String (short summary)",
            "duration": "String (e.g. 5 min)",
            "fullSteps": "String (detailed steps separated by full stops)",
            "benefit": "String"
          },
          "meal": {
            "title": "String",
            "category": "Meal",
            "ingredients": "String (comma separated)",
            "instructions": "String (short summary)",
            "recipe": "String (detailed steps separated by full stops)",
            "benefit": "String"
          }
        }
        Ensure the JSON is valid and only return the JSON block.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Error generating daily routine AI:", error);
    throw error;
  }
};

export const getPersistentDailyRoutine = async () => {
  const today = new Date().toDateString();
  const CACHE_KEY = "nexus_daily_routine";

  try {
    const cachedContent = localStorage.getItem(CACHE_KEY);
    if (cachedContent) {
      const parsed = JSON.parse(cachedContent);
      if (parsed.date === today) {
        console.log("Loading daily routine from cache:", today);
        return parsed.data;
      }
    }

    console.log("Generating new daily routine for:", today);
    const newData = await generateDailyRoutineAI();
    const cacheObj = {
      date: today,
      data: newData
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
    return newData;
  } catch (error) {
    console.error("Error in getPersistentDailyRoutine:", error);
    // Fallback to fresh generation if cache fails
    return await generateDailyRoutineAI();
  }
};

export const generateWeeklyPlan = async (goal, duration = 7, durationType = 'days') => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const daysToGenerate = durationType === 'weeks' ? duration * 7 : (durationType === 'months' ? duration * 30 : duration);

    const prompt = `Generate a detailed ${daysToGenerate}-day wellness plan for a goal of "${goal}".
        Return the response as a valid JSON object with a single key "days" which is an array of objects. 
        
        CRITICAL: All detailed steps MUST be in arrays ("exercises", "recipe", "guide"). Do NOT use "instructions" or "summary" fields.
        
        Each item in the "days" array must have:
        - "day": Integer (1 to ${daysToGenerate})
        - "focus": String (Short daily focus/theme)
        - "workout": { 
            "title": String, 
            "duration": String (IMPORTANT: Keep workout durations short, between 20-30 mins. e.g., "20 mins", "25 mins", "30 mins"), 
            "exercises": Array of Strings (CRITICAL: List 4-6 distinct items. Each item must be a specific exercise operation, e.g., "Squats: 3 sets of 12 reps. Keep back straight..."),
            "warmup": String 
          }
        - "meal": { 
            "title": String, 
            "calories": String, 
            "ingredients": Array of Strings (List of ingredients with quantities),
            "recipe": Array of Strings (Step-by-step cooking instructions. Each string is one step.) 
          }
        - "breathing": { 
            "title": String, 
            "duration": String, 
            "guide": Array of Strings (Step-by-step breathing instructions. Each string is one step.) 
          }
        
        Example structure:
        {
          "days": [
            { 
              "day": 1, 
              "focus": "Leg Day Strength",
              "workout": { 
                "title": "Squats & Lunges", 
                "duration": "25 mins", 
                "warmup": "5 mins dynamic stretching",
                "exercises": [
                   "Squats: 3x12. Stand feet shoulder-width apart, lower hips back and down, keeping chest up.",
                   "Lunges: 3x10 per leg. Step forward, lowering hips until both knees are at 90 degrees.",
                   "Calf Raises: 3x15. Stand on edge of step, raise heels up and down."
                ]
              },
              "meal": { 
                "title": "Grilled Chicken Salad", 
                "calories": "500 kcal", 
                "ingredients": ["1 Chicken Breast", "2 cups Mixed Greens"],
                "recipe": ["1. Season chicken with herbs.", "2. Grill for 6-8 mins per side.", "3. Toss greens with dressing."]
              },
              "breathing": { 
                "title": "Box Breathing", 
                "duration": "5 mins", 
                "guide": ["1. Inhale for 4 seconds.", "2. Hold for 4 seconds.", "3. Exhale for 4 seconds.", "4. Hold for 4 seconds."]
              }
            }
          ]
        }

        Ensure the JSON is valid and only return the JSON block. Do not use Markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonBlock = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonBlock);
  } catch (error) {
    console.error("Error generating weekly plan:", error);
    throw error;
  }
};

export const generateDietPlan = async (userDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const {
      age, height, weight, gender, activity, goal, dietType, duration,
      macros, allergies, schedule, budget
    } = userDetails;

    const daysCount = duration === 'Monthly' ? 30 : 7;

    // Build conditional premium prompt sections
    const macroStr = macros ? `Strictly use this Macro Split: ${macros}` : 'Use standard macro distribution for the goal.';
    const allergyStr = allergies ? `Strictly EXCLUDE these ingredients/conditions: ${allergies}` : 'No specific allergies.';
    const scheduleStr = schedule ? `Meal Schedule: ${schedule}. Adjust meals to fit this specific frequency/fasting pattern.` : 'Standard 3 meals a day (Breakfast, Lunch, Dinner).';
    const budgetStr = budget ? `Budget Constraint: ${budget}. Deliberately select ingredients that fit this pricing tier.` : 'Standard ingredient budget.';

    const prompt = `Generate a personalized ${daysCount}-day diet plan for a ${age} year old ${gender}, weighing ${weight}kg, height ${height}cm.
        Activity Level: ${activity}.
        Goal: ${goal}.
        Dietary Preference: ${dietType}.
        Duration: ${daysCount} days.
        
        PREMIUM CONSTRAINTS:
        - ${macroStr}
        - ${allergyStr}
        - ${scheduleStr}
        - ${budgetStr}

        Return the response as a valid JSON object with the following structure:
        {
          "calories": "Number (Daily Calorie Target)",
          "macros": {
            "protein": "String (e.g. 150g)",
            "carbs": "String (e.g. 200g)",
            "fats": "String (e.g. 60g)"
          },
          "days": [
            {
              "day": Number,
              "meals": [
                {
                  "type": "Breakfast",
                  "suggestion": "String",
                  "calories": "String",
                  "ingredients": "String",
                  "instructions": "String"
                },
                {
                  "type": "Lunch",
                  "suggestion": "String",
                  "calories": "String",
                  "ingredients": "String",
                  "instructions": "String"
                },
                {
                  "type": "Dinner",
                  "suggestion": "String",
                  "calories": "String",
                  "ingredients": "String",
                  "instructions": "String"
                }
              ]
            }
          ],
          "tips": ["String", "String"]
        }
        
        CRITICAL: Generate ${daysCount} unique days. For a Monthly plan, ensure variety across the 30 days.
        Ensure the JSON is valid and only return the JSON block. Do not use Markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonBlock = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonBlock);
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw error;
  }
};

export const generateAlternativeMeal = async (mealType, calories, dietType, currentIngredients) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Generate a new ${mealType} recipe for a ${dietType} diet that is approximately ${calories}.
        It should be a completely different meal from one containing: ${currentIngredients}.
        
        Return the response as a valid JSON object with the following structure:
        {
          "type": "${mealType}",
          "suggestion": "String (Name of the dish)",
          "calories": "${calories}",
          "ingredients": "String (Comma separated list with quantities)",
          "instructions": "String (Step-by-step cooking instructions)"
        }
        
        CRITICAL: Ensure the JSON is valid and only return the JSON block. Do not use Markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonBlock = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonBlock);
  } catch (error) {
    console.error("Error generating alternative meal:", error);
    throw error;
  }
};


