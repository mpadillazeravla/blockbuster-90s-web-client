import { useParams, useLocation } from "react-router-dom";
import { useMovieDetails } from "../../hooks/useMovieDetails";
import { useUserMovies } from "../../hooks/useUserMovies";
import { FaRegStar, FaStar, FaRegEye, FaEye } from "react-icons/fa";
import LinkButton from "../../components/LinkButton/LinkButton";
import Spinner from "../../components/Spinner/Spinner";
import WatchProviders from "../../components/WatchProviders/WatchProviders";
import "./MovieDetailView.css";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetailView = () => {
  const { id } = useParams();
  const location = useLocation();
  const { movie, providers, loading, error } = useMovieDetails(id);
  const { handleToggleFavorite, handleToggleWatched, isFavorite, isWatched } =
    useUserMovies();

  const fromProfile = location.state?.from === "profile";

  if (loading) {
    return <Spinner message="Cargando detalles de la película..." />;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="not-found-state">Película no disponible.</div>;
  }

  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : "../../../public/No_Image_Available.jpg";

  const movieIsFavorite = isFavorite(parseInt(id));
  const movieIsWatched = isWatched(parseInt(id));

  return (
    <div className="movie-detail-container">
      <LinkButton to={fromProfile ? "/profile" : "/"} icon="arrow-left">
        {fromProfile ? "Volver a Zona Privada" : "Volver al Catálogo"}
      </LinkButton>

      <div className="movie-detail-content">
        <img
          src={posterUrl}
          alt={`Poster de ${movie.title}`}
          className="detail-poster"
        />
        <div className="detail-info">
          <h2>
            {movie.title} ({movie.release_date.split("-")[0]})
          </h2>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}

          {/* Botones de favorito y visto */}
          <div className="movie-actions">
            <button
              className={`action-button favorite-btn ${
                movieIsFavorite ? "active" : ""
              }`}
              onClick={() => handleToggleFavorite(parseInt(id))}
              title={
                movieIsFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
              }
            >
              {movieIsFavorite ? <FaStar /> : <FaRegStar />}
              <span>
                {movieIsFavorite ? "En Favoritos" : "Añadir a Favoritos"}
              </span>
            </button>

            <button
              className={`action-button watched-btn ${
                movieIsWatched ? "active" : ""
              }`}
              onClick={() => handleToggleWatched(parseInt(id))}
              title={movieIsWatched ? "Quitar de vistas" : "Marcar como vista"}
            >
              {movieIsWatched ? <FaEye /> : <FaRegEye />}
              <span>{movieIsWatched ? "Ya Vista" : "Marcar como Vista"}</span>
            </button>
          </div>

          <h3>Sinopsis</h3>
          <p>{movie.overview || "Sin sinopsis disponible"}</p>

          <div className="metadata">
            <p>
              <strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}
            </p>
            <p>
              <strong>Género:</strong>{" "}
              {movie.genres && movie.genres.length > 0
                ? movie.genres.map((g) => g.name).join(", ")
                : "No disponible"}
            </p>
            <p>
              <strong>Duración:</strong>{" "}
              {movie.runtime ? `${movie.runtime} minutos` : "No disponible"}
            </p>
          </div>
        </div>
      </div>
      <WatchProviders providers={providers} />
    </div>
  );
};

export default MovieDetailView;
