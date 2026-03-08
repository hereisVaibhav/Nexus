## Nexus Wellness

1. Project Overview

Nexus Wellness is a web-first Progressive Web Application (PWA) designed to help users build sustainable daily wellness habits through guided routines. The app focuses on simplicity, consistency, and action-oriented wellness rather than overwhelming users with complex tracking systems.
The core idea is to act as a daily wellness companion that guides users toward better physical and mental health in 10–20 minutes per day.
--------------------------------------------------
2. Core Problem We Solve

- Users want to stay healthy but feel overwhelmed by complex fitness apps.
- Many wellness apps require subscriptions from day one.
- AI-generated advice often feels generic and disconnected from actual actions.
- Users struggle with consistency and habit formation.

We solves this by:
- Offering a free, guided daily wellness plan
- Connecting recommendations directly to in-app actions
- Removing barriers like payments, and calorie tracking in early stages and only apply in pro version.
--------------------------------------------------
3. Core Features (MVP)

**3.1 AI Wellness Planner**

The AI Wellness Planner generates a daily personalized routine based on following

Daily Plan Includes:
- Mini workout 
- Lifestyle tip
- Breathing exercise 
- Healthy meal idea 
- Challenge of the day

Important Behavior:

- The planner only store 20-30 predefined Breathing exercise, Workout & Meal ideas with recipe, in a txt file & then show them in frontend, after that we have a option for generate:

1. for workout planner generate option have level (biggner, intermediate, pro), type of exercise you want to do, and duration then the system uses Gemeni 1.5 API to generate a appropriate workout exercise with instruction.

2. for breathing exercise, the generate option have mood (calm breathing, yoga), type (focus, energy, relax) and when done same gemeni API generate appropriate exercise with it's steps.

3. for meal generation, we have option to select like type (veg or non-veg), mood (lunch, breakfast, dinner), style (indian, mexican, amarican), available ingredients (this is option user can add this or leave it blank), after that gemeni generate appropriate meal with cooking ingreadents

- Each recommendation is clickable and opens the exact workout or meditation session.
--------------------------------------------------
4. Technical Execution Strategy
Platform:
- Web-first PWA (installable on mobile and desktop)
- No App Store or Play Store dependency

Tech Stack:
- React (frontend)
- HTML, CSS, JavaScript
- no cloud

Data Storage:
- User preferences stored using localStorage
- No login or authentication in MVP (still in thinking process)
--------------------------------------------------
5. Market Fit
Target Users:
- Students
- Busy professionals
- Beginners in fitness & wellness
- Users avoiding expensive subscriptions

Why Market Fit Works:
- Free-first model builds trust
- Habit-based approach encourages daily usage
- Simple design lowers adoption friction
- PWA allows instant access without downloads
--------------------------------------------------
6. Market Size
Global Digital Health & Wellness Market:
- Estimated over $500+ billion globally
- Fitness & mental wellness apps growing at 15–20% annually

Target Segment:
- Entry-level wellness users
- Free-to-paid conversion audience
- Emerging markets and mobile-first users
--------------------------------------------------
7. Competitors
Direct Competitors:
- Headspace (paid, meditation-focused)
- Calm (paid, audio-heavy)
- Nike Training Club (fitness-focused)
They are not providing everything in one place, users need to go different apps for each feature/plan to access.

Nexus Wellness Advantage:
- Free AI-guided daily planner
- No upfront payment
- Action-oriented recommendations
- Lightweight and accessible PWA
-Providing everything in one place
--------------------------------------------------
8. Monetization Strategy
Initial Phase:
- 70-80% free to build user base

Future Monetization:
- Premium subscription for advanced plans
- Paid workout and meditation programs
- Personalized coaching features
- Affiliate partnerships (nutrition, wellness brands)

9. Vision
WellNest aims to become a trusted daily wellness companion that helps users improve health through small, consistent actions—without pressure, complexity, or high cost.

By - Vaibhav