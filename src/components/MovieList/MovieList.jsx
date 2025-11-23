import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

const MovieList = ({
  movies,
  loading,
  error,
  /* , userFavorites, userWatched */
}) => {
  if (loading) {
    return <p>Cargando películas...</p>;
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
          // now only to simulate, first is favorite and watched
          //implement later/
          //isFavorite={userFavorites.includes(movie.id)}
          isFavorite={movie.id === movies[0].id}
          isWatched={movie.id === movies[0].id}
          // implement later
          // onToggleFavorite={...} /
          // onToggleWatched={...}
        />
      ))}
    </div>
  );
};

export default MovieList;
