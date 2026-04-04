import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMovies } from "../../hooks/useMovies";
import { useUserMovies } from "../../hooks/useUserMovies";
import MovieList from "../../components/MovieList/MovieList";
import MovieSearch from "../../components/MovieSearch/MovieSearch";
import { tmdbService } from "../../services/tmdbService";
import "./HomeView.css";

const HomeView = () => {
  const { movies, loading, error, page, setPage, totalPages } = useMovies();
  const {
    handleToggleFavorite,
    handleToggleWatched,
    userFavorites,
    userWatched,
  } = useUserMovies();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError(null);
      setHasSearched(true);
      const response = await tmdbService.searchMovies(searchQuery);
      setSearchResults(response.results || []);
      if ((response.results || []).length === 0) {
        setSearchError("No se encontraron películas de los 90s con ese nombre");
      }
    } catch (err) {
      setSearchError(err.message || "Error al buscar películas");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setHasSearched(false);
    setSearchResults([]);
    setSearchError(null);
  };

  const displayMovies = hasSearched ? searchResults : movies;
  const displayLoading = hasSearched ? searchLoading : loading;
  const displayError = hasSearched ? searchError : error;

  return (
    <div className="home-view">
      <header className={`home-header${isCollapsed ? " home-header--collapsed" : ""}`}>
        <button
          className="home-header-toggle"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expandir bienvenida" : "Colapsar bienvenida"}
        >
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <h1 className="home-title">Bienvenidos a Blockbuster 90s</h1>
        <div className={`home-header-content${isCollapsed ? " home-header-content--hidden" : ""}`}>
          <p className="home-description">
            La base de datos de la mejor década de la historia del cine
          </p>
          <p className="home-instructions">
            Pulsa sobre cualquier película para ver más detalles
          </p>
        </div>
      </header>

      <div className="home-search">
        <MovieSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
          hasSearched={hasSearched}
        />
      </div>

      <MovieList
        movies={displayMovies}
        loading={displayLoading}
        error={displayError}
        userFavorites={userFavorites}
        userWatched={userWatched}
        onToggleFavorite={handleToggleFavorite}
        onToggleWatched={handleToggleWatched}
      />

      {!hasSearched && totalPages > 1 && (
        <div className="home-pagination">
          <button
            className="pagination-btn"
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={page === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeView;
