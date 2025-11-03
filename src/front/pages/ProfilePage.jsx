import React, { useState, useMemo, useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx'; // Make sure this hook is correctly implemented
import '../styles/ProfilePage.css';
import ProfileCategoryModal from '../components/ProfileCategoryModal.jsx';

// --- 1. Import All Assets ---
// Main Assets
import profileBackgroundImage from "../assets/img/profilepageimgs/profile-bg-16x9.png";
import meditatingFenImg from "../assets/img/profilepageimgs/meditating-Fen.png";

// Egg Assets (from the 'eggs' subfolder)
import blueEggImg from "../assets/img/profilepageimgs/eggs/blue-egg.png";
import greenEggImg from "../assets/img/profilepageimgs/eggs/green-egg.png";
import yellowEggImg from "../assets/img/profilepageimgs/eggs/yellow-egg.png";
import purpleEggImg from "../assets/img/profilepageimgs/eggs/purple-egg.png";
import redEggImg from "../assets/img/profilepageimgs/eggs/red-egg.png";

// Orb Assets (from the 'orbs' subfolder)
// **PLEASE DOUBLE CHECK THESE PATHS AND FILENAMES**
import blueOrbImg from "../assets/img/profilepageimgs/orbs/blue-orb.png";
import greenOrbImg from "../assets/img/profilepageimgs/orbs/green-orb.png";
import yellowOrbImg from "../assets/img/profilepageimgs/orbs/yellow-orb.png";
import purpleOrbImg from "../assets/img/profilepageimgs/orbs/purple-orb.png";
import redOrbImg from "../assets/img/profilepageimgs/orbs/red-orb.png";
import { userProfile } from '../services/userService.js';

// --- 2. Define Static Category Data ---
const CATEGORIES_DATA = {
  CREATIVITY: {
    key: 'CREATIVITY',
    label: 'Creativity',
    color: '#9c27b0', // Purple
    eggImg: purpleEggImg,
    orbImg: purpleOrbImg, // Make sure this path is correct
    description: "Creativity is the space for imagination and expression. Explore new ideas and unleash your artistic and innovative potential.",
    suggestions: [ "Write in a journal", "Draw or paint", "Play an instrument" ]
  },
  MIND: {
    key: 'MIND',
    label: 'Mind',
    color: '#00bcd4', // Blue
    eggImg: blueEggImg,
    orbImg: blueOrbImg, // Make sure this path is correct
    description: "Mind focuses on cognitive development and mental clarity. Explore ways to improve your concentration, memory, and emotional well-being.",
    suggestions: [ "Daily meditation", "Read non-fiction", "Learn a new language" ]
  },
  BODY: {
    key: 'BODY',
    label: 'Body',
    color: '#4CAF50', // Green
    eggImg: greenEggImg,
    orbImg: greenOrbImg, // Make sure this path is correct
    description: "Body covers everything related to physical health and well-being. Staying active and nurturing your body are key to sustained energy.",
    suggestions: [ "30-minute exercise", "Drink 2 liters of water", "Sleep 7-8 hours" ]
  },
  SOCIAL: {
    key: 'SOCIAL',
    label: 'Social',
    color: '#FFC107', // Yellow
    eggImg: yellowEggImg,
    orbImg: yellowOrbImg, // Make sure this path is correct
    description: "Social represents connection with others and strengthening relationships. A strong social circle is vital for emotional well-being.",
    suggestions: [ "Call a friend or family member", "Meet with friends", "Give someone a compliment" ]
  },
  PRODUCTIVITY: {
    key: 'PRODUCTIVITY',
    label: 'Productivity',
    color: '#ef5350', // Red
    eggImg: redEggImg,
    orbImg: redOrbImg, // Make sure this path is correct
    description: "Productivity centers on efficiency and achieving goals. Optimize your time and effort to accomplish more with less stress.",
    suggestions: [ "Plan your next day", "Work in 25-minute blocks (Pomodoro)", "Organize your workspace" ]
  },
};

// Mock data for user's progress (replace with API/store data later)
const MOCK_USER_PROGRESS = {
  categoryProgress: {
    MIND: 70,
    BODY: 100,
    PRODUCTIVITY: 80,
    SOCIAL: 40,
    CREATIVITY: 30
  }
};

// --- 3. ProfilePage Component ---
function ProfilePage() {
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [userProgress, setUserProgress] = useState(MOCK_USER_PROGRESS);

  const handleGetUserProgress = async()=>{
    const data = await userProfile();
    console.log(data)
    const result = {categoryProgress:{
      MIND: data.mind,
    BODY: data.body,
    PRODUCTIVITY: data.productivity,
    SOCIAL: data.social,
    CREATIVITY: data.creativity
    }}
    setUserProgress(result)
    return data;
  }

  useEffect(()=>{
    handleGetUserProgress()
  },[])

  const eggsToRender = [
    CATEGORIES_DATA.CREATIVITY,
    CATEGORIES_DATA.MIND,
    CATEGORIES_DATA.BODY,
    CATEGORIES_DATA.SOCIAL,
    CATEGORIES_DATA.PRODUCTIVITY,
  ];

  const selectedCategory = activeCategoryKey ? CATEGORIES_DATA[activeCategoryKey] : null;

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

      {selectedCategory && (
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