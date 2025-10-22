// src/front/pages/LandingPage.jsx
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import RiseLandingPageLogo from '../assets/img/RiseLandingPageLogo.png';
import Button from '../components/commons/Button.jsx';
import "../styles/LandingPage.css";



function LandingPage() {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    if (store.token) {
        return <Navigate to="/dashboard" replace />; 
    }

    return (
        <div className="landing-page-container container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 p-3">
            <div className="text-center" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="mb-4">
                    <img
                        src={RiseLandingPageLogo}
                        alt="RISE Logo with Phineas the Phoenix"
                        className="img-fluid landing-logo"
                        style={{ maxWidth: '400px' }}
                    />
                </div>
                <p className="landing-slogan lead text-center mb-5 mx-auto" style={{ maxWidth: '450px' }}>
                    Elevate your habits, master your days, and transform your life!
                </p>
                <div className="landing-buttons d-grid gap-3 col-10 col-md-6 col-lg-5 mx-auto">
                    {/* ESTE BOTÓN DEBE SER 'primary' */}
                    <Button size="lg" variant="primary" onClick={() => navigate('/register')}>
                        START YOUR ASCENT
                    </Button>
                    {/* Este es 'secondary-outline' (que ahora quieres con fondo, lo veremos en CSS) */}
                    <Button size="lg" variant="secondary-outline" onClick={() => navigate('/login')}>
                        I'M ALREADY A PHOENIX
                    </Button>
                </div>
            </div>

            {/* Footer con los pilares */}
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