# Database & Authentication Implementation Plan

## 1. Overview
The goal is to transform the current "open access" website into a user-focused platform with:
- **Public Landing Page**: The current Home page, but modified to serve as a marketing/welcome page.
- **Authentication**: Sign Up and Sign In functionality.
- **Private Dashboard**: A new personalized hub where users access the core features (Meals, Workouts, Meditation).
- **PostgreSQL Database**: To store user credentials and profiles.

## 2. User Flow
1.  **Visitor** lands on `/` (Home).
    - Can view general info.
    - Sees "Get Started" button.
2.  **Interaction**:
    - "Get Started" -> Redirects to `/signup` or `/login`.
3.  **Authentication**:
    - User creates account or logs in.
    - Upon success -> Redirected to `/dashboard`.
4.  **Dashboard (`/dashboard`)**:
    - Displays User Greeting ("Welcome, User").
    - Profile Icon/Summary.
    - Access cards for:
        - **Start Workout** (Links to `/workouts`)
        - **Plan Meal** (Links to `/meals`)
        - **Meditate** (Links to `/meditation`)
    - These features are no longer prominent on the public Home page.

## 3. Database Schema (PostgreSQL)

We will use PostgreSQL. Below is the proposed schema design.

### A. Users Table (`users`)
Stores core identity and authentication data.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords, NEVER plain text
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### B. User Profiles Table (`user_profiles`)
Stores wellness-specific data for the dashboard (can be expanded later).

```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    gender VARCHAR(20),
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    wellness_goal VARCHAR(255), -- e.g., "Lose weight", "Build muscle"
    plan_duration VARCHAR(50), -- e.g., "4 weeks", "30 days"
    current_plan_data JSONB, -- Stores the full personalized plan (meals, workouts, etc.)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

*(Optional Future Expansion: Tables for `activity_logs`, `saved_meals`, etc.)*

## 4. Implementation Steps

### Phase 1: Routing & Page Restructuring (Frontend)
1.  **Create New Pages**:
    - `SignIn.jsx`
    - `SignUp.jsx`
    - `Dashboard.jsx`
2.  **Update `App.jsx`**:
    - Move current `Home.jsx` logic to act as a Landing Page (removing direct feature links if strict access is desired, or keeping them as "teasers").
    - Protect `/dashboard`, `/workouts`, `/meals`, `/meditation` routes (require login).
3.  **Navigation**:
    - Update `Navbar` to show "Sign In" when logged out, and "Dashboard/Profile" when logged in.

### Phase 2: Backend & Database Setup
1.  **Database**:
    - **Connect to Existing PostgreSQL Database**: Configure connection strings/environment variables (`DATABASE_URL`).
    - Run the schema migration (SQL commands above).
2.  **API/Backend**:
    - **Backend Stack**: Node.js/Express.
    - **Authentication Strategy**: **JWT (JSON Web Tokens)**.
        - On Sign In: Server issues a signed JWT (`access_token`).
        - Client stores it (localStorage or HTTP-only Cookie).
        - Protected routes require this token in the `Authorization` header.

### Phase 3: Connecting Frontend to Backend
1.  **Auth Context**:
    - Create a React Context (`AuthContext`) to manage user session state (isLoggedIn, user object).
2.  **Forms**:
    - Connect Sign In/Sign Up forms to the API.
3.  **Dashboard Population**:
    - Fetch user name/profile data on load.

- **Goal Selection Mode** (If no plan exists):
    - Form to select **Goal** (Weight Loss, Muscle Gain, etc.) and **Duration** (Weeks/Months).
    - "Generate Plan" button -> Calls AI -> Saves value to DB.
- **Active Dashboard Mode** (If plan exists):
    - Header: "Day X of [Duration] - [Goal]"
    - Main Actions: [Meal Plan], [Workout], [Meditation] derived from `current_plan_data`.
- **Profile Section**: Summary of current progress.
