import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import RiseLandingPageLogo from '../assets/img/publicpagesimgs/RiseLandingPageLogo.png';
import Button from '../components/commons/Button.jsx';
import "../styles/AuthPages.css";
import { userLogin } from '../services/userService.js';
import { taskList } from '../services/taskService.js';

function LoginPage() {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer(); // Get dispatch

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = { email: email, password: password }
      const data = await userLogin(body);
      var user = JSON.stringify(data.user);
      console.log("console.log del user")
      console.log(data.refresh_token);
      const listaTask = await taskList()

      // Dispatch the action to the store reducer
      await dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: user, token: data.token, refresh_token: data.refresh_token, tasks: listaTask }
      });


      navigate("/dashboard"); // Redirect after successful dispatch
    } catch (err) {
      console.error("Login failed:", err); // Log the actual error
      setError("Error al iniciar sesión. Verifica tus credenciales." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added class for specific styling
    <div className="auth-page-container d-flex flex-column align-items-center justify-content-center min-vh-100 p-3">
      {/* Logo and Slogan */}
      <div className="text-center mb-4">
        <img
          src={RiseLandingPageLogo}
          alt="RISE Logo"
          className="img-fluid auth-logo" // Added class
          style={{ maxWidth: '200px', marginBottom: '1rem' }}
        />
      </div>
      <p className="auth-slogan lead text-center mb-5 mx-auto" style={{ maxWidth: '400px' }}>
        Elevate your habits, master your days, and transform your life!
      </p>

      {/* Login Card */}
      <div className="auth-card card shadow-lg p-4" style={{ maxWidth: '380px', width: '100%' }}>
        <h2 className="card-title text-center h4 mb-4">Log In</h2>

        {error && <p className="text-danger text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-muted">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control custom-input" // Use custom input style if defined
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-muted">Password</label>
            <input
              type="password"
              id="password"
              className="form-control custom-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2">
            <Button type="submit" size="lg" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Logging in…' : 'LOG IN'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="btn btn-link btn-link-rise">
            You don't have an account? Sign Up!
          </Link>
        </div>
      </div>

      {/* Footer section (using CSS for positioning) */}
      <div className="auth-footer">
        <div className="auth-footer-item-list">
          <div className="auth-footer-item">🧠 Mind</div>
          <div className="auth-footer-item">💪 Body</div>
          <div className="auth-footer-item">🚀 Productivity</div>
          <div className="auth-footer-item">❤️ Social</div>
          <div className="auth-footer-item">🎨 Creativity</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;