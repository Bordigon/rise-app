import React, { useState, useMemo, useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import '../styles/ProfilePage.css';
import ProfileCategoryModal from '../components/ProfileCategoryModal.jsx';
import { userProfile } from '../services/userService.js';


import profileBackgroundImage from "../assets/img/profilepageimgs/profile-bg-16x9.webp";
import meditatingFenImg from "../assets/img/profilepageimgs/meditating-Fen.webp";
import blueEggImg from "../assets/img/profilepageimgs/eggs/blue-egg.webp";
import greenEggImg from "../assets/img/profilepageimgs/eggs/green-egg.webp";
import yellowEggImg from "../assets/img/profilepageimgs/eggs/yellow-egg.webp";
import purpleEggImg from "../assets/img/profilepageimgs/eggs/purple-egg.webp";
import redEggImg from "../assets/img/profilepageimgs/eggs/red-egg.webp";
import blueOrbImg from "../assets/img/profilepageimgs/orbs/blue-orb.webp";
import greenOrbImg from "../assets/img/profilepageimgs/orbs/green-orb.webp";
import yellowOrbImg from "../assets/img/profilepageimgs/orbs/yellow-orb.webp";
import purpleOrbImg from "../assets/img/profilepageimgs/orbs/purple-orb.webp";
import redOrbImg from "../assets/img/profilepageimgs/orbs/red-orb.webp";

// --- 2. Define Static Category Data ---
const CATEGORIES_DATA = {
  CREATIVITY: {
    key: 'CREATIVITY',
    label: 'Creativity',
    color: '#9c27b0',
    eggImg: purpleEggImg,
    orbImg: purpleOrbImg,
    description: "Creativity is the space for imagination and expression. Explore new ideas and unleash your artistic and innovative potential.",
    suggestions: [ "Write in a journal", "Draw or paint", "Play an instrument" ]
  },
  MIND: {
    key: 'MIND',
    label: 'Mind',
    color: '#00bcd4',
    eggImg: blueEggImg,
    orbImg: blueOrbImg,
    description: "Mind focuses on cognitive development and mental clarity. Explore ways to improve your concentration, memory, and emotional well-being.",
    suggestions: [ "Daily meditation", "Read non-fiction", "Learn a new language" ]
  },
  BODY: {
    key: 'BODY',
    label: 'Body',
    color: '#4CAF50',
    eggImg: greenEggImg,
    orbImg: greenOrbImg,
    description: "Body covers everything related to physical health and well-being. Staying active and nurturing your body are key to sustained energy.",
    suggestions: [ "30-minute exercise", "Drink 2 liters of water", "Sleep 7-8 hours" ]
  },
  SOCIAL: {
    key: 'SOCIAL',
    label: 'Social',
    color: '#FFC107',
    eggImg: yellowEggImg,
    orbImg: yellowOrbImg,
    description: "Social represents connection with others and strengthening relationships. A strong social circle is vital for emotional well-being.",
    suggestions: [ "Call a friend or family member", "Meet with friends", "Give someone a compliment" ]
  },
  PRODUCTIVITY: {
    key: 'PRODUCTIVITY',
    label: 'Productivity',
    color: '#ef5350',
    eggImg: redEggImg,
    orbImg: redOrbImg,
    description: "Productivity centers on efficiency and achieving goals. Optimize your time and effort to accomplish more with less stress.",
    suggestions: [ "Plan your next day", "Work in 25-minute blocks (Pomodoro)", "Organize your workspace" ]
  },
};

// --- 3. ProfilePage Component ---
function ProfilePage() {
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [userProgress, setUserProgress] = useState(null); // Inicia como null
  const [isLoading, setIsLoading] = useState(true); 

 
  useEffect(() => {
    // Función para cargar los datos del perfil desde la API
    const fetchData = async () => {
      try {
        const data = await userProfile();
        const result = {
          categoryProgress: {
            MIND: data.mind,
            BODY: data.body,
            PRODUCTIVITY: data.productivity,
            SOCIAL: data.social,
            CREATIVITY: data.creativity
          }
        };
        setUserProgress(result);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        
      }
    };

    // Función para precargar una sola imagen
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    // Lista de todas las imágenes que esta página necesita
    const imagesToPreload = [
      profileBackgroundImage,
      meditatingFenImg,
      blueEggImg, greenEggImg, yellowEggImg, purpleEggImg, redEggImg,
      blueOrbImg, greenOrbImg, yellowOrbImg, purpleOrbImg, redOrbImg
    ];

    // Carga todo en paralelo
    const loadAllAssets = async () => {
      const dataPromise = fetchData(); // Inicia la carga de datos
      const imagePromises = imagesToPreload.map(src => preloadImage(src)); // Inicia la carga de imágenes
      
      try {
        // Espera a que AMBAS cosas terminen: los datos Y TODAS las imágenes
        await Promise.all([dataPromise, ...imagePromises]);
      } catch (error) {
        console.error("Error preloading assets:", error);
      } finally {
        // Cuando todo esté listo (incluso si algo falló), quita el spinner
        setIsLoading(false);
      }
    };

    loadAllAssets();
  }, []); // El array vacío [] asegura que esto solo se ejecute UNA VEZ

  const eggsToRender = [
    CATEGORIES_DATA.CREATIVITY,
    CATEGORIES_DATA.MIND,
    CATEGORIES_DATA.BODY,
    CATEGORIES_DATA.SOCIAL,
    CATEGORIES_DATA.PRODUCTIVITY,
  ];

  const selectedCategory = activeCategoryKey ? CATEGORIES_DATA[activeCategoryKey] : null;

  // --- 5. Renderizado Condicional ---
  if (isLoading) {
    return (
      <div className="profile-wrapper-loading">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Esto solo se renderiza si isLoading es false
  return (
    <div className="profile-wrapper">
      <div
          className="profile-background"
          style={{ backgroundImage: `url(${profileBackgroundImage})` }}
      />

      <section className="profile-stage">
        <img
          src={meditatingFenImg}
          alt="Meditating Fen"
          className="fen"
          draggable="false"
        />

        <ul className="egg-pyramid">
          {eggsToRender.map((eggData, index) => (
            <li key={eggData.key} className={`egg-slot egg-${index}`}>
              <button
                className="egg"
                onClick={() => setActiveCategoryKey(eggData.key)}
                aria-label={eggData.label}
              >
                <img src={eggData.eggImg} alt={`${eggData.label} egg`} draggable="false" />
                <span className="egg-label">{eggData.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* El modal solo se renderiza si hay una categoría Y los datos de progreso están listos */}
      {selectedCategory && userProgress && (
        <ProfileCategoryModal
          show={!!selectedCategory}
          category={selectedCategory}
          allCategoriesData={CATEGORIES_DATA}
          profileProgress={userProgress.categoryProgress}
          onClose={() => setActiveCategoryKey(null)}
        />
      )}
    </div>
  );
}

export default ProfilePage;