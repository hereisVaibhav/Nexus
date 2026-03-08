import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Wind, Utensils, User, Apple } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <nav className="bottom-nav">
            <NavLink to="/workouts" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Dumbbell size={20} />
                <span>Workouts</span>
            </NavLink>
            <NavLink to="/meditation" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Wind size={20} />
                <span>Meditation</span>
            </NavLink>
            <NavLink to="/meals" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Utensils size={20} />
                <span>Meals</span>
            </NavLink>
            <NavLink to="/diet-plan" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Apple size={20} />
                <span>Diet</span>
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <User size={20} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default Navbar;
