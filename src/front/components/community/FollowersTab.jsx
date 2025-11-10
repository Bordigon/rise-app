import React, { useEffect, useMemo, useRef, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/LeaderboardTab.css";
import "../../styles/FollowersTab.css";
import { followersGet } from "../../services/followerService";

/* ===== Cuando conectes backend, descomenta e integra ===== */
// import { getFollowers } from "../../services/userService.js"; 
//   // getFollowers(userId) => devuelve array de usuarios [{ id, username, avatar, ... }]

/* Toggle mock/backend */
const USE_MOCK = false;

export default function FollowersTab() {
  const { store } = useGlobalReducer();
  const currentUser = store.user || { id: 1, name: "PhoenixPlayer" };

  const [allFollowers, setAllFollowers] = useState([]); // solo gente que te sigue
  const [searchTerm, setSearchTerm] = useState("");

  const [fetchLoading, setFetchLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [error, setError] = useState(null);
  const assetsLoadIdRef = useRef(0);

  // -------- MOCK --------
  const loadMock = async () => {
    // Mismo mock base que venimos usando
    const MOCK_LEADERBOARD = [
      { id: 10, username: "PhoenixKing", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixKing` },
      { id: 12, username: "HabitQueen", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitQueen` },
      { id: 2, username: "RiseUser", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=RiseUser` },
      { id: 1, username: "PhoenixPlayer", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixPlayer` },
      { id: 8, username: "StreakMaster", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=StreakMaster` },
      { id: 5, username: "GoalSetter", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=GoalSetter` },
      { id: 11, username: "MindfulMona", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=MindfulMona` },
      { id: 13, username: "BodyBuilderBob", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=BodyBuilderBob` },
      { id: 14, username: "CreativeCat", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=CreativeCat` },
      { id: 15, username: "SocialButterfly", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=SocialButterfly` },
      { id: 16, username: "ProductivePanda", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ProductivePanda` },
      { id: 17, username: "ZenZebra", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ZenZebra` },
      { id: 18, username: "ExplorerElf", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ExplorerElf` },
      { id: 19, username: "DreamerDragon", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=DreamerDragon` },
      { id: 20, username: "LearnerLion", avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=LearnerLion` },
    ];

    // IDs que “te siguen” (elige los que quieras del mock)
    const MOCK_FOLLOWER_IDS = new Set([12, 15, 18, 20, 2]); // HabitQueen, SocialButterfly, ExplorerElf, LearnerLion, RiseUser

    const followersOnly = MOCK_LEADERBOARD
      .filter(u => MOCK_FOLLOWER_IDS.has(u.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    setAllFollowers(followersOnly);
  };

  // ======== REAL (descomentar cuando tengas backend) ========
  const loadReal = async () => {
    try {
      setError(null);
      const followers = await followersGet(currentUser?.id);
      // Asegúrate de que el service ya devuelva [{ id, username, avatar, ... }]
      const ordered = (followers || []).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setAllFollowers(ordered);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load followers");
    }
  };
  //============================================================ 

  // Cargar datos
  useEffect(() => {
    let t;
    (async () => {
      setFetchLoading(true);
      if (USE_MOCK) {
        await loadMock();
      } else {
        await loadReal();
      }
      t = setTimeout(() => setFetchLoading(false), 300);
    })();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // Filtrado por username
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allFollowers;
    return allFollowers.filter(u => (u.name || "").toLowerCase().includes(q));
  }, [allFollowers, searchTerm]);

  // Precarga de avatares visibles
  useEffect(() => {
    if (fetchLoading) return;
    const thisLoad = ++assetsLoadIdRef.current;
    setAssetsLoading(true);

    const preloadImage = (src) =>
      new Promise((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });

    const MAX = 80;
    const visible = filtered.slice(0, MAX);
    const avatars = visible.map(u => u.avatar);

    (async () => {
      try {
        await Promise.all(avatars.map(preloadImage));
      } finally {
        if (assetsLoadIdRef.current === thisLoad) setAssetsLoading(false);
      }
    })();
  }, [filtered, fetchLoading]);

  if (fetchLoading || assetsLoading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner-border text-light" role="status" aria-label="Loading followers">
          <span className="visually-hidden">Loading...</span>
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
        placeholder="Search your followers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="leaderboard-list">
        {filtered > 0 ? (
          filtered.map((user) => {
            const isMe = user.id === currentUser?.id;
            return (
              <li key={user.id} className={`leaderboard-row ${isMe ? "current-user-highlight" : ""}`}>
                {/* mantenemos la columna de rank para alinear con el resto de tabs */}
                <div className="rank-section" />
                <div className="user-info-section">
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`}
                    alt="avatar"
                    className="avatar-medium"
                    draggable="false"
                  />
                  <div className="user-details">
                    <span className="username">{user.name}</span>
                  </div>
                </div>
                {/* No hay botones de acción en Followers */}
                <div className="followers-right-spacer" />
              </li>
            );
          })
        ) : (
          <p className="text-center mt-2">You have no followers by now</p>
        )}
      </ul>
    </div>
  );
}
