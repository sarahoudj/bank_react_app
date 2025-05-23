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
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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
import LoginPage from './LoginPage'; // <--- Assurez-vous d'importer votre nouvelle LoginPage

// Supprimez ProtectedRoute, AdminUsersPage, AuthProvider, useAuth, etc.
// si vous ne les utilisez plus.

import "./App.css";

function App() {
  console.log("App démarrée en mode simple (avec enregistrement/connexion) !");

  return (
    <HashRouter>
      <Routes>
        {/* La page de connexion simple est la première affichée */}
        <Route path="/login" element={<LoginPage />} />

        {/* Page d'accueil */}
        <Route
          path="/home"
          element={
            <>
              <HeroSection />
              <div id="services">
                <Services />
              </div>
              <Footer />
            </>
          }
        />

        {/* Toutes les autres pages sont directement accessibles */}
        <Route path="/allocation-touristique" element={<AllocationTouristiquePage />} />
        <Route path="/reglementation" element={<ReglementationPage />} />
        <Route path="/encaissement" element={<EncaissementPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cotation" element={<CotationPage />} />
        <Route path="/missions" element={<FraisDeMissionPage />} />
        <Route path="/soins" element={<SoinsPage />} />
        <Route path="/consult" element={<ConsultPage />} />

        {/* Route par défaut: redirige vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route 404 (optionnel) */}
        <Route path="*" element={<div><h1>404 - Page non trouvée</h1><p>Retournez à la <a href="/login">page de connexion</a>.</p></div>} />
      </Routes>
    </HashRouter>
  );
}

export default App;