
// ConsultPage.js
// ConsultPage.js
// ConsultPage.js
import React, { useState, useEffect } from 'react';
import { Search, Calendar, RefreshCw, Trash2,CheckCircle, XCircle } from 'lucide-react'; // Importez XCircle pour l'icône de confirmation d'erreur
import './ConsultPage.css';

const ConsultPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { id, type } de la transaction à supprimer
  const [deleteError, setDeleteError] = useState(null); // Pour les erreurs de suppression
  const [deleteSuccess, setDeleteSuccess] = useState(null); // Pour les succès de suppression

  const fetchTransactions = async (date = '') => {
    setLoading(true);
    setError(null);
    setNoResults(false);
    setDeleteError(null); // Réinitialiser les messages de suppression
    setDeleteSuccess(null);
    try {
      const url = date
        ? `http://localhost:5000/api/transactions?date=${date}`
        : 'http://localhost:5000/api/transactions';

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(filterDate);
  };

  const handleResetFilter = () => {
    setFilterDate('');
    fetchTransactions();
  };

  // --- NOUVELLES FONCTIONS POUR LA SUPPRESSION ---

  const handleDeleteClick = (transactionId, transactionType) => {
    // Demander une confirmation avant de supprimer
    setDeleteConfirmation({ id: transactionId, type: transactionType });
    setDeleteError(null); // Réinitialiser l'erreur de suppression précédente
    setDeleteSuccess(null); // Réinitialiser le succès de suppression précédent
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    const { id, type } = deleteConfirmation;
    setLoading(true); // Afficher le chargement pendant la suppression
    setDeleteConfirmation(null); // Cacher la modal de confirmation

    try {
      // Déterminer l'endpoint de suppression basé sur le type de transaction
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
      // Recharger les transactions après la suppression réussie
      fetchTransactions(filterDate);
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
      setDeleteError(`Échec de la suppression: ${e.message}`);
    } finally {
      setLoading(false);
      // Masquer le message de succès/erreur après quelques secondes
      setTimeout(() => {
        setDeleteSuccess(null);
        setDeleteError(null);
      }, 5000);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null); // Annuler la suppression
};

// --- FIN DES NOUVELLES FONCTIONS ---

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

    {/* Messages de notification de suppression */}
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
            </div>
            <div className="transaction-actions">
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

    {/* Modal de confirmation de suppression */}
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