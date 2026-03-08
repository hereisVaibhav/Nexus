import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Workouts from './pages/Workouts'
import Meditation from './pages/Meditation'
import Meals from './pages/Meals'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DietPlan from './pages/DietPlan'
import AboutUs from './pages/AboutUs'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import HowItWorks from './pages/HowItWorks'
import ForgotPassword from './pages/ForgotPassword'
import './index.css'

import { AuthProvider } from './context/AuthContext';

// Compass component to conditionally render Navbar
const Layout = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Hide Navbar on auth pages if desired, or keep it.
    // For now, let's keep it but maybe we want to hide it on ./signin and ./signup for a cleaner look?
    // The user plan didn't strictly say to hide it, but it's common practice.
    // Let's hide Navbar on SignIn and SignUp for a dedicated auth feel.
    // Also hiding on Home page ('/') as per user request to have it only on internal pages.
    const hideNavbarPaths = ['/signin', '/signup', '/forgot-password', '/', '/about', '/privacy', '/contact', '/how-it-works'];
    const showNavbar = !hideNavbarPaths.includes(location.pathname);

    const isHomePage = location.pathname === '/';

    return (
        <div className="app-container">
            <main className={isHomePage ? "content-area-full" : "content-area"}>
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/meditation" element={<Meditation />} />
                        <Route path="/meals" element={<Meals />} />
                        <Route path="/diet-plan" element={<DietPlan />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    )
}


export default App
