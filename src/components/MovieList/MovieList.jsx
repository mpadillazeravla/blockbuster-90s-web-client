import MovieCard from "../MovieCard/MovieCard";
import Spinner from "../Spinner/Spinner";
import "./MovieList.css";

const MovieList = ({
  movies,
  loading,
  error,
  userFavorites = [],
  userWatched = [],
  onToggleFavorite,
  onToggleWatched,
}) => {
  if (loading) {
    return <Spinner message="Cargando películas..." />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={userFavorites.includes(movie.id)}
          isWatched={userWatched.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  );
};

export default MovieList;
