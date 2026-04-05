// for local
// const BASE_URL = "http://localhost:3000/api";

// for deploy
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiService = {
  // Autenticación
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al registrar usuario");
    }

    return await response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return await response.json();
  },

  logout: async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cerrar sesión");
    }

    return await response.json();
  },

  getUserData: async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener datos del usuario");
    }

    return await response.json();
  },

  addToFavorites: async (userId, movieId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ movie_id: movieId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al agregar a favoritos");
    }

    return await response.json();
  },

  removeFromFavorites: async (userId, movieId) => {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/favorites/${movieId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ movie_id: movieId }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar de favoritos");
    }

    return await response.json();
  },

  addToWatched: async (userId, movieId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/watched`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ movie_id: movieId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al agregar a vistas");
    }

    return await response.json();
  },

  removeFromWatched: async (userId, movieId) => {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/watched/${movieId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ movie_id: movieId }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar de vistas");
    }

    return await response.json();
  },

  // Cambiar contraseña (pendiente implementarción)
  changePassword: async (userId, passwordData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/password`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar la contraseña");
    }

    return await response.json();
  },
};
