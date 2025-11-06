import React, { useState, useEffect, useMemo } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import '../../styles/LeaderboardTab.css';

import { getUsers } from '../../services/userService.js'
import goldenEgg from '../../assets/img/communitypageimgs/golden-egg.webp';
import silverEgg from '../../assets/img/communitypageimgs/silver-egg.webp';
import bronzeEgg from '../../assets/img/communitypageimgs/bronze-egg.webp';

// URL base de la API (asumiendo que la obtienes de las variables de entorno)
// const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function LeaderboardTab() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { store } = useGlobalReducer();
  const currentUser = store.user;
  const token = store.token;

  const handleGetData = async () => {
    const data = await getUsers();
    console.log(data)
    const rankedList = data.sort((a, b) => b.level - a.level).map((user, index) => ({ ...user, rank: index + 1 }));
    console.log(leaderboardData)
    setLeaderboardData(rankedList);
  }

  useEffect(() => {
    handleGetData();
    setLoading(false);
  }, [token]);

  const filteredLeaderboard = useMemo(() => {
    if (!searchTerm) {
      return leaderboardData;
    }
    return leaderboardData.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaderboardData, searchTerm]);

  const getRankMedal = (rank) => {
    if (rank === 1) return goldenEgg;
    if (rank === 2) return silverEgg;
    if (rank === 3) return bronzeEgg;
    return null;
  };

  const getRankClassName = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };


  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;
    const userInList = leaderboardData.find(user => user.id === currentUser.id);
    return userInList || { ...currentUser, rank: -1 };
  }, [leaderboardData, currentUser]);


  if (loading) return <div className="text-center text-muted">Loading leaderboard...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <div className="leaderboard-container">
      <input
        type="text"
        className="form-control custom-input mb-4"
        placeholder="Search for your name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="leaderboard-list">
        {filteredLeaderboard.length > 0 ? (
          filteredLeaderboard.map((user) => {
            const medal = getRankMedal(user.rank);
            const rankClass = getRankClassName(user.rank);
            const isCurrentUser = user.id === currentUser?.id;

            return (
              <li
                key={user.id}
                className={`leaderboard-row ${rankClass} ${isCurrentUser ? 'current-user-highlight' : ''}`}
              >
                <div className="rank-section">
                  {medal ? (
                    <img src={medal} alt={`${user.rank}st place`} className="rank-medal" />
                  ) : (
                    <span className="rank-number">{user.rank}</span>
                  )}
                </div>
                <div className="user-info-section">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`} alt="avatar" className="avatar-medium" />
                  <div className="user-details">
                    <span className="username">{user.name}</span>
                    {/*<span className="level">Level {user.level}</span>  esto sirve para expresar el nivel, pero como de momento no tenemos niveles...*/}
                  </div>
                </div>
                <span className="xp-total">{user.level} XP</span>
              </li>
            );
          })
        ) : (
          <p className="text-center text-muted">No users found in the leaderboard.</p>
        )}


        {searchTerm && currentUserRank && currentUserRank.rank === -1 && (
          <>
            <li className="leaderboard-row separator">...</li>
            <li key={currentUserRank.id} className="leaderboard-row current-user-highlight">
              <div className="rank-section">
                <span className="rank-number">N/A</span> {/* O tu posición real si el backend la proporciona */}
              </div>
              <div className="user-info-section">
                <img src={currentUserRank.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUserRank.name}`} alt="avatar" className="avatar-medium" />
                <div className="user-details">
                  <span className="username">{currentUserRank.name} (You)</span>
                  <span className="level">Level {currentUserRank.level || 1}</span>
                </div>
              </div>
              <span className="xp-total">{currentUserRank.xp || 0} XP</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}