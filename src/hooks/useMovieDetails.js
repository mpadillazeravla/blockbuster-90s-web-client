import { useState, useEffect } from "react";
import { tmdbService } from "../services/tmdbService";

export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tmdbService.getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        setError(err.message);
        console.error("Error al traer los detalles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  return { movie, loading, error };
};
