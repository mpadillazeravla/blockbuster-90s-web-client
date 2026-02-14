import { createContext, useState, useContext, useEffect } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage al cargar
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);

      // Normalizar el usuario para asegurar que tenga un campo 'id'
      const normalizedUser = {
        ...response.user,
        id: response.user.id || response.user._id,
      };

      // Guardar token y usuario
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);

      // Normalizar el usuario para asegurar que tenga un campo 'id'
      const normalizedUser = {
        ...response.user,
        id: response.user.id || response.user._id,
      };

      // Guardar token y usuario
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar info del usuario
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateUserData = async () => {
    if (!user) {
      console.error("No user in updateUserData");
      return;
    }

    const userId = user.id || user._id;

    if (!userId) {
      console.error("User ID not found:", user);
      return;
    }

    try {
      const response = await apiService.getUserData(userId);

      const normalizedUser = {
        ...(response.user || response),
        favorites: response.favorites || [],
        watched: response.watched || [],
        id:
          response.user?.id ||
          response.user?._id ||
          response.id ||
          response._id,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserData,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
