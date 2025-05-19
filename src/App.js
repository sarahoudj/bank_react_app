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

import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./HeroSection";
//import About from "./About";
import Services from "./Services";
import Footer from "./Footer";

import AllocationTouristiquePage from "./components/AllocationTouristiquePage";
import ReglementationPage from "./ReglementationPage";
import EncaissementPage from "./EncaissementPage";
import CotationPage from "./CotationPage";
import FraisDeMissionPage from "./components/FraisDeMissionPage";
import SoinsPage from "./components/SoinsPage";
import ConsultPage from './ConsultPage';
import { EncaissementProvider } from "./EncaissementContext";  // Importer le Provider

import "./App.css";

function App() {
  return (
    <EncaissementProvider>  
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
        
          <Route path="/cotation" element={<CotationPage/>} />
          <Route path="/missions" element={<FraisDeMissionPage/>} />
          <Route path="/soins" element={<SoinsPage/>} />
          <Route path="/consult" element={<ConsultPage />} />


        </Routes>
      </HashRouter>
    </EncaissementProvider>
  );
}

export default App;
