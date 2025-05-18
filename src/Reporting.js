import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import './Reporting.css';

const Reporting = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'tous',
    dateDebut: '',
    dateFin: '',
    nomClient: '',
  });

  const printComponentRef = useRef();

  // Fonction pour récupérer les données depuis le backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des données');
      setLoading(false);
      console.error('Erreur lors de la récupération des données:', err);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Mettre à jour les filtres lorsque les valeurs changent
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtrer par type de transaction
    if (filters.type !== 'tous') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Filtrer par date de début
    if (filters.dateDebut) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.dateDebut));
    }

    // Filtrer par date de fin
    if (filters.dateFin) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.dateFin));
    }

    // Filtrer par nom de client
    if (filters.nomClient) {
      filtered = filtered.filter(item => 
        item.nomClient.toLowerCase().includes(filters.nomClient.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  // Gestionnaire pour le bouton de réinitialisation des filtres
  const resetFilters = () => {
    setFilters({
      type: 'tous',
      dateDebut: '',
      dateFin: '',
      nomClient: '',
    });
    setFilteredTransactions(transactions);
  };

  // Appliquer les filtres lorsque les filtres changent
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Configuration de l'impression
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: 'Rapport de Transactions',
  });

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour déterminer la classe CSS basée sur le type de transaction
  const getTransactionTypeClass = (type) => {
    switch (type) {
      case 'allocation':
        return 'transaction-allocation';
      case 'mission':
        return 'transaction-mission';
      case 'soins':
        return 'transaction-soins';
      default:
        return '';
    }
  };

  return (
    <div className="reporting-container">
      <h1>Reporting des transactions</h1>

      {/* Filtres */}
      <div className="filters-section">
        <h2>Filtres</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="type">Type de transaction:</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="tous">Tous</option>
              <option value="allocation">Allocation touristique</option>
              <option value="mission">Mission à l'étranger</option>
              <option value="soins">Soins à l'étranger</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateDebut">Date de début:</label>
            <input
              type="date"
              id="dateDebut"
              name="dateDebut"
              value={filters.dateDebut}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateFin">Date de fin:</label>
            <input
              type="date"
              id="dateFin"
              name="dateFin"
              value={filters.dateFin}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="nomClient">Nom du client:</label>
            <input
              type="text"
              id="nomClient"
              name="nomClient"
              value={filters.nomClient}
              onChange={handleFilterChange}
              placeholder="Rechercher un client..."
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button onClick={resetFilters} className="reset-button">
            Réinitialiser les filtres
          </button>
          <button onClick={handlePrint} className="print-button">
            Imprimer le rapport
          </button>
        </div>
      </div>

      {/* Section imprimable */}
      <div className="printable-section" ref={printComponentRef}>
        <h2>Résultats du reporting</h2>
        
        {loading ? (
          <p>Chargement des données...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p>Aucune transaction ne correspond aux critères de filtrage.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Date</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Devise</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={getTransactionTypeClass(transaction.type)}
                >
                  <td>{transaction.id}</td>
                  <td>
                    {transaction.type === 'allocation' && 'Allocation touristique'}
                    {transaction.type === 'mission' && 'Mission à l\'étranger'}
                    {transaction.type === 'soins' && 'Soins à l\'étranger'}
                  </td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.nomClient}</td>
                  <td>{transaction.montant}</td>
                  <td>{transaction.devise}</td>
                  <td>
                    <button 
                      className="details-button"
                      onClick={() => window.open(`/transaction/${transaction.id}`, '_blank')}
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reporting;