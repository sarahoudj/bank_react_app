// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Assurez-vous que ce fichier CSS existe

const LoginPage = () => {
  const [username, setUsername] = useState(''); // <-- Maintenant 'username'
  const [password, setPassword] = useState('');
  const [codeSiege, setCodeSiege] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!username || !password || !codeSiege) {
      setMessage('Veuillez remplir tous les champs.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, code_siege: codeSiege }), // <-- Envoie 'username'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Connexion réussie ! Redirection...');
        setIsError(false);
        // --- NOUVEAU: Stocker le code_siege et l'username dans localStorage ---
        localStorage.setItem('loggedInUserCodeSiege', codeSiege);
        localStorage.setItem('loggedInUsername', username); // Optionnel, mais utile
        setTimeout(() => {
         
          navigate('/home'); // Redirige vers la page d'accueil
        }, 1500);
      } else {
        setMessage(data.message || 'Échec de l\'enregistrement.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Erreur lors de la communication avec le serveur:', error);
      setMessage('Impossible de se connecter au serveur.');
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2> Connexion </h2>
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur :</label> {/* <-- Étiquette mise à jour */}
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Suppression des champs Nom et Prénom */}
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="codeSiege">Code Siège :</label>
          <input
            type="text"
            id="codeSiege"
            value={codeSiege}
            onChange={(e) => setCodeSiege(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Se Connecter </button>
      </form>
    </div>
  );
};

export default LoginPage;