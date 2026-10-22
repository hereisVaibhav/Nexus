import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.trim() : "";
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME || "gemini-2.0-flash";

if (API_KEY) {
  console.log("Gemini API Key Debug:");
  console.log("- Status: Loaded");
  console.log("- Length:", API_KEY.length);
  console.log("- Prefix:", API_KEY.substring(0, 7) + "...");
  console.log("- Suffix: ..." + API_KEY.slice(-5));
} else {
  console.warn("Gemini API Key Status: MISSING");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const WORKING_MODEL = "gemini-2.0-flash";

const getModel = () => {
  let modelName = MODEL_NAME || WORKING_MODEL;
  // Map any unavailable/older Gemma variants to Gemini Flash
  if (!modelName || modelName.includes("gemma")) {
    modelName = WORKING_MODEL;
  }

  const generationConfig = {
    maxOutputTokens: 8192,
    temperature: 0.7,
  };

  return {
    generateContent: async (prompt) => {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: generationConfig,
        });
        if (!response.text) throw new Error("Empty response from model");
        // Wrap in a response-compatible object to match old SDK interface
        return {
          response: {
            text: () => response.text,
          },
        };
      } catch (err) {
        console.warn(`Model '${modelName}' failed (${err.message}). Retrying with ${WORKING_MODEL}...`);
        const response = await ai.models.generateContent({
          model: WORKING_MODEL,
          contents: prompt,
          config: generationConfig,
        });
        if (!response.text) throw new Error("Model returned empty response. Please try a shorter duration.");
        return {
          response: {
            text: () => response.text,
          },
        };
      }
    }
  };
};

export const generateWorkout = async (workoutDetails) => {
  try {
    const model = getModel();
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
    const model = getModel();
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
    const model = getModel();
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
    const model = getModel();
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
    const model = getModel();
    // Cap at 7 days to stay within model output limits
    const rawDays = durationType === 'weeks' ? duration * 7 : (durationType === 'months' ? duration * 30 : duration);
    const daysToGenerate = Math.min(rawDays, 7);

    const prompt = `Create a ${daysToGenerate}-day wellness plan for the goal: "${goal}".
Return ONLY a JSON object with key "days" (array of ${daysToGenerate} objects). No markdown, no extra text.

Each day object:
{"day":1,"focus":"string","workout":{"title":"string","duration":"25 mins","warmup":"string","exercises":["Exercise: sets x reps. Brief tip."]},"meal":{"title":"string","calories":"500 kcal","ingredients":["qty ingredient"],"recipe":["Step."]},"breathing":{"title":"string","duration":"5 mins","guide":["Step."]}}

Rules:
- exercises: exactly 4 items
- ingredients: exactly 4 items
- recipe: exactly 3 steps
- guide: exactly 4 steps
- workout duration: 20-30 mins only`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonBlock = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonBlock);

    // If user asked for more than 7 days, repeat the cycle
    if (rawDays > 7 && parsed.days) {
      const extendedDays = [];
      for (let i = 0; i < rawDays; i++) {
        const dayData = { ...parsed.days[i % parsed.days.length], day: i + 1 };
        extendedDays.push(dayData);
      }
      parsed.days = extendedDays;
    }

    return parsed;
  } catch (error) {
    console.error("Error generating weekly plan:", error);
    throw error;
  }
};

export const generateDietPlan = async (userDetails) => {
  try {
    const model = getModel();
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
    const model = getModel();
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


