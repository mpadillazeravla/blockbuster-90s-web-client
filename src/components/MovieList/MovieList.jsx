const MovieList = ({ movies, loading, error }) => {

  if (loading) {
    return <p>Cargando películas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="movie-list">
      {movies.map(movie => (
        <p key={movie.id}>
          {movie.title} (Rating: {movie.vote_average})
        </p>
      ))}
    </div>
  );
};

export default MovieList;