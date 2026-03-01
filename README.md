# TheHive — Proyecto Integrador DAW 2

Tienda de comercio electrónico de miel artesanal desarrollada como Proyecto Integrador del ciclo de **Desarrollo de Aplicaciones Web (DAW)**. El proyecto implementa una arquitectura JAMstack desacoplada con un CMS headless en el backend y un frontend generado estáticamente.

**Autor:** Pablo Suárez Álvarez | **Módulo:** Proyecto Integrador — 2.º DAW | **Fecha:** Marzo 2026

---

## Acceso de demo

| Campo      | Valor              |
| ---------- | ------------------ |
| URL        | https://thehive.pablosuarez.dev |
| Email      | demo@hive.com      |
| Contraseña | proyectopablo      |

---

## Stack tecnológico

| Capa | Tecnología |
| ---- | ---------- |
| Frontend | [Astro 5](https://astro.build/) + Tailwind CSS 4 |
| Backend / CMS | [Strapi v5](https://strapi.io/) (headless CMS) |
| Base de datos | PostgreSQL |
| Servidor web | Nginx (proxy inverso + HTTPS con Let's Encrypt) |
| Despliegue | VPS en [Hetzner](https://www.hetzner.com/) |
| Gestión de procesos | PM2 |
| Gestión de estado | [Nanostores](https://github.com/nanostores/nanostores) |

---

## Arquitectura del proyecto

TheHive adopta una arquitectura **JAMstack** desacoplada: el frontend y el backend son aplicaciones independientes que se comunican mediante una API REST.

```
[ Navegador ]
     |
     v
[ Nginx ]  ──────────>  [ Frontend Astro ]   :4321
     |
     | proxy /api
     v
[ Strapi v5 ]   :1337
     |
     v
[ PostgreSQL ]
```

- **Frontend (Astro):** genera HTML estático en tiempo de compilación. El servidor entrega páginas ya renderizadas sin procesamiento dinámico por petición.
- **Backend (Strapi v5):** CMS headless que expone una API REST. Gestiona productos, categorías, blog, usuarios, pedidos y la configuración global del sitio.
- **Nginx:** actúa como proxy inverso, sirve el frontend estático y redirige las peticiones `/api` hacia Strapi. Gestiona el certificado SSL con Certbot.
- **PM2:** mantiene ambos procesos activos y los reinicia automáticamente si el servidor se reinicia.

Los componentes se organizan en cuatro categorías: `ui/` (bloques genéricos reutilizables), `features/` (agrupados por sección: home, product, blog, cart…), `layout/` (Header y Footer) y `profile/` (área privada).

Toda la comunicación con Strapi pasa por un único módulo `src/lib/strapi.js`, que centraliza la autenticación y el manejo de errores. El token de API nunca se expone al navegador.

> Para la descripción completa de la arquitectura, decisiones de diseño y justificaciones técnicas, consulta [`documentation/arquitectura-del-proyecto.md`](./documentation/arquitectura-del-proyecto.md).

---

## Sistema de estilos

Los estilos se construyen sobre una arquitectura de **design tokens** implementada con variables CSS nativas y expuestas como clases utilitarias a través de Tailwind CSS v4.

**Archivo fuente:** `frontend/src/styles/global.css`

### Paleta de colores (modo claro)

| Token | Valor | Uso |
| ----- | ----- | --- |
| `--color-primary` | `#E89B00` | Dorado miel — color principal de la interfaz |
| `--color-secondary` | `#5C2E0C` | Marrón oscuro — color secundario |
| `--color-bg-primary` | `#FFFFFF` | Fondo base de la página |
| `--color-bg-secondary` | `#FAF7F2` | Fondo de secciones y tarjetas |
| `--color-text-primary` | `#1A1A1A` | Texto principal |
| `--color-text-secondary` | `#5B5B5B` | Subtítulos y metadatos |

En modo oscuro, los fondos pasan a escala de grises azulados (`#111827` → `#374151`) y el primario se aclara a `#FBBF24` para mantener el contraste. El cambio de tema se gestiona con el atributo `data-theme` en `<html>`, persistido en `localStorage`.

### Tipografía

Todos los tamaños de encabezado y párrafo son **fluidos** mediante `clamp()`, escalando entre un mínimo y un máximo según el ancho de la ventana, sin necesidad de media queries.

### Componente Button

El componente `Button.astro` es polimórfico (renderiza `<a>` o `<button>`) y tiene cuatro variantes jerarquizadas: `primary` (acción principal, fondo dorado), `secondary` (fondo marrón), `outline` (borde dorado sin relleno) y `ghost` (solo texto).

> Documentación completa del sistema de estilos, tokens y componentes UI en [`documentation/sistema-de-estilos.md`](./documentation/sistema-de-estilos.md).

---

## Estrategia SEO

El proyecto integra una estrategia de posicionamiento orgánico que cubre aspectos técnicos y de contenido.

### Elementos implementados

| Elemento | Estado |
| -------- | ------ |
| Títulos `<title>` y `<meta description>` únicos por página | Implementado |
| Etiquetas Open Graph en `Layout.astro` | Implementado |
| Sitemap XML generado con `@astrojs/sitemap` y enviado a Search Console | Implementado |
| Archivo `robots.txt` con exclusión de rutas privadas | Implementado |
| Certificado SSL activo (Let's Encrypt + Certbot) | Implementado |
| Rendimiento > 80 en PageSpeed Insights | Implementado |
| Atributo `alt` en todas las imágenes | Implementado |
| Datos estructurados Schema.org (JSON-LD) en fichas de producto | Pendiente |
| Google Business Profile | Pendiente |

### Palabras clave por sección

| Página | Keyword principal |
| ------ | ----------------- |
| Inicio (`/`) | "tienda miel online España" |
| Catálogo (`/productos`) | "miel ecológica online" |
| Categorías (`/categoria/[slug]`) | "[tipo de miel] comprar" |
| Producto (`/producto/[slug]`) | "[nombre del producto] precio" |
| Blog (`/blog`) | Variadas según artículo |

Las metaetiquetas `<title>` siguen el formato `[Keyword principal] | TheHive` y las descripciones se limitan a 160 caracteres. Las URLs son semánticas y legibles, gestionando los `slugs` desde Strapi (p.ej. `/productos/miel-de-romero-500g`).

> Para la estrategia completa, métricas de Core Web Vitals y seguimiento con Google Search Console, consulta [`documentation/estrategia-seo.md`](./documentation/estrategia-seo.md).

---

## Páginas del sitio

| Ruta | Descripción |
| ---- | ----------- |
| `/` | Inicio — hero, categorías, productos destacados, blog, CTA |
| `/productos` | Catálogo completo con filtros y paginación |
| `/categoria/[slug]` | Listado de productos por categoría |
| `/producto/[slug]` | Ficha de producto individual |
| `/blog` | Listado de artículos |
| `/blog/[slug]` | Artículo de blog individual |
| `/carrito` | Carrito de compra |
| `/checkout` | Proceso de pago |
| `/perfil` | Perfil de usuario e historial de pedidos |
| `/login` / `/registro` | Autenticación |
| `/sobre-nosotros` | Información de la empresa |
| `/contacto` | Formulario de contacto |
| `/faq` | Preguntas frecuentes |
| `/envios` | Política de envíos |

---

## Instalación y arranque en local

### Requisitos previos

- Node.js >= 18
- PostgreSQL >= 14

### Variables de entorno

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

**`frontend/.env`**

```env
PUBLIC_STRAPI_URL=http://localhost:1337
```

**`backend/.env`**

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

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

Panel de administración disponible en `http://localhost:1337/admin`.

### Frontend (Astro)

```bash
cd frontend
npm install
npm run dev:local
```

Sitio disponible en `http://localhost:4321`.

---

## Despliegue en producción

```bash
# Frontend
cd frontend && npm run build
pm2 start npm --name "astro" -- run preview

# Backend
cd backend && npm run build
pm2 start npm --name "strapi" -- run start

# Persistir procesos al reiniciar el servidor
pm2 save && pm2 startup
```

La configuración de Nginx se encuentra en `/etc/nginx/sites-available/thehive`.

---

## Documentación

| Documento | Contenido |
| --------- | --------- |
| [`arquitectura-del-proyecto.md`](./documentation/arquitectura-del-proyecto.md) | Arquitectura JAMstack, estructura de directorios, decisiones técnicas |
| [`sistema-de-estilos.md`](./documentation/sistema-de-estilos.md) | Design tokens, paleta de color, tipografía, componentes UI |
| [`estrategia-seo.md`](./documentation/estrategia-seo.md) | Keywords, SEO on-page, SEO técnico, Core Web Vitals |
