import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import RiseLandingPageLogo from '../assets/img/publicpagesimgs/RiseLandingPageLogo.webp';
import Button from '../components/commons/Button.jsx';
import "../styles/LandingPage.css";
import "../styles/PublicNavbar.css"; // Asegúrate de importar el CSS del Navbar
import PublicNavbar from '../components/PublicNavbar.jsx';

// --- Importa tus imágenes de características ---
// ¡¡¡RUTAS CORREGIDAS!!! (Asumiendo que las imágenes se llaman así)
import featureImageTasks from '../assets/img/publicpagesimgs/featureImageTasks.png'; 
import featureImageProfile from '../assets/img/publicpagesimgs/featureImageProfile.png'; 
import featureImageCommunity from '../assets/img/publicpagesimgs/featureImageCommunity.png'; 
import winkingPhoenix from '../assets/img/publicpagesimgs/winkingPhoenix.webp'; 


function LandingPage() {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    if (store.token) {
        return <Navigate to="/dashboard" replace />; 
    }

    return (
        // Wrapper principal para la página
        <div className="landing-page-wrapper">
            {/* --- Sección 1: Hero --- */}
            <section className="hero-section">
                <div className="hero-content">
                    <div>
                        <img
                            src={RiseLandingPageLogo}
                            alt="RISE Logo with Phineas the Phoenix"
                            className="img-fluid landing-logo"
                        />
                    </div>
                    
                    <p className="landing-slogan display-6 text-center mb-4 mx-auto">
                        Elevate your habits, master your days, and transform your life!
                    </p>
                
                    <div className="landing-buttons d-grid gap-3 display-flex justify-content-center mx-auto"> 
                        <Button 
                            size="lg" 
                            variant="primary" 
                            onClick={() => navigate('/register')}
                            fullWidth>
                            GET STARTED
                        </Button>
                        <Button 
                            size="lg" 
                            variant="secondary-outline" 
                            onClick={() => navigate('/login')}
                            fullWidth>
                            I ALREADY HAVE AN ACCOUNT 
                        </Button>
                    </div>
                </div>
            </section>
            {/* --- Fin de la Sección Hero --- */}


            {/* --- Sección 2: Característica (Gamified Tasks) --- */}
            <section className="feature-section feature-section-alt">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center">
                            <img src={featureImageTasks} alt="Gamified Habit Tracking" className="feature-image" />
                        </div>
                        <div className="col-md-6">
                            <div className="feature-text">
                                <h1 className="display-4" style={{ color: 'var(--orange)' }}>Gamify your habits</h1>
                                <p className="fs-5">
                                    Turn your real-life goals into a game. Complete daily tasks to earn XP, watch your Phoenix eggs hatch, and keep your streak alive!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Sección 3: Característica (Profile & Skills) --- */}
            <section className="feature-section">
                <div className="container">
                    <div className="row align-items-center flex-row-reverse">
                        <div className="col-md-6 text-center">
                            <img src={featureImageProfile} alt="Profile Stats View" className="feature-image" />
                        </div>
                        <div className="col-md-6">
                            <div className="feature-text">
                                <h1 className="display-4" style={{ color: 'var(--purple-900)' }}>Level up your life</h1>
                                <p className="fs-5">
                                    Track your growth across 5 key areas: Mind, Body, Productivity, Social, and Creativity. Use your profile's radar chart to see your stats.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Sección 4: Característica (Community) --- */}
            <section className="feature-section feature-section-alt">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center">
                            <img src={featureImageCommunity} alt="Community and Friends" className="feature-image" />
                        </div>
                        <div className="col-md-6">
                            <div className="feature-text">
                                <h1 className="display-4" style={{ color: 'var(--orange-2)' }}>Grow with your community</h1>
                                <p className="fs-5">
                                    You're not alone! Compete on the leaderboard, find and add friends, and build a supportive community to help you on your journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Sección 5: Cierre (con Fénix guiñando) --- */}
            <section className="hero-section">
                 <div className="hero-content">
                    <div className="mb-4">
                        <img
                            src={winkingPhoenix}
                            alt="RISE Phoenix Winking"
                            className="img-fluid landing-logo-small"
                        />
                    </div>

                    <div className="landing-buttons d-grid gap-3 justify-content-center mx-auto mt-4"> 
                        <h3>Start your ascent today!
                        </h3>

                        <Button 
                            size="lg" 
                            variant="primary" 
                            onClick={() => navigate('/register')}
                            fullWidth>
                            GET STARTED
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- Sección 6: Footer --- */}
            <div className="landing-footer">
                <div className="footer-item-list">
                    <div className="footer-item">🧠 Mind</div>
                    <div className="footer-item">💪 Body</div>
                    <div className="footer-item">🚀 Productivity</div>
                    <div className="footer-item">❤️ Social</div>
                    <div className="footer-item">🎨 Creativity</div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;