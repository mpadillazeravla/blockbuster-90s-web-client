import { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaStar, FaEye } from "react-icons/fa";
import { tmdbService } from "../../services/tmdbService";
import Spinner from "../Spinner/Spinner";
import "./AddMovieModal.css";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w200";

const AddMovieModal = ({
  isOpen,
  onClose,
  onAddFavorite,
  onAddWatched,
  userFavorites = [],
  userWatched = [],
}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [localFavorites, setLocalFavorites] = useState(userFavorites);
  const [localWatched, setLocalWatched] = useState(userWatched);

  // Sincronizar estados locales con props cuando cambian
  useEffect(() => {
    setLocalFavorites(userFavorites);
    setLocalWatched(userWatched);
  }, [userFavorites, userWatched]);

  // Cargar películas iniciales al abrir el modal
  useEffect(() => {
    if (isOpen && !hasSearched) {
      loadInitialMovies();
    }
  }, [isOpen]);

  const loadInitialMovies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await tmdbService.getMovies({ page: 1 });
      setMovies(response.results || []);
    } catch (err) {
      setError(err.message || "Error al cargar películas");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);
      const response = await tmdbService.searchMovies(searchQuery);

      setMovies(response.results || []);

      if ((response.results || []).length === 0) {
        setError("No se encontraron películas de los 90s con ese nombre");
      }
    } catch (err) {
      setError(err.message || "Error al buscar películas");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
    loadInitialMovies();
  };

  const handleAddFavorite = async (movieId) => {
    setLocalFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
    onAddFavorite(movieId);
  };

  const handleAddWatched = async (movieId) => {
    setLocalWatched((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
    onAddWatched(movieId);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Películas</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar película por nombre..."
                className="search-input"
              />
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              Buscar
            </button>
          </form>
        </div>

        <div className="modal-body">
          {loading ? (
            <Spinner message="Cargando películas..." />
          ) : error && movies.length === 0 ? (
            <div className="modal-error">{error}</div>
          ) : (
            <div className="modal-movies-grid">
              {movies.map((movie) => {
                const isFavorite = localFavorites.includes(movie.id);
                const isWatched = localWatched.includes(movie.id);
                const posterUrl = movie.poster_path
                  ? `${POSTER_BASE_URL}${movie.poster_path}`
                  : "../../../public/No_Image_Available.jpg";

                return (
                  <div key={movie.id} className="modal-movie-card">
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="modal-movie-poster"
                    />
                    <div className="modal-movie-info">
                      <h4 className="modal-movie-title">{movie.title}</h4>
                      <p className="modal-movie-year">
                        {movie.release_date
                          ? movie.release_date.split("-")[0]
                          : "N/A"}
                      </p>
                      <div className="modal-movie-actions">
                        <button
                          className={`modal-action-btn favorite ${
                            isFavorite ? "active" : ""
                          }`}
                          onClick={() => handleAddFavorite(movie.id)}
                          title={
                            isFavorite
                              ? "Quitar de favoritos"
                              : "Añadir a favoritos"
                          }
                        >
                          <FaStar />
                        </button>
                        <button
                          className={`modal-action-btn watched ${
                            isWatched ? "active" : ""
                          }`}
                          onClick={() => handleAddWatched(movie.id)}
                          title={
                            isWatched ? "Quitar de vistas" : "Marcar como vista"
                          }
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
