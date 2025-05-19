import React from "react";
import "./HeroSection.css";
import { HashLink as Link } from "react-router-hash-link";

const HeroSection = () => {
  return (
    <header className="hero">
      {/* Navigation */}
      <nav className="navbar">
        {/* Logo à gauche */}
        <div className="logo-container">
          <img src="bank.png" alt="Logo" className="logo" />
          <span className="logo-text">BA</span>
        </div>

        {/* Liens à droite */}
        
        <ul className="nav-links">
        <li><Link smooth to="#">Home</Link></li>
        
        {/*<li><Link smooth to="#about">About Us</Link></li>*/}
        <li><Link smooth to="#services">operation de changes 
        
        
        
        
        
        
        
        </Link></li>
        <li><Link to="/reglementation"> La réglementation</Link></li>
        < li><Link to="/encaissement"> l'encaissement</Link></li>
      
        < li><Link to="/cotation"> Cotation</Link></li>
        <li><Link to="/consult">Consultation Transactions</Link></li>
      
      </ul> 
      
       {/* Bouton Sign In */}
            { /*  <button className="sign-in-btn">SIGN IN</button>*/}
      
      </nav>

      {/* Contenu principal */}
      
      <div className="hero-content">
      <br />
      <br />
      <br />
      <br />
      <br />
        <h1>From Concept to Creation</h1>
        
        <p>Your Partner in Remodeling and New Builds</p>
      
      </div>
    </header>
  );
};

export default HeroSection;