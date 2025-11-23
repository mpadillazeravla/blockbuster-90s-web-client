import { useMovies } from "../../hooks/useMovies";
import MovieList from "../../components/MovieList/MovieList";
import "./HomeView.css";

const HomeView = () => {
  const { movies, loading, error } = useMovies();

  return (
    <div className="home-view">
      {/* <h2>Películas de los 90 (Top 20)</h2> */}
      <MovieList movies={movies} loading={loading} error={error} />
    </div>
  );
};

export default HomeView;
