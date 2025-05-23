import React, { useState, useEffect } from 'react';
import './CotationPage.css';

function CotationPage() {
  const [tauxDeChange, setTauxDeChange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modifying, setModifying] = useState(false);
  const [modifiedTaux, setModifiedTaux] = useState({});

  useEffect(() => {
    const fetchTauxDeChange = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/taux-de-change');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTauxDeChange(data);
        // Initialiser l'état modifiedTaux avec les valeurs actuelles
        const initialModifiedTaux = {};
        data.forEach(devise => {
          initialModifiedTaux[devise.code] = { tauxAchat: devise.tauxAchat, tauxVente: devise.tauxVente };
        });
        setModifiedTaux(initialModifiedTaux);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTauxDeChange();
  }, []);

  const handleModifierTaux = () => {
    setModifying(true);
  };

  const handleInputChange = (event, code, field) => {
    const { value } = event.target;
    setModifiedTaux(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field]: value,
      },
    }));
  };

  const handleSauvegarderModifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = Object.keys(modifiedTaux).map(async code => {
        const { tauxAchat, tauxVente } = modifiedTaux[code];
        const response = await fetch('http://localhost:5000/api/modifier-taux', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, tauxAchat, tauxVente }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur lors de la modification de ${code}: ${errorData.message || response.statusText}`);
        }
        return response.json();
      });

      await Promise.all(promises);
      setModifying(false);
      // Recharger les taux après la sauvegarde
      const response = await fetch('http://localhost:5000/api/taux-de-change');
      if (response.ok) {
        const data = await response.json();
        setTauxDeChange(data);
        const initialModifiedTaux = {};
        data.forEach(devise => {
          initialModifiedTaux[devise.code] = { tauxAchat: devise.tauxAchat, tauxVente: devise.tauxVente };
        });
        setModifiedTaux(initialModifiedTaux);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des taux de change...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des taux de change: {error}</div>;
  }

  return (
    <div className="cotation-page">
      <h2>Cotation Hebdomadaire des Devises</h2>
      <table>
        <thead>
          <tr>
            <th>Devise</th>
            <th>Taux d'Achat</th>
            <th>Taux de Vente</th>
            {modifying && <th>Modifier Achat</th>}
            {modifying && <th>Modifier Vente</th>}
          </tr>
        </thead>
        <tbody>
          {tauxDeChange.map(devise => (
            <tr key={devise.code}>
              <td>{devise.nom} ({devise.code})</td>
              <td>{devise.tauxAchat}</td>
              <td>{devise.tauxVente}</td>
              {modifying && (
                <td>
                  <input
                    type="number"
                    value={modifiedTaux[devise.code]?.tauxAchat || ''}
                    onChange={(e) => handleInputChange(e, devise.code, 'tauxAchat')}
                  />
                </td>
              )}
              {modifying && (
                <td>
                  <input
                    type="number"
                    value={modifiedTaux[devise.code]?.tauxVente || ''}
                    onChange={(e) => handleInputChange(e, devise.code, 'tauxVente')}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!modifying ? (
        <button onClick={handleModifierTaux} className="primary-button">
          Modifier les Taux
        </button>
      ) : (
        <button onClick={handleSauvegarderModifications} className="primary-button">
          Sauvegarder les Modifications
        </button>
      )}
    </div>
  );
}

export default CotationPage;

