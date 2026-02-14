const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const defaultOptions = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
};

export const tmdbService = {
  getMovieDetails: async (movieId) => {
    if (!TOKEN) {
      throw new Error("El token de TMDb no está configurado.");
    }

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=es-ES`,
      defaultOptions
    );

    if (!response.ok) {
      throw new Error("No se encontraron los detalles de la película.");
    }

    return await response.json();
  },

  getMovies: async (filters = {}) => {
    if (!TOKEN) {
      throw new Error("El token de TMDb no está configurado.");
    }

    const defaultFilters = {
      include_adult: "false",
      language: "es-ES",
      with_origin_country: "US",
      "primary_release_date.gte": "1990-01-01",
      "primary_release_date.lte": "1999-12-31",
      page: "1",
      sort_by: "vote_average.desc",
      "vote_count.gte": "100",
      without_genres: "10402,99,10770",
    };

    const params = new URLSearchParams({ ...defaultFilters, ...filters });

    const response = await fetch(
      `${BASE_URL}/discover/movie?${params.toString()}`,
      defaultOptions
    );

    if (!response.ok) {
      throw new Error("Error al obtener las películas.");
    }

    return await response.json();
  },

  getWatchProviders: async (movieId) => {
    if (!TOKEN) {
      throw new Error("El token de TMDb no está configurado.");
    }

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/watch/providers`,
      defaultOptions
    );

    if (!response.ok) {
      throw new Error("No se encontraron los proveedores.");
    }

    const data = await response.json();
    return data.results?.ES || null;
  },

  searchMovies: async (query) => {
    if (!TOKEN) {
      throw new Error("El token de TMDb no está configurado.");
    }

    if (!query || query.trim() === "") {
      throw new Error("La búsqueda no puede estar vacía.");
    }

    const params = new URLSearchParams({
      query: query,
      language: "es-ES",
      include_adult: "false",
      page: "1",
    });

    const response = await fetch(
      `${BASE_URL}/search/movie?${params.toString()}`,
      defaultOptions
    );

    if (!response.ok) {
      throw new Error("Error al buscar películas.");
    }

    return await response.json();
  },
};
