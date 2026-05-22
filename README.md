# Paraíso Cupcake Shop

Aplicación web de tienda online de productos de pastelería, desarrollada como Trabajo Fin de Grado del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM).

El proyecto está formado por una API REST en Django más un cliente web en React, una base de datos PostgreSQL y un entorno de desarrollo basado en Docker Compose que levanta los tres servicios con un único comando.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
- [Servicios y puertos](#servicios-y-puertos)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints de la API](#endpoints-de-la-api)
- [Comandos útiles](#comandos-útiles)
- [Autor](#autor)

## Tecnologías

- Backend: Python 3 + Django + Django REST Framework
- Autenticación: JSON Web Tokens (djangorestframework-simplejwt)
- Frontend: React + Vite
- Base de datos: PostgreSQL 16
- Contenerización: Docker + Docker Compose
- Control de versiones: Git + GitHub

## Estructura del proyecto

```
paraisocupcakeshop/
├── backend/
│   ├── core/             # Configuración del proyecto Django (settings, urls raíz)
│   ├── media/            # Archivos subidos en tiempo de ejecución (imágenes de productos)
│   ├── pedidos/          # App de pedidos
│   ├── productos/        # App de catálogo (categorías y productos)
│   ├── usuarios/         # App de usuarios (registro, perfil, cambiar contraseña, favoritos)
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/           # Assets estáticos servidos tal cual
│   ├── src/              # Código fuente React
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
├── .gitignore
├── README.md
└── docker-compose.yml
```

## Requisitos previos

- Docker Engine 20.10 o superior
- Docker Compose v2 (incluido en versiones modernas de Docker Desktop y Docker Engine)
- Git

## Puesta en marcha

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/<usuario>/paraisocupcakeshop.git
   cd paraisocupcakeshop
   ```

2. Construir las imágenes y arrancar los tres servicios:

   ```bash
   docker compose up --build
   ```

   La primera ejecución tarda unos minutos mientras se descarga la imagen de PostgreSQL y se construyen las imágenes de `backend` y `frontend`.

3. En otra terminal, aplicar las migraciones de la base de datos (solo la primera vez):

   ```bash
   docker compose exec backend python manage.py migrate
   ```

4. (Opcional) Crear un superusuario para acceder al panel de administración:

   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

5. Abrir la aplicación en el navegador:

   - Frontend: <http://localhost:5173>
   - API: <http://localhost:8000/api/>
   - Panel administración: <http://localhost:8000/admin/>

Para detener los servicios:

```bash
docker compose down
```

## Servicios y puertos

| Servicio   | Imagen / Build | Puerto local | Descripción                  |
|------------|----------------|--------------|------------------------------|
| `db`       | postgres:16    | 5432         | Base de datos PostgreSQL     |
| `backend`  | `./backend`    | 8000         | API REST Django + DRF        |
| `frontend` | `./frontend`   | 5173         | Cliente web React + Vite     |

Dependencias entre contenedores: `backend` espera a que `db` esté sano (`healthcheck` con `pg_isready`). `frontend` espera a `backend`.

Volumen persistente: `postgres_data`, montado en `/var/lib/postgresql/data` dentro del contenedor de la base de datos. Los archivos subidos por la aplicación se guardan en `backend/media/`, montado en el contenedor mediante el volumen `./backend:/app`.

## Variables de entorno

Las variables del servicio `backend` están definidas en `docker-compose.yml`:

| Variable        | Valor por defecto                                                              | Descripción                          |
|-----------------|--------------------------------------------------------------------------------|--------------------------------------|
| `DATABASE_URL`  | `postgres://paraisocupcake_user:root@db:5432/paraisocupcake_db`                | Cadena de conexión a PostgreSQL      |
| `DEBUG`         | `True`                                                                         | Activa el modo desarrollo de Django  |

Las credenciales de PostgreSQL se definen en el servicio `db` del compose: usuario `paraisocupcake_user`, contraseña `root` y base de datos `paraisocupcake_db`.

El resto de configuración (`SECRET_KEY`, `ALLOWED_HOSTS`, configuración de CORS, etc.) reside en `backend/core/settings.py`. En un entorno de producción real, estos valores deberían moverse a un archivo `.env` excluido del control de versiones; esta tarea queda recogida como mejora futura en el apartado 8.2 de la memoria del TFG.

## Endpoints de la API

Todos los endpoints cuelgan del prefijo `/api/`. Las rutas que requieren autenticación esperan el header HTTP `Authorization: Bearer <access_token>` obtenido tras llamar a `/api/token/`.

### Autenticación (JWT)

| Método | Ruta                        | Auth | Descripción                                      |
|--------|-----------------------------|------|--------------------------------------------------|
| POST   | `/api/usuarios/registro/`   | No   | Registro de un usuario nuevo.                    |
| POST   | `/api/token/`               | No   | Login. Devuelve los tokens `access` y `refresh`. |
| POST   | `/api/token/refresh/`       | No   | Renueva el token `access` a partir del `refresh`.|

### Usuarios

| Método | Ruta                              | Auth | Descripción                                              |
|--------|-----------------------------------|------|----------------------------------------------------------|
| GET    | `/api/usuarios/me/`               | Sí   | Devuelve los datos del usuario autenticado.              |
| PUT    | `/api/usuarios/me/`               | Sí   | Actualiza todos los datos del usuario autenticado.       |
| PATCH  | `/api/usuarios/me/`               | Sí   | Actualiza parcialmente los datos del usuario autenticado.|
| POST   | `/api/usuarios/cambiar-password/` | Sí   | Cambia la contraseña del usuario autenticado.            |

### Favoritos

| Método | Ruta                                | Auth | Descripción                                      |
|--------|-------------------------------------|------|--------------------------------------------------|
| GET    | `/api/usuarios/favoritos/`          | Sí   | Lista de favoritos del usuario autenticado.      |
| POST   | `/api/usuarios/favoritos/`          | Sí   | Añade un producto a favoritos (idempotente).     |
| DELETE | `/api/usuarios/favoritos/{id}/`     | Sí   | Elimina un favorito por su `id`.                 |

### Catálogo

| Método | Ruta                              | Auth | Descripción                                 |
|--------|-----------------------------------|------|---------------------------------------------|
| GET    | `/api/categorias/`                | No   | Lista de categorías.                        |
| GET    | `/api/categorias/{slug}/`         | No   | Detalle de una categoría por `slug`.        |
| GET    | `/api/productos/`                 | No   | Lista de productos.                         |
| GET    | `/api/productos/{slug}/`          | No   | Detalle de un producto por `slug`.          |
| GET    | `/api/productos/destacados/`      | No   | Lista de productos destacados y disponibles.|

Parámetros opcionales del listado `GET /api/productos/`:

| Parámetro        | Descripción                                                                                  |
|------------------|----------------------------------------------------------------------------------------------|
| `search`         | Búsqueda en los campos `nombre` y `descripcion`.                                             |
| `categoria`      | Filtra por `id` de categoría.                                                                |
| `categoria_slug` | Filtra por `slug` de categoría.                                                              |
| `destacado`      | `true` o `1` para devolver solo productos marcados como destacados.                          |
| `disponible`     | `true` o `1` para devolver solo productos disponibles.                                       |
| `ordering`       | Orden de la lista. Valores permitidos: `precio`, `-precio`, `creado`, `-creado`, `nombre`, `-nombre`. |

### Pedidos

| Método | Ruta                  | Auth                          | Descripción                                          |
|--------|-----------------------|-------------------------------|------------------------------------------------------|
| POST   | `/api/pedidos/`       | Opcional (admite anónimo)     | Crea un pedido. Si hay sesión, lo asocia al usuario. |
| GET    | `/api/pedidos/`       | Sí                            | Lista los pedidos del usuario autenticado.           |
| GET    | `/api/pedidos/{id}/`  | Sí                            | Detalle de un pedido del usuario autenticado.        |

El endpoint de pedidos solo expone los métodos GET y POST. La API no permite modificar ni eliminar pedidos una vez creados.

### Panel de administración

| Ruta      | Descripción                                                          |
|-----------|----------------------------------------------------------------------|
| `/admin/` | Panel de administración de Django (requiere usuario con permisos).   |

## Comandos útiles

Ver logs en tiempo real de un servicio:

```bash
docker compose logs -f backend
```

Abrir una shell dentro del contenedor del backend:

```bash
docker compose exec backend bash
```

Generar y aplicar migraciones tras modificar modelos:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Reiniciar un único servicio:

```bash
docker compose restart backend
```

Detener los servicios y eliminar los volúmenes (atención: borra los datos de la base de datos):

```bash
docker compose down -v
```

## Autor

Jorge Gómez — Trabajo Fin de Grado del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM). Curso 2025/2026.
