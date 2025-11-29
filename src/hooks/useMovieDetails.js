import { useState, useEffect } from "react";
import { tmdbService } from "../services/tmdbService";

export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieData, providersData] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          tmdbService.getWatchProviders(movieId),
        ]);

        setMovie(movieData);
        setProviders(providersData);
      } catch (err) {
        setError(err.message);
        console.error("Error al traer los datos de la película:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  return { movie, providers, loading, error };
};
