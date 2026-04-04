import { FaSearch, FaTimes } from "react-icons/fa";
import "./MovieSearch.css";

const MovieSearch = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onClear,
  hasSearched,
}) => {
  return (
    <form onSubmit={onSearch} className="search-form">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar película por nombre..."
          className="search-input"
        />
        {hasSearched && (
          <button
            type="button"
            onClick={onClear}
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
  );
};

export default MovieSearch;
