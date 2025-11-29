import { useMovies } from "../../hooks/useMovies";
import MovieList from "../../components/MovieList/MovieList";
import "./HomeView.css";

const HomeView = () => {
  const { movies, loading, error } = useMovies();

  return (
    <div className="home-view">
      <header className="home-header">
        <h1 className="home-title">Bienvenidos a Blockbuster 90s</h1>
        <p className="home-description">
          La base de datos de la mejor década de la historia del cine
        </p>
        <p className="home-instructions">
          Pulsa sobre cualquier película para ver más detalles
        </p>
      </header>

      <MovieList movies={movies} loading={loading} error={error} />
    </div>
  );
};

export default HomeView;
