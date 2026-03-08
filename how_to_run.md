# Fix for Signup "Failed to fetch" Error

## Problem
The signup form was showing a "Failed to fetch" error. This error occurs when the frontend application (running on port 5173) cannot communicate with the backend server (expected on port 5000).

## Investigation
1.  **Backend Status:** The backend server was **not running**. You were only running the frontend via `npm run dev`.
2.  **Configuration Check:**
    -   Frontend checks for API at `http://localhost:5000`.
    -   Backend is configured to run on port `5000`.
    -   Database connection string is correctly set in `server/.env`.

## Solution
I started the backend server for you. This resolved the connectivity issue.

### Verification
I tested the connection by sending a test signup request to the backend, which successfully returned a valid authentication token.

## How to Run in the Future
To run the full application, you need to run **both** the frontend and backend servers.

1.  **Frontend Terminal:**
    ```bash
    npm run dev
    ```
2.  **Backend Terminal:** (Open a new terminal)
    ```bash
    cd server
    npm run dev
    ```

You should now be able to sign up successfully.
