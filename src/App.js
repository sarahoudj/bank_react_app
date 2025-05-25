/*import React from 'react';
import AllocationTouristiquePage from './components/AllocationTouristiquePage';
import FraisDeMissionPage from './components/FraisDeMissionPage';
import SoinsPage from './components/SoinsPage';
import './App.css';
import  CotationPage from './CotationPage.js';

function App() {
  return (
    <div className="App">
      <CotationPage/>
    </div>
  );
}

export default App;*/
// src/App.js

import React from "react";
import { HashRouter, Routes, Route, Navigate ,useLocation } from "react-router-dom";
import HeroSection from "./HeroSection";
import Services from "./Services";
import Footer from "./Footer";

import AllocationTouristiquePage from "./components/AllocationTouristiquePage";
import ReglementationPage from "./ReglementationPage";
import EncaissementPage from "./EncaissementPage";
import CotationPage from "./CotationPage";
import FraisDeMissionPage from "./components/FraisDeMissionPage";
import SoinsPage from "./components/SoinsPage";
import ConsultPage from './ConsultPage';
import LoginPage from './LoginPage'; 

function AppContent() {
  const location = useLocation(); 
  const showNavbar = location.pathname !== '/login'; 

  return (
    <>
      {showNavbar && <HeroSection />} 
      
      
      <main className="app-main-content"> 
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected/App routes */}
          <Route
            path="/home"
            element={
              <>
               
                {/* The Services section (identified by its ID for hash linking) */}
                <div id="home-services-section">
                  <Services />
                </div>
                
              </>
            }
          />

          {/* All other specific application pages */}
          <Route path="/allocation-touristique" element={<AllocationTouristiquePage />} />
          <Route path="/reglementation" element={<ReglementationPage />} />
          <Route path="/encaissement" element={<EncaissementPage />} />
          <Route path="/services" element={<Services />} /> {/* If Services can be a standalone page */}
          <Route path="/cotation" element={<CotationPage />} />
          <Route path="/missions" element={<FraisDeMissionPage />} />
          <Route path="/soins" element={<SoinsPage />} />
          <Route path="/consult" element={<ConsultPage />} />
          
          {/* Default route: redirects to /login if no other path matches */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 404 Route */}
          <Route path="*" element={<div><h1>404 - Page not found</h1><p>Return to the <a href="/login">login page</a>.</p></div>} />
        </Routes>
      </main>
    </>
  );
}


function App() {
  console.log("App started with global navigation (excluding login)!");
  return (
    <HashRouter>
      <AppContent /> {/* Render the conditional content wrapper */}
    </HashRouter>
  );
}

export default App;