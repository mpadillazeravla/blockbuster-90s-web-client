import { FaRegStar, FaStar, FaRegEye, FaEye } from "react-icons/fa";
import "./MovieCard.css";
import { Link } from "react-router-dom";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w300";

const MovieCard = ({
  movie,
  isFavorite = false,
  isWatched = false,
  onToggleFavorite,
  onToggleWatched,
  linkState,
}) => {
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : "../../../public/No_Image_Available.jpg";

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(movie.id);
    }
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleWatched) {
      onToggleWatched(movie.id);
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} state={linkState} className="movie-card-link">
        <img
          src={posterUrl}
          alt={`Poster de ${movie.title}`}
          className="movie-poster"
        />
      </Link>

      <div className="card-info">
        <Link to={`/movie/${movie.id}`} state={linkState} className="movie-card-link">
          <h3 className="card-title">{movie.title}</h3>
        </Link>

        <h3 className="card-year">
          Año de estreno:{" "}
          {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
        </h3>

        <div className="card-actions">
          <button
            className={`icon-button favorite-btn ${
              isFavorite ? "favorited" : ""
            }`}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>

          <button
            className={`icon-button watched-btn ${isWatched ? "watched" : ""}`}
            onClick={handleWatchedClick}
            aria-label={isWatched ? "Quitar de vistas" : "Marcar como vista"}
          >
            {isWatched ? <FaEye /> : <FaRegEye />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
