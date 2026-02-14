import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import { tmdbService } from "../../services/tmdbService";
import MovieCard from "../../components/MovieCard/MovieCard";
import Spinner from "../../components/Spinner/Spinner";
import AddMovieModal from "../../components/AddMovieModal/AddMovieModal";
import "./ProfileView.css";

const ProfileView = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("favorites");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        throw new Error("ID de usuario no disponible");
      }

      // Obtener datos del usuario desde el backend
      const response = await apiService.getUserData(user.id);

      const normalizedData = {
        ...(response.user || response),
        favorites: response.favorites || [],
        watched: response.watched || [],
      };

      setUserData(normalizedData);

      // Cargar detalles de películas favoritas desde TMDB
      if (normalizedData.favorites && normalizedData.favorites.length > 0) {
        const favoritesDetails = await Promise.all(
          normalizedData.favorites.map((movieId) =>
            tmdbService.getMovieDetails(movieId).catch(() => null),
          ),
        );
        setFavoriteMovies(favoritesDetails.filter((movie) => movie !== null));
      } else {
        setFavoriteMovies([]);
      }

      // Cargar detalles de películas vistas desde TMDB
      if (normalizedData.watched && normalizedData.watched.length > 0) {
        const watchedDetails = await Promise.all(
          normalizedData.watched.map((movieId) =>
            tmdbService.getMovieDetails(movieId).catch(() => null),
          ),
        );
        setWatchedMovies(watchedDetails.filter((movie) => movie !== null));
      } else {
        setWatchedMovies([]);
      }
    } catch (err) {
      setError(err.message || "Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (movieId) => {
    try {
      if (!user?.id) {
        throw new Error("Usuario no autenticado correctamente");
      }

      const isFavorite = userData.favorites.includes(movieId);

      if (isFavorite) {
        await apiService.removeFromFavorites(user.id, movieId);
      } else {
        await apiService.addToFavorites(user.id, movieId);
      }

      // Recargar datos
      await loadUserData();
      await updateUserData();
    } catch (err) {
      console.error("Error in handleToggleFavorite:", err);
      setError(err.message || "Error al actualizar favoritos");
    }
  };

  const handleToggleWatched = async (movieId) => {
    try {
      if (!user?.id) {
        throw new Error("Usuario no autenticado correctamente");
      }

      const isWatched = userData.watched.includes(movieId);

      if (isWatched) {
        await apiService.removeFromWatched(user.id, movieId);
      } else {
        await apiService.addToWatched(user.id, movieId);
      }

      // Recargar datos
      await loadUserData();
      await updateUserData();
    } catch (err) {
      console.error("Error in handleToggleWatched:", err);
      setError(err.message || "Error al actualizar películas vistas");
    }
  };

  if (loading) {
    return (
      <div className="profile-view">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-view">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={loadUserData} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view">
      {/* Tabs para cambiar entre favoritos y vistas */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Películas Favoritas ({favoriteMovies.length})
        </button>
        <button
          className={`tab-button ${activeTab === "watched" ? "active" : ""}`}
          onClick={() => setActiveTab("watched")}
        >
          Películas Vistas ({watchedMovies.length})
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="tab-content">
        {activeTab === "favorites" && (
          <div className="movies-section">
            <div className="movies-grid">
              {favoriteMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={userData?.favorites.includes(movie.id)}
                  isWatched={userData?.watched.includes(movie.id)}
                  onToggleFavorite={() => handleToggleFavorite(movie.id)}
                  onToggleWatched={() => handleToggleWatched(movie.id)}
                  linkState={{ from: "profile" }}
                />
              ))}

              {/* Botón para añadir películas */}
              <button
                className="add-movie-button"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus />
                <span>Añadir Película</span>
              </button>
            </div>

            {favoriteMovies.length === 0 && (
              <div className="empty-state">
                <p>No tienes películas favoritas aún</p>
                <p className="empty-hint">
                  Haz clic en el botón + para añadir películas favoritas
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "watched" && (
          <div className="movies-section">
            <div className="movies-grid">
              {watchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={userData?.favorites.includes(movie.id)}
                  isWatched={userData?.watched.includes(movie.id)}
                  onToggleFavorite={() => handleToggleFavorite(movie.id)}
                  onToggleWatched={() => handleToggleWatched(movie.id)}
                  linkState={{ from: "profile" }}
                />
              ))}

              {/* Botón para añadir películas */}
              <button
                className="add-movie-button"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus />
                <span>Añadir Película</span>
              </button>
            </div>

            {watchedMovies.length === 0 && (
              <div className="empty-state">
                <p>No has marcado ninguna película como vista</p>
                <p className="empty-hint">
                  Haz clic en el botón + para marcar películas como vistas
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para añadir películas favs y vistas*/}
      <AddMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFavorite={handleToggleFavorite}
        onAddWatched={handleToggleWatched}
        userFavorites={userData?.favorites || []}
        userWatched={userData?.watched || []}
      />
    </div>
  );
};

export default ProfileView;
