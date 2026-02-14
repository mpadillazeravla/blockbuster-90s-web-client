import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./UserMenu.css";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleGoToProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Obtener la inicial del usuario para mostrar en el avatar
  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" onClick={toggleMenu}>
        <div className="user-avatar">{getUserInitial()}</div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {isProfilePage ? (
            // En la página de perfil: mostrar info del usuario
            <>
              <div className="user-menu-info">
                <div className="user-menu-icon">
                  <FaUserCircle />
                </div>
                <div className="user-menu-details">
                  <p className="user-menu-name">{user?.username}</p>
                  <p className="user-menu-email">{user?.email}</p>
                </div>
              </div>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            // En otras páginas: mostrar opciones de navegación
            <>
              <button className="user-menu-item" onClick={handleGoToProfile}>
                <FaUser />
                <span>Mi Zona Privada</span>
              </button>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Cerrar Sesión</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
