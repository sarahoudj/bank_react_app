import React from 'react';
import AllocationTouristiquePage from './components/AllocationTouristiquePage';
import FraisDeMissionPage from './components/FraisDeMissionPage';
import SoinsPage from './components/SoinsPage';
import './App.css';


function App() {
  return (
    <div className="App">
      <AllocationTouristiquePage />
    </div>
  );
}

export default App;

/*import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./HeroSection";
/*import About from "./About";
import Services from "./Services";
import Footer from "./Footer";

import AllocationTouristiquePage from "./components/AllocationTouristiquePage";
import ReglementationPage from "./ReglementationPage";
import EncaissementPage from "./EncaissementPage";
import { EncaissementProvider } from "./EncaissementContext";  // Importer le Provider

import "./App.css";

function App() {
  return (
    <EncaissementProvider>  {/* Encapsuler l'application avec le Provider 
      <HashRouter>
        <Routes>
          <Route 
            path="/" 
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
          <Route 
            path="/allocation-touristique" 
            element={<AllocationTouristiquePage />} 
          />
          <Route path="/reglementation" element={<ReglementationPage/>} />
          <Route path="/encaissement" element={<EncaissementPage/>} />
          <Route path="/services" element={<Services/>} />

        </Routes>
      </HashRouter>
    </EncaissementProvider>
  );
}

export default App;*/
