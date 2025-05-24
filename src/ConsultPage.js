
import React, { useState, useEffect } from 'react';
import { Search, Calendar, RefreshCw, Trash2,CheckCircle, XCircle,FileText } from 'lucide-react';
import './ConsultPage.css';

const ConsultPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [loggedInUserCodeSiege, setLoggedInUserCodeSiege] = useState(''); // État pour stocker le code siège
 


  useEffect(() => {
    // Récupérer le code_siege de localStorage AU DÉBUT
    const userCodeSiege = localStorage.getItem('loggedInUserCodeSiege');
    if (userCodeSiege) {
      setLoggedInUserCodeSiege(userCodeSiege);
    } else {
      console.warn("Code Siège utilisateur non trouvé dans localStorage.");
      // Vous pourriez vouloir afficher un message d'erreur ou rediriger si c'est obligatoire.
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async (date = '') => {
    setLoading(true);
    setError(null);
    setNoResults(false);
    setDeleteError(null);
    setDeleteSuccess(null);

    // Utilisez la valeur de l'état si déjà chargée, sinon essayez de la récupérer à nouveau
    const currentCodeSiege = loggedInUserCodeSiege || localStorage.getItem('loggedInUserCodeSiege');

    try {
      const params = new URLSearchParams();

      if (date) {
        params.append('date', date);
      }

      // Ajouter le code_siege aux paramètres si présent
      if (currentCodeSiege) { // Utiliser currentCodeSiege ici
        params.append('codeSiege', currentCodeSiege);
      } else {
        // Gérer le cas où codeSiege est manquant, peut-être ne pas faire la requête ou afficher une erreur
        setError("Code Siège non disponible. Impossible de charger les transactions.");
        setLoading(false);
        return;
      }
      let url = 'http://localhost:5000/api/transactions';
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
      if (data.length === 0) {
        setNoResults(true);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des transactions:", e);
      setError("Impossible de charger les transactions. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(filterDate); // Applique le filtre de date
  };

  const handleResetFilter = () => {
    setFilterDate('');
    fetchTransactions(); // Réinitialise le filtre de date et recharge
  };

  const handleDeleteClick = (transactionId, transactionType) => {
    setDeleteConfirmation({ id: transactionId, type: transactionType });
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    const { id, type } = deleteConfirmation;
    setLoading(true);
    setDeleteConfirmation(null);

    try {
      let endpoint = '';
      switch (type) {
        case 'Allocation Touristique':
          endpoint = `/api/allocations/${id}`;
          break;
        case 'Frais de Missions':
          endpoint = `/api/frais-missions/${id}`;
          break;
        case 'Soins':
          endpoint = `/api/soins/${id}`;
          break;
        default:
          throw new Error('Type de transaction inconnu pour la suppression.');
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression.');
      }

      setDeleteSuccess(`La transaction "${type}" (ID: ${id}) a été supprimée avec succès.`);
      fetchTransactions(filterDate); // Recharger avec le filtre de date actuel
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
      setDeleteError(`Échec de la suppression: ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setDeleteSuccess(null);
        setDeleteError(null);
      }, 5000);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };
// --- NOUVELLE FONCTION POUR GÉNÉRER LE RAPPORT ---
  const handleGenerateReport = async (transactionId, transactionType) => {
    // Adapter le type de transaction pour correspondre aux noms de la route API backend
    let typeForBackend = '';
    switch (transactionType) {
      case 'Allocation Touristique':
        typeForBackend = 'allocation';
        break;
      case 'Frais de Missions':
        typeForBackend = 'frais_mission';
        break;
      case 'Soins':
        typeForBackend = 'soins_etranger';
        break;
      default:
        alert("Type de transaction inconnu pour la génération de rapport.");
        return;
    }

    if (!loggedInUserCodeSiege) {
      alert("Code Siège utilisateur non trouvé. Impossible de générer le rapport.");
      return;
    }

    try {
      // Construire l'URL pour la route du rapport PDF
      // Le code siège est passé via les query parameters
      const reportUrl = `http://localhost:5000/api/report/${typeForBackend}/${transactionId}?codeSiege=${loggedInUserCodeSiege}`;

      // Ouvrir le PDF dans une nouvelle fenêtre/onglet pour le téléchargement ou l'affichage
      window.open(reportUrl, '_blank');

    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Erreur lors de la génération du rapport PDF.');
    }
  };
  // --------------------------------------------------
  return (
    <div className="consult-page-container">
      <div className="page-header">
        <h2 className="page-title">Consultation des Transactions</h2>
      </div>

      <div className="filter-section">
        <form onSubmit={handleFilterSubmit} className="filter-form">
          <div className="form-group">
            <label htmlFor="filterDate" className="form-label">Filtrer par Date :</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="primary-button filter-button">
            <Search size={18} /> Rechercher
          </button>
          <button type="button" onClick={handleResetFilter} className="secondary-button reset-button">
            <RefreshCw size={18} /> Afficher tout
          </button>
        </form>
      </div>

     {deleteSuccess && (
        <div className="notification-container success-notification">
          <CheckCircle size={20} className="notification-icon" />
          <p>{deleteSuccess}</p>
          <button onClick={() => setDeleteSuccess(null)} className="notification-close-button">
            <XCircle size={16} />
          </button>
        </div>
      )}
      {deleteError && (
        <div className="notification-container error-notification">
          <XCircle size={20} className="notification-icon" />
          <p>{deleteError}</p>
          <button onClick={() => setDeleteError(null)} className="notification-close-button">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {loading && <p className="loading-message">Chargement des transactions...</p>}
      {error && <p className="error-message">{error}</p>}
      {noResults && !loading && !error && <p className="info-message">Aucune transaction trouvée pour la date sélectionnée.</p>}


      {!loading && !error && !noResults && (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id + transaction.type} className="transaction-card">
              <div className="transaction-header">
                <span className={`transaction-type ${transaction.type.toLowerCase().replace(/\s/g, '-')}`}>
                  {transaction.type}
                </span>
                <span className="transaction-date">
                  <Calendar size={16} /> {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <div className="transaction-details">
                <p><strong>Nom:</strong> {transaction.nom}</p>
                <p><strong>Prénom:</strong> {transaction.prenom}</p>
                <p><strong>Devise:</strong> {transaction.devise}</p>
                <p><strong>Montant (DA):</strong> {transaction.montant_da ? transaction.montant_da : 'N/A'} DA</p>
                {transaction.reference && <p><strong>numero de passeport:</strong> {transaction.reference}</p>}
                <p><strong> Siège:</strong> {transaction.code_siege}</p>
              </div>
              <div className="transaction-actions">
                 {/* --- NOUVEAU BOUTON RAPPORT --- */}
                <button
                  className="report-button" // Vous pouvez ajouter ce style à ConsultPage.css
                  onClick={() => handleGenerateReport(transaction.id, transaction.type)}
                  title="Générer le rapport PDF"
                >
                  <FileText size={18} /> Rapport
                </button>
                {/* ----------------------------- */}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(transaction.id, transaction.type)}
                  title="Supprimer la transaction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirmation && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Voulez-vous vraiment supprimer la transaction "{deleteConfirmation.type}" (ID: {deleteConfirmation.id}) ? Cette action est irréversible.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="secondary-button">Annuler</button>
              <button onClick={confirmDelete} className="primary-button delete-confirm-button">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultPage;