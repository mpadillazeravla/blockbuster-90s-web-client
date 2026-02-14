import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "../UserMenu/UserMenu";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="app-logo">
          <h1>Blockbuster 90s</h1>
        </Link>
      </div>

      <div className="navbar-links">
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="nav-link">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
