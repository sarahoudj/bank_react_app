import React from "react";
import "./Footere.css";

import { HashLink as Link } from "react-router-hash-link";
const Footere = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section gauche : Logo + Nom + Description */}
        <div className="footer-left">
          <div className="logo-title">
            <img src="bank.png" alt="Logo" className="footer-logo" />
            <h2 className="footer-title">BA</h2>
          </div>
          <p className="footer-description">Your one-stop destination for quality services.</p>
        </div>

        {/* Ligne verticale */}
        <div className="footer-divider"></div>

        {/* Section droite : Liens */}
        <div className="footer-right">
          <ul className="footer-links">
         <li><Link to="/">Home </Link></li>
        <li><Link to="/services"> Services</Link></li>
        {/*<li><Link to="/about"> About Us</Link></li>*/}
      </ul> 
        
        </div>
      </div>

      {/* Ligne horizontale */}
      <hr className="footer-line" />

      {/* Copyright */}
      <p className="footer-copyright">&copy; 2025 [BA]. All rights reserved.</p>
    </footer>
  );
};

export default Footere;
