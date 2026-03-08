# Phase 3: Interaction & Habit Tracking

## Objectives
- Make the app interactive.
- Persist user progress locally.

## Tasks
1. **Detail Views**:
   - When a user clicks a card, open a "Full View" overlay or page.
   - Display steps for workouts, ingredients for meals, and guided text for breathing.
   - Also make a txt file for added workout plan, mediation plan & meals as we have to show the steps as well for them, so store their steps in a txt file and fetch them in the respective card for detail after we press start / open
2. **Progress Persistence**:
   - Add a "Mark as Complete" button to each task.
   - Use `localStorage` to save the state of completed tasks.
   - Progress bar on dashboard should update in real-time.
3. **Daily Reset Logic**:
   - Check the date on app launch. If it's a new day, reset completed tasks and generate a new routine.
4. **Refined UX**:
   - Simple animations when marking items as complete (e.g., checkmarks, color changes).
