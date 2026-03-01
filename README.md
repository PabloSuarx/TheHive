# TheHive — Proyecto Integrador DAW 2
# TheHive — Proyecto Integrador DAW 2

Tienda de comercio electrónico de miel artesanal desarrollada como Proyecto Integrador del ciclo de **Desarrollo de Aplicaciones Web (DAW)**. El proyecto implementa una arquitectura JAMstack desacoplada con un CMS headless en el backend y un frontend generado estáticamente.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | [Astro 5](https://astro.build/) + Tailwind CSS 4 |
| Backend / CMS | [Strapi v5](https://strapi.io/) (headless CMS) |
| Base de datos | PostgreSQL |
| Servidor web | Nginx (proxy inverso) |
| Despliegue | VPS en [Hetzner](https://www.hetzner.com/) |
| Gestión de estado | [Nanostores](https://github.com/nanostores/nanostores) |

---

## Estructura del repositorio

```
TheHive/
├── backend/          # API y CMS — Strapi v5
├── frontend/         # Aplicación web — Astro
│   └── src/
│       ├── components/   # Componentes reutilizables
│       ├── layouts/      # Layout base de la aplicación
│       ├── lib/          # Cliente de la API de Strapi
│       ├── pages/        # Rutas del sitio
│       └── types/        # Tipos TypeScript
└── documentation/    # Documentación del proyecto
```

---

## Páginas del sitio

| Ruta | Descripción |
|---|---|
| `/` | Inicio — hero, categorías, productos destacados, blog, CTA |
| `/productos` | Catálogo completo con filtros y paginación |
| `/categoria/[slug]` | Listado de productos por categoría |
| `/producto/[slug]` | Ficha de producto individual |
| `/blog` | Listado de artículos |
| `/blog/[slug]` | Artículo de blog individual |
| `/carrito` | Carrito de compra |
| `/checkout` | Proceso de pago |
| `/perfil` | Perfil de usuario y historial de pedidos |
| `/login` / `/registro` | Autenticación de usuarios |
| `/sobre-nosotros` | Información de la empresa |
| `/contacto` | Formulario de contacto |
| `/faq` | Preguntas frecuentes |
| `/envios` | Política de envíos |

---

## Variables de entorno

Antes de ejecutar el proyecto, copia los archivos de ejemplo y rellena los valores:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### Frontend (`frontend/.env`)

```env
PUBLIC_STRAPI_URL=http://localhost:1337
```

### Backend (`backend/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=thehive
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
```

---

## Instalación y arranque en local

### Requisitos previos

- Node.js >= 18
- PostgreSQL >= 14

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

El panel de administración de Strapi estará disponible en `http://localhost:1337/admin`.

### Frontend (Astro)

```bash
cd frontend
npm install
npm run dev:local
```

El sitio estará disponible en `http://localhost:4321`.

---

## Despliegue en producción

El servidor utiliza **Nginx** como proxy inverso y **PM2** para mantener los procesos activos.

```bash
# Compilar y levantar el frontend con PM2
cd frontend
npm run build
pm2 start npm --name "thehive-front" -- run preview
```

```bash
# Levantar el backend con PM2
cd backend
pm2 start npm --name "thehive-back" -- run start
```

```bash
# Ver el estado de los procesos
pm2 status

# Guardar los procesos para que arranquen al reiniciar el servidor
pm2 save
pm2 startup
```

La configuración de Nginx para el dominio se encuentra en `/etc/nginx/sites-available/thehive`.

---

## Documentación

La carpeta `/documentation` contiene la documentación técnica del proyecto:

- [`estrategia-seo.md`](./documentation/estrategia-seo.md) — Estrategia de posicionamiento SEO

---

## Autor

Proyecto desarrollado por **Pablo Suárez** como trabajo integrador del 2.º curso del ciclo formativo de Desarrollo de Aplicaciones Web (DAW).
