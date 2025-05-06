import React from 'react';
import { useEncaissement } from './EncaissementContext'; // Importer le hook
import './EncaissementPage.css';
import Footere from './Footere';

function EncaissementPage() {
  const { encaissements } = useEncaissement();  // Utiliser les encaissements du contexte

  return (
    <div className="encaissement-page">
      <div className="page-header">
    
  <h1 className="page-title">MOUVEMENT D'ENCAISSEMENT </h1>
  
  <div className="header-underline" />
</div>


      <div className="table-container">
        <div className="financial-table">
          <div className="table-header">
            {['Devise', 'Ancien Solde', 'Vente Touristique', 'Vente Mission', 'Vente Soins', 'Nouveau Solde'].map((header, index) => (
              <div key={index} className="header-cell">{header}</div>
            ))}
          </div>
          
          {encaissements.map((e, index) => (
            <div key={e.devise} className={`table-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
              <div className="data-cell currency-cell">{e.devise}</div>
              <div className="data-cell">{e.ancienSolde.toLocaleString()}</div>
              <div className="data-cell">{e.venteTouristique.toLocaleString()}</div>
              <div className="data-cell">{e.venteMission.toLocaleString()}</div>
              <div className="data-cell">{e.venteSoins.toLocaleString()}</div>
              <div className="data-cell highlight-cell">{e.nouveauSolde.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <Footere />
    </div>
  );
}
export default EncaissementPage;