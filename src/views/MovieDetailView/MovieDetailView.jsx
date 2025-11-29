import React from "react";
import { useParams } from "react-router-dom";
import { useMovieDetails } from "../../hooks/useMovieDetails";
import LinkButton from "../../components/LinkButton/LinkButton";
import "./MovieDetailView.css";
import Spinner from "../../components/Spinner/Spinner";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetailView = () => {
  const { id } = useParams();
  const { movie, loading, error } = useMovieDetails(id);

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

  return (
    <div className="movie-detail-container">
      <LinkButton to="/" icon="arrow-left">
        Volver al Catálogo
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
    </div>
  );
};

export default MovieDetailView;
