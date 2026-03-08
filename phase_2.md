# Phase 2: Core Routine Engine & Dashboard

## Objectives
- Build the "heart" of the app.
- Design a stunning dashboard.
- Handle offline content.

## Tasks
1. **Content Repository**:
   - Create `src/data/predefinedContent.js` with array of:
     - 10 Workouts
     - 10 Breathing Exercises
     - 10 Meal Recipes
     - 10 Lifestyle Tips
2. **Routine Logic**:
   - Write a function to pick 1 item from each category daily.
   - Ensure the routine stays the same for 24 hours (using date as seed or local storage).
3. **Dashboard UI**:
   - Heading: "Good Morning, [User]!"
   - Status Bar: Date and current progress.
   - **Grid of Cards**:
     - Workout Card
     - Meditation/Breathing Card
     - Meal Card
     - Lifestyle Tip Card
     - Daily Challenge Card
4. **Card Styling**:
   - Hover effects, glassmorphism, and icons for each category.
