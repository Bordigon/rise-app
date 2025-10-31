import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import '../../styles/AddFriendsTab.css';


export default function AddFriendsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { store } = useGlobalReducer();
  const token = store.token;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    const delayDebounceFn = setTimeout(() => {
      // --- SIMULACIÓN DE API (MOCK DATA) ---
      const MOCK_USERS_DB = [
        { id: 10, username: "ProGamer1" },
        { id: 12, username: "HabitQueen" },
        { id: 2,  username: "RiseUser" },
        { id: 8,  username: "StreakMaster" },
      ];
      const results = MOCK_USERS_DB.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);

      // --- CÓDIGO REAL DEL BACKEND ---
      /*
      if (!token) {
        setError("You must be logged in to search.");
        setLoading(false);
        return;
      }
      
      fetch(`${API_URL}/api/users/search?username=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to search users');
        return response.json();
      })
      .then(data => {
        setSearchResults(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
      */
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  const handleAddFriend = (userId) => {
    // --- SIMULACIÓN DE API (MOCK DATA) ---
    alert(`Friend request sent to user ${userId}. (Simulation)`);

    // --- CÓDIGO REAL DEL BACKEND  ---
    /*
    if (!token) return;
    
    fetch(`${API_URL}/api/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ friend_id: userId })
    })
    .then(response => {
      if (!response.ok) return response.json().then(err => { throw new Error(err.message || 'Error sending request') });
      return response.json();
    })
    .then(data => {
      alert(data.message || `Friend request sent.`);
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
    });
    */
  };

  return (
    <div className="add-friends-container">
      <input
        type="text"
        className="form-control custom-input mb-4"
        placeholder="Search users by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {loading && <div className="text-center text-muted">Searching...</div>}
      {error && <div className="text-center text-danger">{error}</div>}
      
      <ul className="search-results-list">
        {!loading && searchResults.map(user => (
          <li key={user.id} className="search-result-row">
            <span className="username">{user.username}</span>
            <button className="add-friend-btn" onClick={() => handleAddFriend(user.id)}>
              <i className="bi bi-plus-lg"></i>
            </button>
          </li>
        ))}
        {!loading && searchTerm.trim() !== "" && searchResults.length === 0 && (
          <p className="text-muted text-center">No users found.</p>
        )}
      </ul>
    </div>
  );
}