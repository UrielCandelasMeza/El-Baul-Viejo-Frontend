# 🏺 El Baúl Viejo

Aplicación web para la gestión y exhibición de piezas antiguas. Permite a los visitantes explorar un catálogo de antigüedades y contactar al vendedor, mientras que los administradores pueden crear, editar y eliminar piezas y categorías.

## 📋 Tabla de contenidos

- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Variables de entorno](#-variables-de-entorno)
- [Desarrollo local](#-desarrollo-local)
- [API — Endpoints](#-api--endpoints)
- [Frontend — Rutas](#-frontend--rutas)
- [Modelos de base de datos](#-modelos-de-base-de-datos)
- [Docker](#-docker)
- [Despliegue en Render](#-despliegue-en-render)

---

## 🛠 Tecnologías

### Backend (`/api`)
| Tecnología | Uso |
|---|---|
| Python 3.12 | Lenguaje |
| Flask | Framework web |
| Flask-SQLAlchemy | ORM |
| Flask-Migrate | Migraciones de BD |
| Flask-JWT-Extended | Autenticación JWT (httpOnly cookies) |
| Flask-Bcrypt | Hash de contraseñas |
| Flask-CORS | Cross-Origin Resource Sharing |
| Supabase | Storage (fotos) + PostgreSQL |
| Gunicorn | Servidor de producción |

### Frontend (`/web`)
| Tecnología | Uso |
|---|---|
| React 19 | UI |
| React Router 7 | Routing SPA |
| Vite 7 | Build tool + dev server |
| Tailwind CSS 4 | Estilos |
| Axios | HTTP client |
| React Icons | Iconografía |

---

## 📁 Estructura del proyecto

```
El Baul Viejo/
├── api/                        # Backend Flask
│   ├── src/
│   │   ├── controllers/        # Lógica de negocio
│   │   │   ├── auth_controller.py
│   │   │   ├── category_controller.py
│   │   │   └── piece_controller.py
│   │   ├── lib/
│   │   │   ├── jwt.py          # Middleware JWT
│   │   │   └── files.py        # Utilidades de archivos
│   │   ├── models/
│   │   │   ├── user_model.py
│   │   │   ├── piece_model.py
│   │   │   └── category_model.py
│   │   └── routes/
│   │       ├── auth_routes.py
│   │       ├── piece_routes.py
│   │       └── category_routes.py
│   ├── app.py                  # Entry point
│   ├── config.py               # Configuración Flask
│   ├── extensions.py           # Extensiones (db, bcrypt, jwt, cors)
│   ├── supabase_client.py      # Cliente Supabase
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── web/                        # Frontend React
│   ├── src/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── PieceCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── EditPieceModal.jsx
│   │   │   └── ...
│   │   ├── connection/
│   │   │   ├── axios.js        # Instancia configurada
│   │   │   ├── auth.js
│   │   │   ├── pieces.js
│   │   │   └── categories.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── _layout.jsx     # Layout principal (Header + Footer)
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Piece.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── Home/
│   │   │       ├── _layout.jsx # Layout admin
│   │   │       ├── CreatePiece.jsx
│   │   │       └── ManageCategories.jsx
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env
├── docker-compose.yml
└── render.yaml
```

---

## 🔐 Variables de entorno

### Backend (`api/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `FLASK_APP` | Entry point de Flask | `app.py` |
| `HOST` | Host del servidor | `localhost` |
| `PORT` | Puerto del servidor | `5000` |
| `FLASK_ENV` | Entorno | `development` / `production` |
| `JWT_SECRET_KEY` | Clave secreta para JWT (mín. 32 bytes) | `fd45111217fed1d5...` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql+psycopg2://...` |
| `DATABASE_POOL_URL` | URL del connection pool (producción) | `postgresql+psycopg2://...` |
| `SUPABASE_URL` | URL del proyecto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | API key de Supabase | `sb_secret_...` |

### Frontend (`web/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp con código de país | `525568986826` |
| `VITE_MESSENGER_ID` | ID de la página/perfil de Messenger | `100044156269092` |

> **Nota:** Las variables del frontend deben tener el prefijo `VITE_` para que Vite las exponga al código.

---

## 💻 Desarrollo local

### Prerrequisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL (o Supabase como servicio)

### 1. Backend

```bash
cd api
python -m venv venv
source venv/bin/activate        # Linux/Mac
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env            # Editar con tus credenciales

# Ejecutar
python app.py
```

El backend se ejecuta en `http://localhost:5000`.

### 2. Frontend

```bash
cd web
npm install

# Configurar variables de entorno
cp .env.example .env            # Editar con tus datos

# Ejecutar
npm run dev
```

El frontend se ejecuta en `http://localhost:5173`.

> **Importante:** Vite proxea las peticiones `/api/*` al backend (`localhost:5000`) automáticamente. Abre la app en `http://localhost:5173`.

---

## 📡 API — Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | ❌ | Registrar usuario |
| `POST` | `/login` | ❌ | Iniciar sesión (devuelve cookies JWT) |
| `GET` | `/verify` | ✅ | Verificar token y obtener usuario |
| `POST` | `/logout` | ❌ | Cerrar sesión (limpia cookies) |

### Piezas (`/api/piece`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/create` | ✅ | Crear pieza (multipart/form-data) |
| `GET` | `/get` | ❌ | Obtener todas las piezas |
| `GET` | `/get/available` | ❌ | Obtener piezas disponibles |
| `GET` | `/get/:id` | ❌ | Obtener pieza por ID |
| `PUT` | `/update/:id` | ✅ | Actualizar pieza (multipart/form-data) |
| `DELETE` | `/delete/:id` | ✅ | Eliminar pieza y sus fotos |

#### Campos de `POST /create` y `PUT /update/:id` (FormData)

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre de la pieza |
| `price` | string | Precio en MXN |
| `description` | string | Descripción |
| `status` | string | `available` o `sold` |
| `category_ids` | string[] | IDs de categorías (múltiples) |
| `photos` | File[] | Archivos de imagen (máx. 5) |
| `existing_photos` | string[] | URLs de fotos a conservar (solo update) |

### Categorías (`/api/category`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/get` | ❌ | Obtener todas las categorías |
| `POST` | `/create` | ✅ | Crear categoría |
| `DELETE` | `/delete/:id` | ✅ | Eliminar categoría |

> **Auth ✅** = requiere cookie JWT válida (httpOnly). La cookie se envía automáticamente con `withCredentials: true` en axios.

---

## 🌐 Frontend — Rutas

| Ruta | Componente | Acceso | Descripción |
|---|---|---|---|
| `/` | `LandingPage` | Público | Catálogo con buscador |
| `/piece/:id` | `Piece` | Público | Detalle de pieza + contacto |
| `/admin/login` | `LoginPage` | Público | Login de administrador |
| `/admin/piece/create` | `CreatePiece` | 🔒 Admin | Crear nueva pieza |
| `/admin/categories` | `ManageCategories` | 🔒 Admin | Gestionar categorías |

> Cuando el usuario está autenticado, el Header muestra la navegación admin en todas las páginas, y `Piece.jsx` muestra botones de **Editar** y **Eliminar**.

---

## 🗄 Modelos de base de datos

### User
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Primary key |
| `username` | String(80) | Nombre de usuario (único) |
| `password` | String(255) | Hash bcrypt |
| `name` | String(120) | Nombre completo |

### Piece
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String(150) | Nombre de la pieza |
| `price` | Numeric(10,2) | Precio en MXN |
| `description` | Text | Descripción |
| `photos` | JSON (array) | URLs de fotos en Supabase Storage |
| `category_ids` | JSON (array) | IDs de categorías |
| `status` | Enum | `available` / `sold` |
| `user_id` | UUID (FK) | Referencia al vendedor |

### Category
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String(100) | Nombre (único, case-insensitive) |

---

## 🐳 Docker

### Desarrollo local con Docker Compose

```bash
# Construir y levantar ambos servicios
docker compose up --build

# Frontend → http://localhost (puerto 80)
# Backend  → http://localhost:5000
```

> **Nota:** Docker Compose está pensado para producción/staging. Para desarrollo diario usa los servidores directamente (hot reload).

### Servicios

| Servicio | Imagen | Puerto |
|---|---|---|
| `api` | Python 3.12 + Gunicorn | 5000 |
| `web` | Node 20 (build) + Nginx (serve) | 80 |

Nginx hace proxy reverso de `/api/*` al contenedor `api` y sirve el SPA con fallback a `index.html` para React Router.

---

## 🚀 Despliegue en Render

El archivo `render.yaml` configura el despliegue automático:

### Pasos

1. Sube el repositorio a **GitHub**
2. Ve a [render.com](https://render.com) → **New** → **Blueprint**
3. Conecta tu repositorio — Render detecta `render.yaml`
4. Configura las **variables de entorno** del API en el dashboard de Render
5. Deploy

### Servicios creados

| Servicio | Tipo | Costo |
|---|---|---|
| `baul-api` | Web Service (Docker) | Gratis (con spin-down) / $7 USD siempre activo |
| `baul-web` | Static Site | Gratis |

### Configuración post-despliegue

En el frontend, actualiza la URL base de axios para apuntar al API en Render:

```js
// web/src/connection/axios.js
const instance = axios.create({
  baseURL: "https://baul-api.onrender.com/api", // URL del API en Render
  withCredentials: true,
});
```

---

## 📝 Licencia

Proyecto académico — UPIICSA, Ingeniería de Requerimientos, 3er Semestre.
