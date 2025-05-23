import React from "react";
import "./HeroSection.css";
import { HashLink as Link } from "react-router-hash-link";
// Supprimez useNavigate, useState, useEffect et useAuth

const HeroSection = () => {
  return (
    <header className="hero">
      <nav className="navbar">
        <div className="logo-container">
          <img src="bank.png" alt="Logo" className="logo" />
          <span className="logo-text">BA</span>
        </div>

        <ul className="nav-links">
          <li><Link smooth to="#">Home</Link></li>
          <li><Link smooth to="#services">Opérations de Changes</Link></li>
          <li><Link to="/reglementation">La Réglementation</Link></li>
          <li><Link to="/encaissement">L'Encaissement</Link></li>
          <li><Link to="/cotation">Cotation</Link></li>
          <li><Link to="/consult">Consultation Transactions</Link></li>
          {/* Supprimez le lien vers /admin/users et le bouton de déconnexion */}
        </ul>
      </nav>

      <div className="hero-content">
        <br /><br /><br /><br /><br />
        <h1>From Concept to Creation</h1>
        <p>Your Partner in Remodeling and New Builds</p>
      </div>
    </header>
  );
};

export default HeroSection;