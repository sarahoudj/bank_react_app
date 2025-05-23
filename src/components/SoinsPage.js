import React, { useState , useEffect} from 'react';
import { Bell, User, Menu, DollarSign, CreditCard, Calendar, ChevronRight, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SoinsPage.css'; // Importez le fichier CSS

const SoinsPage = () => {
  // États pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numPasseport, setNumPasseport] = useState('');
  const [dateDeLivraison, setDateDeLivraison] = useState('');
  const [adresse, setAdresse] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [paysDestination, setPaysDestination] = useState('');
  const [bareme, setBareme] = useState(''); 
  const [devise, setDevise] = useState('');
  const [date, setDate ] = useState('');
  const [accompagne, setAccompagne] = useState('non');
  const [nombreAccompagnant,setNombreAccompagnant] = useState('');


  // États pour les résultats et l'UI
  const [resultatVisible, setResultatVisible] = useState(false);
  const [coursVenteDevise, setCoursVenteDevise] = useState('');
  const [coursVenteDinars, setCoursVenteDinars] = useState('');
  const [commission, setCommission] = useState('');
  const [totalEnDinars, setTotalEnDinars] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [formIsValid, setFormIsValid] = useState(false);
  const [tauxDeChangeData, setTauxDeChangeData] = useState([]); // Nouveau: pour stocker les taux du backend
  const [loadingTaux, setLoadingTaux] = useState(true);
  const [errorTaux, setErrorTaux] = useState(null);

// --- NOUVEAU: État pour stocker le code_siege de l'utilisateur connecté ---
  const [loggedInUserCodeSiege, setLoggedInUserCodeSiege] = useState('');
 
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
   

   // Liste des options pour la civilité
   const baremes = ['Malade Adulte  ', 'Malade enfant','deux malades adultes','Accompagnant', 'Rapatriement malade','soins sans prise en charge' ];
   const listePays = [
    'Algérie',
    'France',
    'États-Unis',
    'Canada',
    'Royaume-Uni',
    'Allemagne',
    'Espagne',
    'Italie',
    'Japon',
    'Australie',
  ];

  // --- NOUVEAU: Récupérer le code_siege de localStorage au montage du composant ---
  useEffect(() => {
    const userCodeSiege = localStorage.getItem('loggedInUserCodeSiege');
    if (userCodeSiege) {
      setLoggedInUserCodeSiege(userCodeSiege);
    } else {
      // Gérer le cas où le code siège n'est pas trouvé (ex: rediriger vers la page de login)
      console.warn("Code Siège non trouvé dans localStorage. L'utilisateur devrait se connecter.");
      // Optionnel:setMessage('Veuillez vous connecter pour enregistrer des transactions.'); setIsError(true);
    }
  }, []);
// Nouveau: Récupérer les taux de change depuis le backend au chargement du composant
useEffect(() => {
  const fetchTauxDeChange = async () => {
    setLoadingTaux(true);
    setErrorTaux(null);
    try {
      const response = await fetch('http://localhost:5000/api/taux-de-change'); // Assurez-vous que cette URL est correcte
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTauxDeChangeData(data);
    } catch (e) {
      setErrorTaux(e.message);
    } finally {
      setLoadingTaux(false);
    }
  };

  fetchTauxDeChange();
}, []); 

  // Validation du formulaire
  const validateForm = () => {
    const isValid = nom && prenom && numPasseport && dateDeLivraison && adresse &&  devise  && nationalite && bareme && paysDestination && date && accompagne && nombreAccompagnant;
    setFormIsValid(isValid);
    return isValid;
  };

  // Gérer l'affichage des résultats
  const handleAfficherResultat = () => {
    if (validateForm()) {
      const selectedDeviseData = tauxDeChangeData.find(taux => taux.code === devise);
  
      if (!selectedDeviseData || !selectedDeviseData.tauxVente) {
        alert('Le taux de vente pour la devise sélectionnée n\'est pas disponible. Veuillez recharger la page ou vérifier la configuration des taux.');
        return;
      }
  
      const tauxVenteNumerique = parseFloat(selectedDeviseData.tauxVente);
      const nombreAccompagnantNumerique = parseInt(nombreAccompagnant, 10) || 0; // S'assurer que c'est un nombre, 0 par défaut
  
      let calculatedCoursVenteDinars = 0;
      let calculatedCommission = 0;
      let calculatedCoursVenteDevise = 0;
      let calculatedTotalEnDinars = 0;
  
      // Calcul de coursVenteDinars basé sur le barème
      switch (bareme) {
        case 'Malade Adulte':
          calculatedCoursVenteDinars = 15900;
          break;
        case 'Malade enfant':
          calculatedCoursVenteDinars = 7600;
          break;
        case 'Rapatriement malade':
          calculatedCoursVenteDinars = 5900;
          break;
        case 'Accompagnant':
          calculatedCoursVenteDinars = 13500;
          break;
        case 'soins sans prise en charge':
          calculatedCoursVenteDinars = 120000;
          break;
        default:
          calculatedCoursVenteDinars = 0; // Valeur par défaut si aucun barème ne correspond
      }
  
      // Ajouter les frais des accompagnants
      calculatedCoursVenteDinars += 13500 * nombreAccompagnantNumerique;
  
      // Calcul de la commission
      calculatedCommission = 60 * (nombreAccompagnantNumerique + 1);
  
      // Calcul de coursVenteDevise
      if (tauxVenteNumerique > 0) {
        calculatedCoursVenteDevise = calculatedCoursVenteDinars / tauxVenteNumerique;
      } else {
        alert('Le taux de vente est nul, impossible de calculer le cours en devise.');
        return;
      }
  
      // Calcul du total
      calculatedTotalEnDinars = calculatedCoursVenteDinars + calculatedCommission;
  
      // Mettre à jour les états avec les valeurs calculées
      setCoursVenteDevise(calculatedCoursVenteDevise.toFixed(2) + ' ' + devise);
      setCoursVenteDinars(calculatedCoursVenteDinars.toFixed(2) + ' DA');
      setCommission(calculatedCommission.toFixed(2) + ' DA');
      setTotalEnDinars(calculatedTotalEnDinars.toFixed(2) + ' DA');
  
      setResultatVisible(true);
      setStep(2);
    } else {
      alert('Veuillez remplir tous les champs obligatoires avant de passer à l\'étape suivante.');
    }
  };
  // Gérer l'envoi du formulaire à la base de données
  const handleEnvoyer = async () => {
    if (formIsValid) {
      const codeSiege = localStorage.getItem('codeSiege'); // Récupérer le code siège
      try {
        const response = await fetch('http://localhost:5000/api/soins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({
            nom,
            prenom,
            date,
            numPasseport,
            dateDeLivraison,
            adresse,
            nationalite,
            paysDestination,
            bareme,
            devise,
            accompagne,
            nombreAccompagnant,
            coursVenteDevise,
            coursVenteDinars,
            commission,
            totalEnDinars,
             code_siege: loggedInUserCodeSiege, // --- NOUVEAU: Ajout du code_siege ici ---
          }),
        });
  
        if (response.ok) {
          setConfirmationVisible(true);
          setNotificationVisible(true);
          setStep(3);
          // Réinitialiser le formulaire après l'envoi réussi (optionnel)
          setTimeout(() => {
            handleAnnuler();
            setNotificationVisible(false);
          }, 5000);
        } else {
          // Gérer les erreurs de la requête (afficher un message d'erreur à l'utilisateur)
          console.error('Erreur lors de l\'envoi des données:', response.status);
          // Vous pourriez mettre à jour un état d'erreur pour afficher un message à l'utilisateur
        }
      } catch (error) {
        // Gérer les erreurs de connexion ou autres
        console.error('Erreur de connexion ou autre:', error);
        // Vous pourriez mettre à jour un état d'erreur pour afficher un message à l'utilisateur
      }
    } else {
      // Gérer le cas où le formulaire n'est pas valide (bien que cela devrait être géré par la validation précédente)
      console.log('Le formulaire n\'est pas valide.');
    }
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
    setBareme('');
    setDevise('');
    setDate('');
    setAccompagne('non');
    setNombreAccompagnant('');
    setCoursVenteDevise('');
    setCoursVenteDinars('');
    setCommission('');
    setTotalEnDinars('');
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
              <h2 className="page-title">Soins A L'étranger</h2>
              <div className="breadcrumb">
                <span>Accueil</span>
                <ChevronRight size={16} />
                <span>Soins</span>
                <ChevronRight size={16} />
                <span className="breadcrumb-current">Nouvelle adm </span>
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
                    <label className="form-label">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input"
                        disabled={step !== 1}
                        required
                      />
                      {/*<Calendar size={18} className="form-icon-right" />*/}
                    </div>
                  </div>
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
                    <select value={nationalite} onChange={(e) => setNationalite(e.target.value)} className="form-input" disabled={step !== 1} required>
                      <option value="">selectionner</option>
                      {listePays.map((nat) => (
                        <option key={nat} value={nat}>
                          {nat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pays DE Destination</label>
                    <input
                      type="text"
                      value={paysDestination}
                      onChange={(e) => setPaysDestination(e.target.value)}
                      className="form-input"
                      placeholder="entre le pays"
                      disabled={step !== 1}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Barème</label>
                    <select
                      value={bareme}
                      onChange={(e) => setBareme(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      
                      required
                    >
                      <option value="">Sélectionner</option>
                      {baremes.map((option) => (
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
                    <label className="form-label">Accompagné</label>
                    <select
                      value={accompagne}
                      onChange={(e) => setAccompagne(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nombre Accompagnants</label>
                    <input
                      type="text"
                      value={nombreAccompagnant}
                      onChange={(e) => setNombreAccompagnant(e.target.value)}
                      className="form-input"
                      placeholder="entrez le nbr"
                      disabled={step !== 1}
                      required
                    />
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
                    <div className="form-group">
                      <label className="form-label">Total</label>
                      <input type="text" value={totalEnDinars} className="form-input readonly" readOnly />
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
                {loadingTaux ? (
                  <p>Chargement des taux...</p>
                ) : errorTaux ? (
                  <p>Erreur lors du chargement des taux: {errorTaux}</p>
                ) : (
                  tauxDeChangeData
                    .slice(0, 3) // Sélection des trois premiers éléments
                    .map((taux) => (
                      <div key={taux.code} className="exchange-rate-item">
                        <div className="currency-info">
                          <div className="currency-symbol">{taux.code.charAt(0)}</div>
                          <div>
                            <p className="currency-name">{taux.nom} ({taux.code})</p>
                            <p className="currency-base">Dinar Algérien</p>
                          </div>
                        </div>
                        <div className="rate-info">
                        <p className="rate-value">{taux.tauxVente}</p>
                        {/*<p className="rate-type">Vente</p>*/}
                      </div>
                    </div>
                  )))}
                  </div>
              <hr/>
              <div className="view-all-rates">
                <Link to="/cotation"className="view-all-link">
                  Voir tous les taux <ChevronRight size={16} />
                </Link>
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

export default SoinsPage;