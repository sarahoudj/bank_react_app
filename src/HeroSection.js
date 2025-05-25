// src/HeroSection.js

import React, { useState, useEffect } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { Menu, X, Home, DollarSign, Book, Briefcase, BarChart2, TrendingUp, UserCircle } from 'lucide-react'; // Renamed UserCircleIcon to UserCircle for common Lucide usage
import './HeroSection.css';

const HeroSection = () => {

  
    const [displayedCodeSiege, setDisplayedCodeSiege] = useState('');
    const [displayedUsername, setDisplayedUsername] = useState('');
    

    const navigate = useNavigate();
    const [isNavbarSidebarOpen, setIsNavbarSidebarOpen] = useState(false);

    const toggleNavbarSidebar = () => {
        setIsNavbarSidebarOpen(!isNavbarSidebarOpen);
    };

    useEffect(() => {
      const storedCodeSiege = localStorage.getItem('loggedInUserCodeSiege');
        const storedUsername = localStorage.getItem('loggedInUsername');
        if (storedCodeSiege) {
            setDisplayedCodeSiege(storedCodeSiege);
        }
        if (storedUsername) {
            setDisplayedUsername(storedUsername);
        }
        if (isNavbarSidebarOpen) {
            document.body.classList.add('navbar-sidebar-open');
        } else {
            document.body.classList.remove('navbar-sidebar-open');
        }
        return () => {
            document.body.classList.remove('navbar-sidebar-open');
        };
    }, [isNavbarSidebarOpen]);
    const handleLogout = () => {
        localStorage.removeItem('loggedInUserCodeSiege');
        localStorage.removeItem('loggedInUsername');
        setDisplayedCodeSiege('');
        setDisplayedUsername('');
        navigate('/login');
        setIsNavbarSidebarOpen(false); // Close sidebar on logout
    };

    return (
        <>
            {/* Top Bar (Always visible) */}
            <header className="app-top-navbar">
                <div className="app-top-navbar-left">
                    <button onClick={toggleNavbarSidebar} className="app-menu-button" aria-label="Open menu">
                        <Menu size={24} />
                    </button>
                    <div className="app-logo-container">
                        <img src="logoBA.png" alt="Logo" className="app-logo-img" />
                        {displayedCodeSiege && <span className="app-logo-text">{displayedCodeSiege}</span>}
            
                    </div>
                </div>
                <div className="app-top-navbar-right">
                    <button className="app-logout-button" onClick={handleLogout}>Déconnexion</button>
                    {displayedUsername && <span className="app-username-display">{displayedUsername}</span>}
                    <UserCircle size={20} className="app-user-icon" />
                    
                </div>
            </header>

            {/* Sidebar (slides in/out) */}
            <aside className={`app-sidebar-nav ${isNavbarSidebarOpen ? 'open' : ''}`}>
                <div className="app-sidebar-header">
                    <div className="app-logo-container">
                        <img src="logoBA.png" alt="Logo" className="app-logo-img" />
                        <span className="app-logo-text"></span>
                    </div>
                    <button onClick={toggleNavbarSidebar} className="app-close-sidebar-button" aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                <nav className="app-sidebar-links">
                    <NavLink
                        to="/home"
                        className={({ isActive }) => "app-sidebar-link" + (isActive ? " active" : "")}
                        onClick={toggleNavbarSidebar}
                    >
                        <Home size={20} /> Home
                    </NavLink>
                    <Link
                        smooth
                        to="/home#services"
                        className="app-sidebar-link"
                        onClick={toggleNavbarSidebar}
                    >
                        <DollarSign size={20} /> Opérations de Changes
                    </Link>
                    <NavLink
                        to="/reglementation"
                        className={({ isActive }) => "app-sidebar-link" + (isActive ? " active" : "")}
                        onClick={toggleNavbarSidebar}
                    >
                        <Book size={20} /> La Réglementation
                    </NavLink>
                    <NavLink
                        to="/encaissement"
                        className={({ isActive }) => "app-sidebar-link" + (isActive ? " active" : "")}
                        onClick={toggleNavbarSidebar}
                    >
                        <Briefcase size={20} /> L'Encaissement
                    </NavLink>
                    <NavLink
                        to="/cotation"
                        className={({ isActive }) => "app-sidebar-link" + (isActive ? " active" : "")}
                        onClick={toggleNavbarSidebar}
                    >
                        <TrendingUp size={20} /> Cotation
                    </NavLink>
                    <NavLink
                        to="/consult"
                        className={({ isActive }) => "app-sidebar-link" + (isActive ? " active" : "")}
                        onClick={toggleNavbarSidebar}
                    >
                        <BarChart2 size={20} /> Consultation Transactions
                    </NavLink>
                    
                </nav>
            </aside>

            {/* Overlay (visible when sidebar is open on smaller screens) */}
            {isNavbarSidebarOpen && <div className="app-sidebar-overlay" onClick={toggleNavbarSidebar}></div>}
        </>
    );
};

export default HeroSection;