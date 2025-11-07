import React, { useState, useEffect, useMemo, useRef } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import '../../styles/LeaderboardTab.css';

import { getUsers } from '../../services/userService.js';
import goldenEgg from '../../assets/img/communitypageimgs/golden-egg.webp';
import silverEgg from '../../assets/img/communitypageimgs/silver-egg.webp';
import bronzeEgg from '../../assets/img/communitypageimgs/bronze-egg.webp';

export default function LeaderboardTab() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { store } = useGlobalReducer();
  const currentUser = store.user;
  const token = store.token;

  const assetsLoadIdRef = useRef(0);

  const handleGetData = async () => {
    try {
      setError(null);
      setFetchLoading(true);
      const data = await getUsers();
      const rankedList = (data || [])
        .sort((a, b) => (b.level || 0) - (a.level || 0))
        .map((user, index) => ({ ...user, rank: index + 1 }));
      setLeaderboardData(rankedList);
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to fetch leaderboard');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredLeaderboard = useMemo(() => {
    if (!searchTerm) return leaderboardData;
    const q = searchTerm.toLowerCase();
    return leaderboardData.filter(user => (user.name || '').toLowerCase().includes(q));
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

  // -------- Precarga de assets visibles (medallas + avatares de la vista actual) --------
  useEffect(() => {
    if (fetchLoading) return; // espera a tener los datos

    const thisLoad = ++assetsLoadIdRef.current;
    setAssetsLoading(true);

    const preloadImage = (src) =>
      new Promise((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });

    const MAX = 120; // límite de seguridad
    const visible = filteredLeaderboard.slice(0, MAX);

    // Avatares (fallback dicebear si no hay avatar)
    const avatarOf = (u) =>
      u.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(u.name || 'user')}`;

    // Medallas que realmente aparecerán en la vista visible
    const medals = new Set(
      visible.map(u => getRankMedal(u.rank)).filter(Boolean)
    );

    const urls = [
      ...Array.from(medals),
      ...visible.map(avatarOf),
    ];

    (async () => {
      try {
        await Promise.all(urls.map(preloadImage));
      } finally {
        if (assetsLoadIdRef.current === thisLoad) setAssetsLoading(false);
      }
    })();
  }, [filteredLeaderboard, fetchLoading]);

  if (fetchLoading || assetsLoading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner-border text-light" role="status" aria-label="Loading leaderboard">
        </div>
      </div>
    );
  }

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
            const avatarSrc =
              user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.name || 'user')}`;

            return (
              <li
                key={user.id}
                className={`leaderboard-row ${rankClass} ${isCurrentUser ? 'current-user-highlight' : ''}`}
              >
                <div className="rank-section">
                  {medal ? (
                    <img src={medal} alt={`${user.rank} place`} className="rank-medal" draggable="false" />
                  ) : (
                    <span className="rank-number">{user.rank}</span>
                  )}
                </div>
                <div className="user-info-section">
                  <img src={avatarSrc} alt="avatar" className="avatar-medium" draggable="false" />
                  <div className="user-details">
                    <span className="username">{user.name}</span>
                    {/* <span className="level">Level {user.level}</span> */}
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
                <span className="rank-number">N/A</span>
              </div>
              <div className="user-info-section">
                <img
                  src={
                    currentUserRank.avatar ||
                    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(currentUserRank.name || 'you')}`
                  }
                  alt="avatar"
                  className="avatar-medium"
                  draggable="false"
                />
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
