import { useState, useEffect } from "react";

const TOKEN = import.meta.env.TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/discover/movie";

const PARAMS = new URLSearchParams({
  include_adult: "false",
  language: "es-ES",
  with_origin_country: "US",
  "primary_release_date.gte": "1990-01-01",
  "primary_release_date.lte": "1999-12-31",
  page: "1",
});

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BASE_URL}?${PARAMS.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        if (!response.ok) {
          throw new Error("La respuesta de la API no fue correcta");
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err.message);
        console.error("Error al traer las películas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
};
