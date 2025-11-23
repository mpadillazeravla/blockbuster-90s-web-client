import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="app-logo">
          <h1>Blockbuster 90s</h1>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/login" className="nav-link">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="nav-link">
          Registrarse
        </Link>

        {/* Implement later */}
        {/* {isLoggedIn && (
            <Link to="/profile" className="nav-link">Mi Perfil</Link>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
