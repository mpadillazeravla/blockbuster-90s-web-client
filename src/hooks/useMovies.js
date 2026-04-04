import { useState, useEffect } from "react";
import { tmdbService } from "../services/tmdbService";

export const useMovies = (filters = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tmdbService.getMovies({ ...filters, page });
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { movies, loading, error, page, setPage, totalPages };
};
