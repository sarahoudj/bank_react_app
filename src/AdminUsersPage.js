import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUsersPage.css'; // Créez ce fichier CSS

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', codeSiege: '' });
  const [creationError, setCreationError] = useState('');
  const [creationSuccess, setCreationSuccess] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 403) {
            navigate('/login'); // Rediriger si non autorisé
            return;
          }
          throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreationError('');
    setCreationSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setCreationSuccess('Utilisateur créé avec succès.');
        setNewUser({ username: '', password: '', codeSiege: '' });
        // Refetch users
        const fetchUsers = async () => {
          setLoading(true);
          setError(null);
          try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/users', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              if (response.status === 403) {
                navigate('/login'); // Rediriger si non autorisé
                return;
              }
              throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
          } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchUsers();
      } else {
        const errorData = await response.json();
        setCreationError(errorData.message || 'Erreur lors de la création de l\'utilisateur.');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setCreationError('Impossible de créer l\'utilisateur.');
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirmation(userId);
    setDeleteError('');
    setDeleteSuccess('');
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirmation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${deleteConfirmation}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDeleteSuccess('Utilisateur supprimé avec succès.');
        setUsers(users.filter(user => user.id !== deleteConfirmation));
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || 'Erreur lors de la suppression de l\'utilisateur.');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setDeleteError('Impossible de supprimer l\'utilisateur.');
    } finally {
      setDeleteConfirmation(null);
      setTimeout(() => {
        setDeleteSuccess('');
        setDeleteError('');
      }, 3000);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteConfirmation(null);
  };

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="admin-users-container">
      <h2>Gestion des Utilisateurs</h2>

      {creationError && <p className="error-message">{creationError}</p>}
      {creationSuccess && <p className="success-message">{creationSuccess}</p>}

      <h3>Créer un Nouvel Utilisateur</h3>
      <form onSubmit={handleCreateUser} className="create-user-form">
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="codeSiege">Code Siège:</label>
          <input
            type="text"
            id="codeSiege"
            name="codeSiege"
            value={newUser.codeSiege}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="primary-button">Créer Utilisateur</button>
      </form>

      <h3>Liste des Utilisateurs</h3>
      {deleteError && <p className="error-message">{deleteError}</p>}
      {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Code Siège</th>
            <th>Admin</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.code_siege}</td>
              <td>{user.is_admin ? 'Oui' : 'Non'}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(user.id)}
                  title="Supprimer l'utilisateur"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteConfirmation && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Voulez-vous vraiment supprimer l'utilisateur avec l'ID {deleteConfirmation} ?</p>
            <div className="modal-actions">
              <button onClick={cancelDeleteUser} className="secondary-button">Annuler</button>
              <button onClick={confirmDeleteUser} className="primary-button delete-confirm-button">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;