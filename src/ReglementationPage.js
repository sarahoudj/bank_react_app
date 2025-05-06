import React from 'react';
import './ReglementationPage.css'; // Importation du fichier CSS pour le style
import Footere from './Footere';
function ReglementationPage() {
  return (
    <div className="reglementation-container">
      <h1 className="reglementation-title">Réglementation</h1>

      {/* Titre 1 - SOINS A L'ETRANGER */}
      <div className="reglementation-section">
        <h2 className="section-title">SOINS A L'ETRANGER</h2>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 1</h3>
          <p className="rule-description">Le cours est arrondi sur quatre positions.</p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 2</h3>
          <p className="rule-description">
            <strong>a.</strong> Le montant dinars en entrée = la somme des montants du barème par nombre de personnes.
          </p>
          <p className="rule-description">
            <strong>b.</strong> La table barème contient les montants fixes pour une personne et par motif de soins médicaux.
          </p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 3</h3>
          <p className="rule-description">Le montant Devise est arrondi selon la plus petite coupure existante.</p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 4</h3>
          <p className="rule-description">Le montant de la commission est un montant fixe multiplié par le nombre de personnes.</p>
        </div>
      </div>
      {/* Titre 2 - Allocation touristique */}
      <div className="reglementation-section">
        <h2 className="section-title">Allocation touristique</h2>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 1</h3>
          <p className="rule-description">
            L’allocation touristique est destinée uniquement aux agents de la banque d’Algérie ainsi que leurs proches (conjoint, enfants, parents).
          </p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 2</h3>
          <p className="rule-description">
            Le montant fixe d’allocation touristique est fixé à 1 500 DA pour un adulte et à 7 500 DA pour un enfant âgé de moins de 15 ans.
          </p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 3</h3>
          <p className="rule-description">Le montant de la commission est nul.</p>
        </div>
      </div>

      {/* Titre 3 - Missions à l'étranger */}
      <div className="reglementation-section">
        <h2 className="section-title">MISSIONS A L'ETRANGER</h2>

        <div className="reglementation-rule">
          <h3 className="rule-title">Règle 1</h3>
          <p className="rule-description">
            Le montant Dinars en entrée est calculé manuellement selon un barème fixe et le nombre de jours de mission.
          </p>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">A. Clients non employés de la Banque d’Algérie (BA)</h3>
          <div className="rule-description">
            <p><strong>1.</strong> Le montant Devise est arrondi selon la plus petite coupure existante.</p>
            <p><strong>2.</strong> La commission est fixée à 60 DA par personne.</p>
            <p><strong>3.</strong> Le total (commission + CV Dinars) peut dépasser le montant dinars en entrée.</p>
          </div>
        </div>

        <div className="reglementation-rule">
          <h3 className="rule-title">B. Clients employés de la Banque d’Algérie (BA)</h3>
          <div className="rule-description">
            <p><strong>1.</strong> Le montant Devise est arrondi au minimum selon la plus petite coupure existante.</p>
            <p><strong>2.</strong> La commission est soustraite du montant de la contre-valeur dinars.</p>
            <p><strong>3.</strong> Le total (commission + CV Dinars) ne doit pas dépasser le montant dinars en entrée.</p>
          </div>
        </div>
      </div>
      <Footere />
    </div>
  );
}

export default ReglementationPage;