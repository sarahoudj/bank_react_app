import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const Services = () => {
  return (
    <section className="services">
      {/* Titre et sous-titre */}
      <div className="services-header">
        <h2 className="section-title"> <span>options</span></h2>
        <p className="section-subtitle">Welcome to [website name], your one-stop destination</p>
      </div>

      <div className="services-container">
        {/* Image principale - Allocation Touristique */}
        <div className="service-box large-box">
          <img src="imag3.jpg" alt="Allocation touristique" />
          <div className="text-overlay">
            <h3>Allocation Touristique</h3>
            <p>Planifiez vos voyages avec sérénité.</p>
          </div>
          <Link to="/allocation-touristique" className="icon-button">
            <img src="mg.jpg" alt="Voir plus" />
          </Link>
        </div>

        {/* Colonne des deux autres images */}
        <div className="small-boxes">
          {/* Soins à l'étranger */}
          <div className="service-box small-box">
            <img src="imag1.jpg" alt="Soins à l'étranger" />
            <div className="text-overlay">
              <h3>Soins à l'étranger</h3>
              <p>Bénéficiez des meilleurs traitements.</p>
            </div>
            <Link to="/soins" className="icon-button">
            <img src="mg.jpg" alt="Voir plus" />
          </Link>
          </div>

          {/* Missions à l'étranger */}
          <div className="service-box small-box">
            <img src="imag2.jpg" alt="Missions à l'étranger" />
            <div className="text-overlay">
              <h3>Missions à l'étranger</h3>
              <p>Accomplissez vos objectifs à l'international.</p>
            </div>
            <Link to="/missions" className="icon-button">
            <img src="mg.jpg" alt="Voir plus" />
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;