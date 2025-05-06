import React, { useState } from 'react';
import { Bell, User, Menu, DollarSign, CreditCard, Calendar, ChevronRight, CheckCircle, X } from 'lucide-react';
import './AllocationTouristiquePage.css'; // Importez le fichier CSS

const AllocationTouristiquePage = () => {
  // États pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numPasseport, setNumPasseport] = useState('');
  const [dateDeLivraison, setDateDeLivraison] = useState('');
  const [adresse, setAdresse] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [paysDestination, setPaysDestination] = useState('');
  const [categorie, setCategorie] = useState(''); 
  const [civilite, setCivilite] = useState(''); 
  const [devise, setDevise] = useState('');
  const [frais, setFrais] = useState('non');


  // États pour les résultats et l'UI
  const [resultatVisible, setResultatVisible] = useState(false);
  const [coursVenteDevise, setCoursVenteDevise] = useState('');
  const [coursVenteDinars, setCoursVenteDinars] = useState('');
  const [commission, setCommission] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [formIsValid, setFormIsValid] = useState(false);

  // Tableau de bord des taux de change actuels (simulation)
  const tauxDeChange = [
    { devise: 'EUR', achat: '142.50 DA', vente: '146.67 DA' },
    { devise: 'USD', achat: '127.80 DA', vente: '132.20 DA' },
    { devise: 'GBP', achat: '167.40 DA', vente: '173.20 DA' },
  ];
  const devisesAlgerie = [
    'EUR',
    'USD',
    'GBP',
    'CAD',
    'CHF',
    'JPY',
    'SAR',
    'AED',
    'KWD',
    'QAR',
    'LYD',
    'MAD',
  ];
   // Liste des options pour la catégorie
   const categories = ['Adulte', 'Enfant'];

   // Liste des options pour la civilité
   const civilites = ['Mr', 'Mme', 'Mlle'];


  // Validation du formulaire
  const validateForm = () => {
    const isValid = nom && prenom && numPasseport && dateDeLivraison && adresse &&  devise && categorie && nationalite &&civilite && paysDestination;
    setFormIsValid(isValid);
    return isValid;
  };

  // Gérer l'affichage des résultats
  const handleAfficherResultat = () => {
    if (validateForm()) {
      setCoursVenteDevise('750 EUR');
      setCoursVenteDinars('110000.00 DA');
      setCommission('Null');
      setResultatVisible(true);
      setStep(2);
    } else {
      // Animation de champs non valides serait ajoutée ici
    }
  };

  // Gérer l'envoi du formulaire à la base de données
  const handleEnvoyer = () => {
    // Simulation d'envoi à la base de données
    setConfirmationVisible(true);
    setNotificationVisible(true);
    setStep(3);

    // En production, vous enverriez les données à votre API ici
    console.log('Données envoyées à la BDD:', {
      nom, prenom, numPasseport, dateDeLivraison, adresse,nationalite,paysDestination,categorie,civilite,devise,frais,
      coursVenteDevise, coursVenteDinars, commission
    });

    // Masquer la notification après 5 secondes
    setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
  };

  // Réinitialiser le formulaire
  const handleAnnuler = () => {
    setNom('');
    setPrenom('');
    setNumPasseport('');
    setDateDeLivraison('');
    setAdresse('');
    setNationalite('');
    setPaysDestination('');
    setCategorie('');
    setCivilite('');
    setDevise('');
    setFrais('non');
    setCoursVenteDevise('');
    setCoursVenteDinars('');
    setCommission('');
    setResultatVisible(false);
    setConfirmationVisible(false);
    setFormIsValid(false);
    setStep(1);
  };

  return (
    <div className="allocation-page">
      {/* Notification */}
      {notificationVisible && (
        <div className="notification-container">
          <CheckCircle size={20} className="notification-icon" />
          <div className="notification-text-container">
            <p className="notification-title">Allocation enregistrée avec succès</p>
            <p className="notification-subtitle">Allocation pour {prenom} {nom}</p>
          </div>
          <button onClick={() => setNotificationVisible(false)} className="notification-close-button">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header 
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="menu-button"
            >
              <Menu size={24} />
            </button>
            <div className="logo-container">
              <CreditCard size={28} className="logo-icon" />
              <h1 className="logo-text">BanqueChange</h1>
            </div>
          </div>

          <nav className="header-nav">
            <a href="#" className="nav-link active">Allocations</a>
            <a href="#" className="nav-link">Devises</a>
            <a href="#" className="nav-link">Clients</a>
            <a href="#" className="nav-link">Rapports</a>
          </nav>

          <div className="header-right">
            <button className="notification-button">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-info">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">Agent</span>
            </div>
          </div>
        </div>
      </header>
       */}
      {/* Mobile menu 
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-container">
            <nav className="mobile-nav">
              <a href="#" className="mobile-nav-link active">Allocations</a>
              <a href="#" className="mobile-nav-link">Devises</a>
              <a href="#" className="mobile-nav-link">Clients</a>
              <a href="#" className="mobile-nav-link">Rapports</a>
            </nav>
          </div>
        </div>
      )}
       */}
      {/* Main content */}
      <main className="main-content">
        <div className="main-container">
          <div className="form-section">
            {/* Page header */}
            <div className="page-header">
              <h2 className="page-title">Allocation Touristique</h2>
              <div className="breadcrumb">
                <span>Accueil</span>
                <ChevronRight size={16} />
                <span>Allocations</span>
                <ChevronRight size={16} />
                <span className="breadcrumb-current">Nouvelle allocation</span>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="progress-tracker">
              <div className="progress-line">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`progress-step-line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`progress-step-line ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
              </div>
              <div className="progress-labels">
                <div className="progress-label">Informations</div>
                <div className="progress-label">Validation</div>
                <div className="progress-label">Confirmation</div>
              </div>
            </div>

            {/* Form card */}
            <div className="form-card">
              {/* Première partie: Informations client */}
              <div className={`form-step ${step !== 1 ? 'disabled' : ''}`}>
                <h3 className="form-section-title">
                  <User size={20} className="form-section-icon" />
                  Informations du Client
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="form-input"
                      placeholder="Entrez le nom"
                      disabled={step !== 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="form-input"
                      placeholder="Entrez le prénom"
                      disabled={step !== 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Numéro de Passeport</label>
                    <input
                      type="text"
                      value={numPasseport}
                      onChange={(e) => setNumPasseport(e.target.value)}
                      className="form-input"
                      placeholder="Ex: AB123456"
                      disabled={step !== 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date de Livraison</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateDeLivraison}
                        onChange={(e) => setDateDeLivraison(e.target.value)}
                        className="form-input"
                        disabled={step !== 1}
                        required
                      />
                      {/*<Calendar size={18} className="form-icon-right" />*/}
                    </div>
                  </div>
                  

                  <div className="form-group col-span-2">
                    <label className="form-label">Adresse</label>
                    <input
                      type="text"
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      className="form-input"
                      placeholder="Adresse complète"
                      disabled={step !== 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationalité</label>
                    <input
                      type="tel"
                      value={nationalite}
                      onChange={(e) => setNationalite(e.target.value)}
                      className="form-input"
                      placeholder="Ex: +213 123 456 789"
                      disabled={step !== 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pays DE Destination</label>
                    <input
                      type="email"
                      value={paysDestination}
                      onChange={(e) => setPaysDestination(e.target.value)}
                      className="form-input"
                      placeholder="email@exemple.com"
                      disabled={step !== 1}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Catégorie</label>
                    <select
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Civilité</label>
                    <select
                      value={civilite}
                      onChange={(e) => setCivilite(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="">Sélectionner</option>
                      {civilites.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Nouveaux champs */}
                  <div className="form-group">
                    <label className="form-label">Devise</label>
                    <select
                      value={devise}
                      onChange={(e) => setDevise(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="">Sélectionner une devise</option>
                      {devisesAlgerie.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frais</label>
                    <select
                      value={frais}
                      onChange={(e) => setFrais(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>
                </div>

                {step === 1 && (
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleAfficherResultat}
                      className="primary-button"
                    >
                      Suivant <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Deuxième partie: Résultats */}
              {step >= 2 && (
                <div className="form-step">
                  <h3 className="form-section-title">
                    <DollarSign size={20} className="form-section-icon" />
                    Détails de l'Allocation
                  </h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Cours de Vente en Devise</label>
                      <input
                        type="text"
                        value={coursVenteDevise}
                        className="form-input readonly"
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cours de Vente en Dinars</label>
                      <input
                        type="text"
                        value={coursVenteDinars}
                        className="form-input readonly"
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Commission</label>
                      <input
                        type="text"
                        value={commission}
                        className="form-input readonly"
                        readOnly
                      />
                    </div>
                  </div>

                  {confirmationVisible && (
                    <div className="confirmation-message">
                      <div className="confirmation-icon-container">
                        <CheckCircle size={24} className="confirmation-icon" />
                      </div>
                      <div>
                        <p className="confirmation-title">Allocation touristique validée pour {prenom} {nom}</p>
                        <p className="confirmation-subtitle">Numéro de passeport: {numPasseport}</p>
                        <p className="confirmation-subtitle">Référence: ALT-{Math.floor(Math.random() * 100000)}</p>
                      </div>
                    </div>
                  )}

                  <div className="form-actions justify-between">
                    <button
                      type="button"
                      onClick={handleAnnuler}
                      className="secondary-button"
                    >
                      Annuler
                    </button>

                    {step === 2 && (
                      <button
                        type="button"
                        onClick={handleEnvoyer}
                        className="primary-button"
                      >
                        Valider et Enregistrer
                      </button>
                    )}

                    {step === 3 && (
                      <button
                        type="button"
                        onClick={handleAnnuler}
                        className="primary-button"
                      >
                        Nouvelle Allocation
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Taux de change */}
            <div className="exchange-rates-card">
              <h3 className="sidebar-title">Taux de Change</h3>
              <div className="exchange-rates-list">
                {tauxDeChange.map((taux, index) => (
                  <div key={index} className="exchange-rate-item">
                    <div className="currency-info">
                      <div className="currency-symbol">{taux.devise.charAt(0)}</div>
                      <div>
                        <p className="currency-name">{taux.devise}</p>
                        <p className="currency-base">Dinar Algérien</p>
                      </div>
                    </div>
                    <div className="rate-info">
                      <p className="rate-value">{taux.vente}</p>
                      <p className="rate-type">Vente</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr/>
              <div className="view-all-rates">
                <a href="#" className="view-all-link">
                  Voir tous les taux <ChevronRight size={16} />
                </a>
              </div>
            </div>

            {/* Informations */}
            <div className="info-card">
              <h3 className="sidebar-title inverted">Allocation Touristique</h3>
              <p className="info-text">
                L'allocation touristique est un droit accordé aux voyageurs pour échanger des devises lorsqu'ils partent à l'étranger.
              </p>
              <div className="info-list">
                <div className="info-item">
                  <CheckCircle size={16} className="info-icon" />
                  <span>Montant maximum: 15000 DA par personne</span>
                </div>
                <div className="info-item">
                  <CheckCircle size={16} className="info-icon" />
                  <span>Nécessite un passeport valide</span>
                </div>
                <div className="info-item">
                  <CheckCircle size={16} className="info-icon" />
                  <span>Limite d'une allocation par trimestre</span>
                </div>
              </div>
              <button className="info-button">
                Consulter la réglementation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      
      
    </div>
  );
};

export default AllocationTouristiquePage;