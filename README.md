# Blockbuster 90s — Web Client

Aplicación web para explorar y gestionar una base de datos de películas de los años 90. Permite navegar el catálogo completo obtenido desde la API de TMDB, buscar títulos, marcar favoritos y películas vistas, y compartir cualquier película.

---

## Características

- **Catálogo de películas** de los 90 obtenido desde la API de TMDB con paginación completa
- **Búsqueda** por nombre de película en tiempo real
- **Ordenación** del catálogo por valoración, orden alfabético o fecha de estreno
- **Detalle de película**: sinopsis, géneros, duración, valoración y plataformas de streaming disponibles
- **Zona privada de usuario**: lista de favoritos y películas vistas, con gestión completa
- **Compartir películas** usando la Web Share API nativa (con fallback a copiar al portapapeles)
- **Autenticación**: registro, login y sesión persistente mediante JWT
- Estado del catálogo (página, orden, banner colapsado) **persistente entre navegaciones**

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| React Router DOM | 7 | Enrutado SPA |
| Vite | 7 | Build tool y servidor de desarrollo |
| React Icons | 5 | Iconos |
| React Spinners | 0.17 | Estados de carga |
| TMDB API | v3 | Datos de películas |
| Backend propio | — | Autenticación y listas de usuario |

---

## Requisitos previos

- Node.js 18+
- Token de acceso a la [API de TMDB](https://www.themoviedb.org/settings/api)
- Backend de la aplicación corriendo en `http://localhost:3000`

---

## Instalación y arranque

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd blockbuster90-web-client

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)

# 4. Arrancar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_TMDB_TOKEN=tu_token_de_acceso_de_tmdb
```

> El token es el **API Read Access Token** (Bearer) de tu cuenta de TMDB, no la API key clásica.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run lint` | Ejecuta ESLint |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── AddMovieModal/     # Modal de búsqueda y gestión de películas (zona privada)
│   ├── MovieCard/         # Tarjeta de película con acciones de favorito, visto y compartir
│   ├── MovieList/         # Grid de tarjetas de películas
│   ├── MovieSearch/       # Componente de búsqueda reutilizable
│   ├── Navbar/            # Barra de navegación
│   ├── ShareButton/       # Botón de compartir (Web Share API) reutilizable
│   ├── Spinner/           # Indicador de carga
│   ├── UserMenu/          # Menú de usuario autenticado
│   └── WatchProviders/    # Plataformas de streaming donde ver la película
├── context/
│   └── AuthContext.jsx    # Estado global de autenticación
├── hooks/
│   ├── useMovies.js       # Fetch paginado del catálogo desde TMDB
│   ├── useMovieDetails.js # Fetch del detalle de una película
│   └── useUserMovies.js   # Gestión de favoritos y vistas del usuario
├── services/
│   ├── tmdbService.js     # Wrapper de la API de TMDB
│   └── apiService.js      # Wrapper del backend propio (auth y listas)
└── views/
    ├── HomeView/          # Catálogo principal con búsqueda, ordenación y paginación
    ├── MovieDetailView/   # Detalle de película
    ├── LoginView/         # Formulario de login
    ├── RegisterView/      # Formulario de registro
    └── ProfileView/       # Zona privada: favoritos y películas vistas
```

---

## Rutas de la aplicación

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Catálogo de películas | Público |
| `/movie/:id` | Detalle de película | Público |
| `/login` | Login | Público |
| `/register` | Registro | Público |
| `/profile` | Zona privada de usuario | Requiere autenticación |

---

## API de TMDB

El catálogo muestra películas del endpoint `/discover/movie` filtradas por:

- Fecha de estreno entre 1990 y 1999
- País de origen: Estados Unidos
- Mínimo de 100 votos
- Excluye géneros: Musical, Documental, Telefilme

La búsqueda usa el endpoint `/search/movie` con los mismos filtros de fecha aplicados en cliente.

---

## Backend

El cliente se conecta a una API REST propia en `http://localhost:3000/api` para:

- Registro y login de usuarios (`/auth/register`, `/auth/login`)
- Obtención de datos del usuario con sus listas (`/users/:id`)
- Gestión de favoritos (`/users/:id/favorites`)
- Gestión de películas vistas (`/users/:id/watched`)

La autenticación usa JWT enviado como `Authorization: Bearer <token>`.
