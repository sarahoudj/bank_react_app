import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, CalendarDays } from 'lucide-react'; // Icônes
import './EncaissementPage.css'; // Créez ce fichier CSS

const EncaissementPage = () => {
    const [loggedInUserCodeSiege, setLoggedInUserCodeSiege] = useState('');
    const [encaissementData, setEncaissementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [currentDate, setCurrentDate] = useState(''); // Pour afficher la date du jour

    // Liste des 12 devises utilisées (assurez-vous qu'elle correspond à celle du backend)
    const devises = [
        'EUR', 'USD', 'GBP', 'CAD', 'CHF', 'JPY', 'SAR', 'AED', 'KWD', 'SEK', 'DKK', 'NOK',
    ];

    useEffect(() => {
        // Récupère le code siège de l'utilisateur connecté depuis le local storage
        const userCodeSiege = localStorage.getItem('loggedInUserCodeSiege');
        if (userCodeSiege) {
            setLoggedInUserCodeSiege(userCodeSiege);
        } else {
            setError("Code Siège utilisateur non trouvé. Veuillez vous reconnecter.");
            setLoading(false);
        }

        // Définit la date du jour du PC
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(today.toLocaleDateString('fr-FR', options));
    }, []);

    const fetchEncaissementData = async () => {
        if (!loggedInUserCodeSiege) {
            setError("Code Siège non disponible pour la récupération des données.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Requête vers la nouvelle route API du backend
            const response = await fetch(`http://localhost:5000/api/encaissement/${loggedInUserCodeSiege}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur HTTP! Statut: ${response.status} - ${errorText}`);
            }
            const data = await response.json();

            // S'assurer que toutes les 12 devises sont représentées, même si le backend n'a pas d'entrées pour elles
            const fullData = devises.map(d => {
                const existing = data.find(item => item.devise === d);
                return existing || {
                    devise: d,
                    ancien_solde: "0.00",
                    montant_allocations_jour: "0.00",
                    montant_frais_missions_jour: "0.00",
                    montant_soins_jour: "0.00",
                    nouveau_solde: "0.00",
                };
            });
            setEncaissementData(fullData);
            setLastUpdated(new Date());
        } catch (e) {
            console.error("Erreur lors de la récupération des données d'encaissement:", e);
            setError(`Impossible de charger les données : ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Effectuer la première récupération des données une fois que le code_siege est disponible
    useEffect(() => {
        if (loggedInUserCodeSiege) {
            fetchEncaissementData();
        }
    }, [loggedInUserCodeSiege]); // Déclenche la récupération quand code_siege est défini

    return (
        <div className="encaissement-page-container">
            <h1 className="encaissement-page-title">
                <DollarSign size={28} /> Encaissement Quotidien
            </h1>
            <p className="encaissement-code-siege">
                Code Siège actuel: <strong>{loggedInUserCodeSiege || 'Non défini'}</strong>
            </p>
            <p className="encaissement-date-info">
                <CalendarDays size={18} /> Date du jour: <strong>{currentDate}</strong>
            </p>

            <div className="encaissement-actions">
                <button onClick={fetchEncaissementData} className="refresh-button" disabled={loading}>
                    <RefreshCw size={18} /> Rafraîchir les données
                </button>
                {lastUpdated && (
                    <span className="last-updated-info">
                        Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {loading && <p className="loading-message">Chargement des données d'encaissement...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <div className="encaissement-table-wrapper">
                    <table className="encaissement-table">
                        <thead>
                            <tr>
                                <th>Devise</th>
                                <th>Ancien Solde</th>
                                <th>Allocations du Jour</th>
                                <th>Frais Missions du Jour</th>
                                <th>Soins du Jour</th>
                                <th>Nouveau Solde</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encaissementData.map((item) => (
                                <tr key={item.devise}>
                                    <td>{item.devise}</td>
                                    <td>{item.ancien_solde}</td>
                                    <td>{item.montant_allocations_jour}</td>
                                    <td>{item.montant_frais_missions_jour}</td>
                                    <td>{item.montant_soins_jour}</td>
                                    <td className={parseFloat(item.nouveau_solde) < 0 ? 'negative-solde' : ''}>
                                        {item.nouveau_solde}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EncaissementPage;