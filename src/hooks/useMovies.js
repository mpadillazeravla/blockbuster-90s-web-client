import { useState, useEffect } from "react";
import { tmdbService } from "../services/tmdbService";

export const useMovies = (page = 1, sortBy = "vote_average.desc") => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tmdbService.getMovies({ page, sort_by: sortBy });
        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message);
        console.error("Error al traer las películas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, sortBy]);

  return { movies, loading, error, totalPages };
};
