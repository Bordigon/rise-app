import React, { useEffect, useMemo, useRef, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/LeaderboardTab.css";
import "../../styles/FollowingTab.css";
import { followingNew, followingsGet } from "../../services/followerService";
import { getUsers } from "../../services/userService";

/* ======== CUANDO CONECTES BACKEND, DESCOMENTA ======== */
// import { getUsers, getFollowing, followUser } from "../../services/userService.js";

/* ======== TOGGLE: modo mock/real ======== */
const USE_MOCK = false;

export default function FollowingTab() {
  const { store } = useGlobalReducer();
  // Fallback por si aún no tienes user en store
  const currentUser = store.user || { id: 1, name: "PhoenixPlayer" };

  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [error, setError] = useState(null);

  const assetsLoadIdRef = useRef(0);

  /* ===================== MOCK DATA ===================== */
  const loadMock = async () => {
    const MOCK_LEADERBOARD = [
      { id: 10, username: "PhoenixKing", level: 15, xp: 15000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixKing` },
      { id: 12, username: "HabitQueen", level: 14, xp: 14200, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitQueen` },
      { id: 2, username: "RiseUser", level: 12, xp: 12100, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=RiseUser` },
      { id: 1, username: "PhoenixPlayer", level: 5, xp: 7500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PhoenixPlayer` }, // tú
      { id: 8, username: "StreakMaster", level: 4, xp: 4300, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=StreakMaster` },
      { id: 5, username: "GoalSetter", level: 1, xp: 1000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=GoalSetter` },
      { id: 11, username: "MindfulMona", level: 3, xp: 3500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=MindfulMona` },
      { id: 13, username: "BodyBuilderBob", level: 7, xp: 8200, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=BodyBuilderBob` },
      { id: 14, username: "CreativeCat", level: 9, xp: 9800, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=CreativeCat` },
      { id: 15, username: "SocialButterfly", level: 6, xp: 6000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=SocialButterfly` },
      { id: 16, username: "ProductivePanda", level: 10, xp: 10500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ProductivePanda` },
      { id: 17, username: "ZenZebra", level: 2, xp: 2000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ZenZebra` },
      { id: 18, username: "ExplorerElf", level: 8, xp: 9000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=ExplorerElf` },
      { id: 19, username: "DreamerDragon", level: 11, xp: 11500, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=DreamerDragon` },
      { id: 20, username: "LearnerLion", level: 13, xp: 13000, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=LearnerLion` },
    ];
    const MOCK_FOLLOWING = new Set([10, 12, 2]); // ya sigues a: PhoenixKing, HabitQueen, RiseUser
    setAllUsers(MOCK_LEADERBOARD);
    setFollowingIds(MOCK_FOLLOWING);
  };

  // ===================== FETCH REAL (COMENTADO) =====================
  const loadReal = async () => {
    try {
      setError(null);
      // 1) Traer todos los usuarios
      const users = await getUsers(); // [{id, username, avatar, ...}]
      // 2) Traer a quién sigo yo
      const following = await followingsGet(currentUser?.id); // p.ej. [{id:10}, {id:12}] o [10,12]
      const ids = new Set(
        Array.isArray(following) ? following.map(f => (typeof f === "object" ? f.id : f)) : []
      );
      setAllUsers(users || []);
      setFollowingIds(ids);
    } catch (e) {
      setError(e?.message || "Failed to load users/following");
    }
  };
  //=================================================================== 

  // Cargar datos (mock o reales)
  useEffect(() => {
    let t;
    (async () => {
      setLoading(true);
      if (USE_MOCK) {
        await loadMock();
      } else {
        await loadReal();
      }
      // pequeño delay para ver loader
      t = setTimeout(() => setLoading(false), 300);
    })();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrado: vacío → solo seguidos; con texto → todos los que incluyan la secuencia (en username)
  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return allUsers
        .filter(u => followingIds.has(u.id))
        .sort((a, b) => (a.namee || "").localeCompare(b.name || ""));
    }
    const matches = allUsers.filter(u => (u.name || "").toLowerCase().includes(q));
    // Primero seguidos, luego no seguidos
    return matches.sort((a, b) => {
      const af = followingIds.has(a.id) ? 0 : 1;
      const bf = followingIds.has(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [allUsers, followingIds, searchTerm]);

  // Acción de follow
  const handleFollow = async (userId) => {
    if (USE_MOCK) {
      // MOCK: solo actualiza estado local
      setFollowingIds(prev => new Set(prev).add(userId));
      return;
    }
    // ======== REAL (descomenta al conectar) ========
    try {
      await followingNew(userId);
      setFollowingIds(prev => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to follow user");
    }
    //================================================= */
  };

  // Precarga de avatares visibles (evita flicker)
  useEffect(() => {
    if (loading) return;
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
    const visible = filteredUsers.slice(0, MAX);
    const avatars = visible.map(u => u.avatar);

    (async () => {
      await Promise.all(avatars.map(preloadImage));
      if (assetsLoadIdRef.current === thisLoad) setAssetsLoading(false);
    })();
  }, [filteredUsers, loading]);

  if (loading || assetsLoading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner-border text-light" role="status" aria-label="Loading users">

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
        placeholder="Search users to follow..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="leaderboard-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isMe = user.id === currentUser?.id;
            const isFollowing = followingIds.has(user.id);
            return (
              <li key={user.id} className={`leaderboard-row ${isMe ? "current-user-highlight" : ""}`}>
                {/* sin medallas/rank → mantenemos columna para alinear */}
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

                <div className="follow-actions">
                  {isMe ? (
                    <span className="following-pill me">You</span>
                  ) : isFollowing ? (
                    <span className="following-pill">Following</span>
                  ) : (
                    <button
                      type="button"
                      className="follow-btn"
                      onClick={() => handleFollow(user.id)}
                      aria-label={`Follow ${user.name}`}
                    >
                      +
                    </button>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center text-muted">No users match your search.</p>
        )}
      </ul>
    </div>
  );
}
