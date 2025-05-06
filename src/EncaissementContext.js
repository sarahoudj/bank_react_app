import React, { createContext, useContext, useState } from 'react';

// Créer un contexte pour l'encaissement
const EncaissementContext = createContext();

// Créer un Provider pour encapsuler les composants qui en ont besoin
export const EncaissementProvider = ({ children }) => {
  // État initial des encaissements pour chaque devise
  const [encaissements, setEncaissements] = useState(
    [
      'EUR', 'USD', 'CAD', 'JPY', 'SAR', 'CHF', 'GBP', 'AED', 'DKK', 'SEK', 'NOK', 'CNY'
    ].map(devise => ({
      devise,
      ancienSolde: 0,
      venteTouristique: 0,
      venteMission: 0,
      venteSoins: 0,
      nouveauSolde: 0,
    }))
  );

  // Fonction pour mettre à jour les ventes (ajouter des ventes pour chaque service)
  const ajouterVente = (devise, typeService, montant) => {
    setEncaissements(prevEncaissements =>
      prevEncaissements.map(encaissement => {
        if (encaissement.devise === devise) {
          const newVentes = { ...encaissement };
          if (typeService === 'touristique') {
            newVentes.venteTouristique += montant;
          } else if (typeService === 'mission') {
            newVentes.venteMission += montant;
          } else if (typeService === 'soins') {
            newVentes.venteSoins += montant;
          }
          // Calculer le nouveau solde après ajout de la vente
          newVentes.nouveauSolde =
            (newVentes.venteTouristique + newVentes.venteMission + newVentes.venteSoins);
          return newVentes;
        }
        return encaissement;
      })
    );
  };

  return (
    <EncaissementContext.Provider value={{ encaissements, ajouterVente }}>
      {children}
    </EncaissementContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useEncaissement = () => useContext(EncaissementContext);
