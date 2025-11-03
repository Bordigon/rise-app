import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PublicNavbar.css';
import phoenixHappy from "../assets/img/dashboardpageimgs/phoenix-happy.png";
import Button from '../components/commons/Button.jsx';

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="public-navbar">
      <div className="public-navbar-content">
        <Link to="/" className="navbar-logo-link">
          <img src={phoenixHappy} alt="FEN Phoenix" className="navbar-logo-img" />
          <span className="navbar-logo-text">RISE</span>
        </Link>
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => navigate('/register')}
        >
          GET STARTED
        </Button>
      </div>
    </nav>
  );
}