import React, { useState, useEffect, useMemo } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import '../../styles/LeaderboardTab.css';


import goldenEgg from '../../assets/img/communitypageimgs/eggmedals/golden-egg.png';
import silverEgg from '../../assets/img/communitypageimgs/eggmedals/silver-egg.png';
import bronzeEgg from '../../assets/img/communitypageimgs/eggmedals/bronze-egg.png';

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

  useEffect(() => {
    // --- SIMULACIÓN DE API (MOCK DATA) ---
    const MOCK_LEADERBOARD = [
      { id: 10, username: "PhoenixKing", level: 15, xp: 15000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixKing` },
      { id: 12, username: "HabitQueen", level: 14, xp: 14200, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitQueen` },
      { id: 2,  username: "RiseUser", level: 12, xp: 12100, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=RiseUser` },
      { id: 1,  username: "PhoenixPlayer", level: 5, xp: 7500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixPlayer` }, // Simula tu usuario
      { id: 8,  username: "StreakMaster", level: 4, xp: 4300, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=StreakMaster` },
      { id: 5,  username: "GoalSetter", level: 1, xp: 1000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=GoalSetter` },
      { id: 11, username: "MindfulMona", level: 3, xp: 3500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=MindfulMona` },
      { id: 13, username: "BodyBuilderBob", level: 7, xp: 8200, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=BodyBuilderBob` },
      { id: 14, username: "CreativeCat", level: 9, xp: 9800, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=CreativeCat` },
      { id: 15, username: "SocialButterfly", level: 6, xp: 6000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=SocialButterfly` },
      { id: 16, username: "ProductivePanda", level: 10, xp: 10500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ProductivePanda` },
      { id: 17, username: "ZenZebra", level: 2, xp: 2000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ZenZebra` },
      { id: 18, username: "ExplorerElf", level: 8, xp: 9000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ExplorerElf` },
      { id: 19, username: "DreamerDragon", level: 11, xp: 11500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=DreamerDragon` },
      { id: 20, username: "LearnerLion", level: 13, xp: 13000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=LearnerLion` },
    ].sort((a, b) => b.xp - a.xp).map((user, index) => ({ ...user, rank: index + 1 })); // Asignar rank después de ordenar

    setLeaderboardData(MOCK_LEADERBOARD);
    setLoading(false);

    // --- CÓDIGO REAL DEL BACKEND  ---
    /*
    const fetchLeaderboard = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = await response.json();
        // Asume que la API devuelve los usuarios ordenados y con 'rank' incluido
        setLeaderboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    */
  }, [token]);

  const filteredLeaderboard = useMemo(() => {
    if (!searchTerm) {
      return leaderboardData;
    }
    return leaderboardData.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Search for your username..."
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
                  <img src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} alt="avatar" className="avatar-medium" />
                  <div className="user-details">
                    <span className="username">{user.username}</span>
                    <span className="level">Level {user.level}</span>
                  </div>
                </div>
                <span className="xp-total">{user.xp} XP</span>
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
                <img src={currentUserRank.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUserRank.username}`} alt="avatar" className="avatar-medium" />
                <div className="user-details">
                  <span className="username">{currentUserRank.username} (You)</span>
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