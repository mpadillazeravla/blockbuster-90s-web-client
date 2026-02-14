import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";

export const useUserMovies = () => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const navigate = useNavigate();

  const handleToggleFavorite = async (movieId) => {
    if (!isAuthenticated || !user?.id) {
      // Redirigir a login si no está autenticado o no tiene ID
      navigate("/login");
      return;
    }

    try {
      const isFavorite = user?.favorites?.includes(movieId);

      if (isFavorite) {
        await apiService.removeFromFavorites(user.id, movieId);
      } else {
        await apiService.addToFavorites(user.id, movieId);
      }

      await updateUserData();
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      alert(error.message || "Error al actualizar favoritos");
    }
  };

  const handleToggleWatched = async (movieId) => {
    if (!isAuthenticated || !user?.id) {
      // Redirigir a login si no está autenticado o no tiene ID
      navigate("/login");
      return;
    }

    try {
      const isWatched = user?.watched?.includes(movieId);

      if (isWatched) {
        await apiService.removeFromWatched(user.id, movieId);
      } else {
        await apiService.addToWatched(user.id, movieId);
      }

      await updateUserData();
    } catch (error) {
      console.error("Error al actualizar películas vistas:", error);
      alert(error.message || "Error al actualizar películas vistas");
    }
  };

  const isFavorite = (movieId) => {
    return user?.favorites?.includes(movieId) || false;
  };

  const isWatched = (movieId) => {
    return user?.watched?.includes(movieId) || false;
  };

  return {
    handleToggleFavorite,
    handleToggleWatched,
    isFavorite,
    isWatched,
    isAuthenticated,
    userFavorites: user?.favorites || [],
    userWatched: user?.watched || [],
  };
};
