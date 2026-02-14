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
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Refrescar datos del usuario desde el backend para tener favorites/watched actualizados
          const userId = parsedUser.id || parsedUser._id;
          if (userId) {
            const response = await apiService.getUserData(userId);
            const refreshedUser = {
              ...(response.user || response),
              favorites: (response.favorites || []).map(Number),
              watched: (response.watched || []).map(Number),
              id:
                response.user?.id ||
                response.user?._id ||
                response.id ||
                response._id,
            };
            localStorage.setItem("user", JSON.stringify(refreshedUser));
            setUser(refreshedUser);
          }
        } catch (error) {
          console.error("Error al inicializar usuario:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const register = async (userData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiService.register(userData);
      const userId = response.user.id || response.user._id;

      // Guardar token
      localStorage.setItem("token", response.token);

      // Obtener datos completos del usuario (favorites/watched) desde el backend
      const fullData = await apiService.getUserData(userId);
      const normalizedUser = {
        ...(fullData.user || fullData),
        id: userId,
        favorites: (fullData.favorites || []).map(Number),
        watched: (fullData.watched || []).map(Number),
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiService.login(credentials);
      const userId = response.user.id || response.user._id;

      // Guardar token
      localStorage.setItem("token", response.token);

      // Obtener datos completos del usuario (favorites/watched) desde el backend
      const fullData = await apiService.getUserData(userId);
      const normalizedUser = {
        ...(fullData.user || fullData),
        id: userId,
        favorites: (fullData.favorites || []).map(Number),
        watched: (fullData.watched || []).map(Number),
      };

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
