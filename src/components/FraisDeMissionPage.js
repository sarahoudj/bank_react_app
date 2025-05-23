import React, { useState ,useEffect } from 'react';
import { Bell, User, Menu, DollarSign, CreditCard, Calendar, ChevronRight, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FraisDeMissionPage.css'; // Importez le fichier CSS

const FraisDeMissionPage=() => {
  // États pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numPasseport, setNumPasseport] = useState('');
  const [dateDeLivraison, setDateDeLivraison] = useState('');
  const [ministere, setMinistere] = useState('')
  const [nationalite, setNationalite] = useState('');
  const [paysDestination, setPaysDestination] = useState('');
  const [ordMission, setOrdMission] = useState('');
  const [civilite, setCivilite] = useState(''); 
  const [devise, setDevise] = useState('');
  const [frais, setFrais] = useState('non');
  const [montant, setMontant] = useState(''); // Nouveau state pour le montant
  const [date,setDate] = useState('');
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
  const [tauxDeChangeData, setTauxDeChangeData] = useState([]);
  const [loadingTaux, setLoadingTaux] = useState(true);
  const [errorTaux, setErrorTaux] = useState(null);

  /*// Tableau de bord des taux de change actuels (simulation)
  const tauxDeChange = [
    { devise: 'EUR', achat: '142.50 DA', vente: '146.67 DA' },
    { devise: 'USD', achat: '127.80 DA', vente: '132.20 DA' },
    { devise: 'GBP', achat: '167.40 DA', vente: '173.20 DA' },
  ];*/

  // --- NOUVEAU: État pour stocker le code_siege de l'utilisateur connecté ---
    const [loggedInUserCodeSiege, setLoggedInUserCodeSiege] = useState('');
  // -------------------------------------------------------------------------

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
   const civilites = ['Mr', 'Mme', 'Mlle'];
   const ministeresAlgerie = [
    'Ministère de l\'Intérieur, des Collectivités locales et de l\'Aménagement du territoire',
    'Ministère des Affaires étrangères et de la Communauté nationale à l\'étranger',
    'Ministère de la Justice, Garde des Sceaux',
    'Ministère de l\'Énergie et des Mines',
    'Ministère des Finances',
    'Ministère de la Défense nationale',
    'Ministère de l\'Agriculture et du Développement rural',
    'Ministère de l\'Industrie et de la Production pharmaceutique',
    'Ministère du Commerce et de la Promotion des exportations',
    'Ministère de l\'Enseignement supérieur et de la Recherche scientifique',
    'Ministère de l\'Éducation nationale',
    'Ministère de la Santé, de la Population et de la Réforme hospitalière',
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
  

   useEffect(() => {
    const fetchTauxDeChange = async () => {
      setLoadingTaux(true);
      setErrorTaux(null);
      try {
        const response = await fetch('http://localhost:5000/api/taux-de-change');
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
    const isValid = nom && prenom && numPasseport && dateDeLivraison && ministere &&  devise && ordMission && nationalite &&civilite && paysDestination && date && montant && nombreAccompagnant;
    setFormIsValid(isValid);
    return isValid;
  };
  const handleAfficherResultat = () => {
    if (validateForm()) {
      const selectedDeviseData = tauxDeChangeData.find(taux => taux.code === devise);
  
      if (selectedDeviseData && selectedDeviseData.tauxVente) {
        const tauxVenteNumerique = parseFloat(selectedDeviseData.tauxVente);
        const montantNumerique = parseFloat(montant);
        const nombreAccompagnantNumerique = parseInt(nombreAccompagnant, 10) || 0;
  
        if (!isNaN(montantNumerique) && !isNaN(tauxVenteNumerique)) {
          const calculatedCoursVenteDevise = montantNumerique / tauxVenteNumerique;
          const calculatedCommission = 60 * nombreAccompagnantNumerique;
          const calculatedTotalEnDinars = montantNumerique + calculatedCommission;
  
          setCoursVenteDevise(calculatedCoursVenteDevise.toFixed(2) + ' ' + devise);
          setCoursVenteDinars(montantNumerique.toFixed(2) + ' DA');
          setCommission(calculatedCommission.toFixed(2) + ' DA');
          setTotalEnDinars(calculatedTotalEnDinars.toFixed(2) + ' DA');
          setResultatVisible(true);
          setStep(2);
        } else {
          alert('Veuillez entrer un montant et un nombre d\'accompagnants valides.');
        }
      } else {
        alert('Le taux de vente pour la devise sélectionnée n\'est pas disponible.');
      }
    } else {
      // ...
    }
  };
 

  // Gérer l'envoi du formulaire à la base de données
 
  const handleEnvoyer = async () => {
    if (formIsValid) {
      try {
        const response = await fetch('http://localhost:5000/api/frais-missions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom,
            prenom,
            numPasseport,
            dateDeLivraison,
            ministere,
            nationalite,
            paysDestination,
            civilite,
            devise,
            ordMission,
            montant,
            nombreAccompagnant,
            frais,
            coursVenteDevise,
            coursVenteDinars,
            commission,
            totalEnDinars,
            date,
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
    setMinistere('');
    setNationalite('');
    setPaysDestination('');
    setOrdMission('');
    setCivilite('');
    setDevise('');
    setDate('');
    setMontant('');
    setNombreAccompagnant('');
    setFrais('non');
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

     
      {/* Main content */}
      <main className="main-content">
        <div className="main-container">
          <div className="form-section">
            {/* Page header */}
            <div className="page-header">
              <h2 className="page-title">Frais De Missions</h2>
              <div className="breadcrumb">
                <span>Accueil</span>
                <ChevronRight size={16} />
                <span>Missions</span>
                <ChevronRight size={16} />
                <span className="breadcrumb-current">Nouvelle Mission</span>
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
                    <label className="form-label">Montant(DA)</label>
                    <input
                      type="text"
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
                      className="form-input"
                      placeholder="entrez le montant "
                      disabled={step !== 1}
                      required
                    />
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
                  

                  {/* Nouveau champ pour le Ministère */}
                  <div className="form-group">
                    <label className="form-label">Ministère (Algérie)</label>
                    <select
                      value={ministere}
                      onChange={(e) => setMinistere(e.target.value)}
                      className="form-input"
                      disabled={step !== 1}
                      required
                    >
                      <option value="">Sélectionner un ministère</option>
                      {ministeresAlgerie.map((minist) => (
                        <option key={minist} value={minist}>
                          {minist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationalité</label>
                    <input
                      type="tel"
                      value={nationalite}
                      onChange={(e) => setNationalite(e.target.value)}
                      className="form-input"
                      placeholder=""
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
                    <label className="form-label">Ordre De Mission</label>
                    <input
                      type="email"
                      value={ordMission}
                      onChange={(e) => setOrdMission(e.target.value)}
                      className="form-input"
                      placeholder="Num"
                      disabled={step !== 1}
                      required
                    />
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
                    <label className="form-label">Nombre_Acc</label>
                    <input
                      type="text"
                      value={nombreAccompagnant}
                      onChange={(e) => setNombreAccompagnant(e.target.value)}
                      className="form-input"
                      placeholder="entrez le nombre "
                      disabled={step !== 1}
                      required
                    />
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

export default FraisDeMissionPage;