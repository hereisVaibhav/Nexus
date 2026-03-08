# Phase 4: AI Power - Gemini API Integration

## Objectives
- Add dynamic "Generate More" capabilities.
- Personalize content based on user input.

## Tasks
1. **Gemini API Integration**:
   - Setup API client in `src/utils/gemini.js`.
   - Create generic prompt templates.
2. **Workout Generator**:
   - UI for selecting Skill Level (Beginner/Pro), Type (Strength/Yoga), and Duration.
   - Fetch custom exercise from Gemini (follow same structure as previous cards).
3. **Breathing Generator**:
   - UI for Mood (Anxious, Tired, Focus).
   - Fetch custom technique from Gemini.
4. **Meal Generator**:
   - UI for Diet (Veg/Non-Veg), Calories (Low/Bulk), and Style (Indian, Mediterranean).
   - After that generate the full recipe as a card with all the ingredients and steps.
5. **Loading States**:
   - Beautiful shimmer effects or spinners while AI is thinking.
