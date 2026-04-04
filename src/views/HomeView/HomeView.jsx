import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMovies } from "../../hooks/useMovies";
import { useUserMovies } from "../../hooks/useUserMovies";
import MovieList from "../../components/MovieList/MovieList";
import MovieSearch from "../../components/MovieSearch/MovieSearch";
import { tmdbService } from "../../services/tmdbService";
import "./HomeView.css";

const SORT_OPTIONS = [
  { value: "vote_average.desc", label: "Valoración" },
  { value: "title.asc", label: "Alfabético A→Z" },
  { value: "title.desc", label: "Alfabético Z→A" },
  { value: "primary_release_date.desc", label: "Más recientes" },
  { value: "primary_release_date.asc", label: "Más antiguas" },
];

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

const HomeView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  // Persiste en localStorage para sobrevivir navegación al detalle y vuelta
  const [sortBy, setSortByState] = useState(
    () => localStorage.getItem("home-sort") || "vote_average.desc",
  );

  const { movies, loading, error, totalPages } = useMovies(page, sortBy);

  const {
    handleToggleFavorite,
    handleToggleWatched,
    userFavorites,
    userWatched,
  } = useUserMovies();

  // Banner bienvenida: persiste en localStorage
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("home-banner-collapsed") === "true",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [jumpValue, setJumpValue] = useState("");

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("home-banner-collapsed", next ? "true" : "false");
      return next;
    });
  };

  const goToPage = (p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    localStorage.setItem("home-sort", newSort);
    setSortByState(newSort);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  };

  const handleJump = (e) => {
    e.preventDefault();
    const p = parseInt(jumpValue);
    if (p >= 1 && p <= totalPages) {
      goToPage(p);
      setJumpValue("");
    }
  };

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
      <header
        className={`home-header${isCollapsed ? " home-header--collapsed" : ""}`}
      >
        <button
          className="home-header-toggle"
          onClick={toggleCollapsed}
          aria-label={
            isCollapsed ? "Expandir bienvenida" : "Colapsar bienvenida"
          }
        >
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <h1 className="home-title">Bienvenidos a Blockbuster 90s</h1>
        <div
          className={`home-header-content${isCollapsed ? " home-header-content--hidden" : ""}`}
        >
          <p className="home-description">
            La base de datos de la mejor década de la historia del cine
          </p>
          <p className="home-instructions">
            Pulsa sobre cualquier película para ver más detalles
          </p>
        </div>
      </header>

      <div className="home-controls">
        <div className="home-search">
          <MovieSearch
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClear}
            hasSearched={hasSearched}
          />
        </div>

        {!hasSearched && (
          <div className="home-filters">
            <label className="filter-label" htmlFor="sort-select">
              Ordenar por
            </label>
            <select
              id="sort-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
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
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            title="Página anterior"
          >
            ‹
          </button>

          <div className="pagination-pages">
            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`pagination-page-btn${p === page ? " pagination-page-btn--active" : ""}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          <button
            className="pagination-btn"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            title="Página siguiente"
          >
            ›
          </button>

          <form className="pagination-jump" onSubmit={handleJump}>
            <label htmlFor="jump-input">Ir a</label>
            <input
              id="jump-input"
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              className="pagination-jump-input"
              placeholder="pág."
            />
            <button type="submit" className="pagination-btn">
              Ir
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeView;
