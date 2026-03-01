# Estructura del Proyecto y Decisiones de Diseño — TheHive

**Proyecto:** TheHive — Tienda online de productos de apicultura  
**Módulo:** Proyecto Integrador — 2.º DAW  
**Fecha:** Marzo 2026

---

## Introducción

Este documento describe la estructura de directorios y los componentes principales del proyecto TheHive, y justifica las decisiones de arquitectura adoptadas durante su desarrollo. El objetivo es dejar constancia de por qué se organizó el código de esta manera y qué ventajas aporta cada elección.

---

## 1. Arquitectura general: JAMstack desacoplada

TheHive adopta una arquitectura **JAMstack** (JavaScript, APIs, Markup), en la que el frontend y el backend son aplicaciones completamente independientes que se comunican a través de una API REST.

```
[ Navegador ]
     |
     | HTTP
     v
[ Nginx ] ─────────> [ Frontend (Astro) ]  :4321
     |
     | proxy /api
     v
[ Backend (Strapi v5) ]  :1337
     |
     v
[ PostgreSQL ]
```

### Justificación

Separar el frontend del backend presenta varias ventajas relevantes para un proyecto de comercio electrónico:

- **Independencia de despliegue:** el frontend puede compilarse y actualizarse sin tocar la base de datos ni el CMS.
- **Rendimiento:** Astro genera HTML estático en tiempo de compilación. El servidor entrega páginas ya renderizadas, sin esperar procesamiento dinámico en cada petición.
- **Escalabilidad:** si en el futuro se quisiera añadir una aplicación móvil, consumiría la misma API de Strapi sin cambios en el backend.
- **Seguridad:** el token de API de Strapi nunca sale del servidor. El cliente (navegador) solo accede a la URL pública `PUBLIC_STRAPI_URL`, nunca al token secreto.

---

## 2. Estructura de directorios

### 2.1 Raíz del repositorio

```
TheHive/
├── backend/          # API y CMS — Strapi v5
├── frontend/         # Aplicación web — Astro 5
├── documentation/    # Documentación del proyecto
└── README.md
```

La separación en carpetas `backend` y `frontend` refleja la independencia de las dos aplicaciones. Cada una tiene su propio `package.json`, su propio servidor y sus propias variables de entorno.

### 2.2 Frontend (`/frontend/src`)

```
src/
├── components/       # Componentes reutilizables
│   ├── features/     # Componentes específicos de una funcionalidad
│   │   ├── blog/
│   │   ├── cart/
│   │   ├── category/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── home/
│   │   └── product/
│   ├── layout/       # Cabecera y pie de página
│   ├── profile/      # Componentes del área privada
│   └── ui/           # Componentes genéricos de interfaz
├── layouts/          # Layout base compartido por todas las páginas
├── lib/              # Cliente HTTP hacia la API de Strapi
├── pages/            # Rutas del sitio (una por archivo .astro)
├── stores/           # Estado global de la aplicación
├── styles/           # Estilos globales (CSS variables, tipografía)
├── types/            # Tipos TypeScript de todos los modelos de datos
└── utils/            # Utilidades: carrito, tiempo de lectura, etc.
```

---

## 3. Organización de componentes

Los componentes se dividen en cuatro categorías claramente diferenciadas:

### 3.1 `components/ui/` — Componentes de interfaz genéricos

Son los bloques más pequeños y reutilizables, sin lógica de negocio:

| Componente | Función |
|---|---|
| `Button.astro` | Botón con variantes: `primary`, `secondary`, `outline`, `ghost` |
| `Breadcrumbs.astro` | Navegación de migas de pan, estilo homogéneo en todo el sitio |
| `Pagination.astro` | Paginación con selector de ítems por página |
| `FilterTabs.astro` | Pestañas de filtro para el catálogo de productos |
| `ThemeToggle.astro` | Conmutador de tema claro/oscuro |
| `Avatar.astro` / `AvatarMenu.astro` | Avatar de usuario con menú desplegable |
| `CustomLoader.astro` | Indicador de carga global |
| `StarRating.astro` | Valoración de productos con estrellas |
| `MarkdownRenderer.astro` | Renderizado de contenido Markdown proveniente de Strapi |

### 3.2 `components/features/` — Componentes de funcionalidad

Cada subcarpeta agrupa todos los componentes propios de una sección del sitio:

- **`home/`** — Hero, sección de categorías, productos destacados, testimonios, blog en portada, llamada a la acción, calculadora de dulzor.
- **`product/`** — Hero del producto, galería de imágenes, tarjeta de producto, selector de cantidad, reseñas.
- **`category/`** — Hero de categoría, cuadrícula de productos filtrados.
- **`blog/`** — Tarjeta de artículo, cabecera del post, lista de posts relacionados.
- **`cart/`** — Lista de ítems del carrito.
- **`contact/`** — Formulario de contacto y datos de la empresa.
- **`faq/`** — Componente de pregunta y respuesta desplegable.

### 3.3 `components/layout/`

Contiene `Header.astro` y `Footer.astro`, que se renderizan en todas las páginas a través de `Layout.astro`. Reciben los datos de configuración del sitio (`siteConfig`) ya cargados por el layout, evitando peticiones duplicadas a la API.

### 3.4 `components/profile/`

Componentes exclusivos del área privada del usuario: hero del perfil, tarjeta de pedido y lista de pedidos.

### Justificación del modelo de organización

Agrupar por funcionalidad en lugar de por tipo (por ejemplo, tener una única carpeta con todos los formularios del sitio) tiene varias ventajas:

- **Localización rápida:** si hay un bug en la página de producto, todos los archivos relacionados están en `features/product/`, no dispersos.
- **Cohesión:** los componentes que cambian juntos están juntos.
- **Escalabilidad:** añadir una nueva sección (por ejemplo, `features/reviews/`) no afecta al resto.

---

## 4. Sistema de rutas

Astro utiliza enrutamiento basado en archivos: cada archivo `.astro` dentro de `src/pages/` se convierte automáticamente en una ruta del sitio.

```
src/pages/
├── index.astro               →  /
├── productos.astro           →  /productos
├── categorias.astro          →  /categorias
├── categoria/[slug].astro    →  /categoria/:slug
├── producto/[slug].astro     →  /producto/:slug
├── blog.astro                →  /blog
├── blog/[slug].astro         →  /blog/:slug
├── carrito.astro             →  /carrito
├── checkout.astro            →  /checkout
├── perfil.astro              →  /perfil
├── login.astro               →  /login
├── registro.astro            →  /registro
├── sobre-nosotros.astro      →  /sobre-nosotros
├── contacto.astro            →  /contacto
├── faq.astro                 →  /faq
├── envios.astro              →  /envios
├── politica-privacidad.astro →  /politica-privacidad
└── 404.astro                 →  página de error
```

Las rutas dinámicas (`[slug].astro`) recuperan el `slug` desde la URL y lo usan para consultar el recurso correspondiente en la API de Strapi.

---

## 5. Capa de datos: cliente de Strapi

Toda la comunicación con la API de Strapi se centraliza en un único módulo: `src/lib/strapi.js`.

Este módulo expone dos funciones:

- **`fetchAPI(endpoint, params)`** — realiza la petición HTTP con autenticación mediante token Bearer y construye la query string de forma recursiva para soportar los filtros anidados de Strapi (por ejemplo, `populate[category][populate]=image`).
- **`get(endpoint, params)`** — llamada simplificada que devuelve directamente `data.data`, eliminando el nivel de anidamiento de la respuesta estándar de Strapi.

El token de autenticación se obtiene en tiempo de servidor mediante `astro:env/server`, lo que garantiza que nunca se expone al navegador.

```js
// Ejemplo de uso en una página
import { get } from "../lib/strapi";

const productos = await get("products", {
  populate: { mainImage: true, category: true },
  sort: { createdAt: "desc" },
});
```

### Justificación

Centralizar las peticiones en un único módulo evita duplicar la lógica de autenticación y manejo de errores en cada página o componente. Si la URL de la API o el esquema de autenticación cambian, solo hay que modificar un fichero.

---

## 6. Sistema de tipos

Todos los modelos de datos están definidos en TypeScript dentro de `src/types/`. Cada fichero corresponde a un recurso de la API:

| Fichero | Contenido |
|---|---|
| `product.ts` | `Product`, `Review`, `Beekeeper`, `Origin`, `Tag` |
| `category.ts` | `Category` |
| `blog.ts` | `BlogPost`, `BlogCategory` |
| `user.ts` | `User` |
| `cart.ts` | `CartItem` (versión del store global) |
| `common.ts` | `StrapiImage`, `ImageFormat`, `Seo`, `Button` |
| `home.ts` | Tipos del contenido dinámico de la portada |
| `header.ts` / `footer.ts` | Configuración de navegación |
| `dom.ts` | Tipos de utilidad para manipulación del DOM |

El tipo `StrapiImage` en `common.ts` modela la estructura de archivos devuelta por Strapi, incluyendo los formatos generados automáticamente (`small`, `thumbnail`) y el punto focal para recortes de imagen.

### Justificación

Tipar todos los modelos de datos elimina una categoría entera de errores en tiempo de desarrollo: el editor avisa si se accede a una propiedad inexistente o si se pasa un tipo incorrecto como prop a un componente. Además, sirve como documentación implícita de la estructura de la API.

---

## 7. Gestión de estado global

El estado de la aplicación que necesita compartirse entre componentes se gestiona con **Nanostores**, una librería de estado ultraligera compatible con Astro.

El fichero `src/stores/appStore.ts` define dos stores persistentes (guardados en `localStorage`):

| Store | Tipo | Contenido |
|---|---|---|
| `$user` | `persistentAtom<User | null>` | Datos del usuario autenticado y JWT |
| `$isAuthLoading` | `atom<boolean>` | Indica si se está comprobando la sesión al arrancar |
| `$cart` | `persistentMap<Record<string, CartItem>>` | Ítems del carrito del usuario |

### Justificación frente a otras alternativas

Se descartó el uso de React con Redux o Zustand porque Astro no requiere un framework de componentes para la mayor parte de las páginas. Nanostores es framework-agnostic: funciona con Astro, y si en el futuro una sección necesitara componentes React o Svelte, el mismo store sería compartido sin cambios.

---

## 8. Sistema de carrito: lógica híbrida

La gestión del carrito es uno de los aspectos más complejos del proyecto. Se implementa en `src/utils/cartService.ts` con una estrategia que diferencia entre usuario invitado y usuario autenticado:

**Usuario invitado:**  
Los ítems se guardan únicamente en `localStorage` mediante el `persistentMap` de Nanostores. No se realizan peticiones a la API.

**Usuario autenticado:**  
Los ítems se persisten en la colección `CartItem` de Strapi. Las acciones de añadir, modificar cantidad y eliminar se traducen en peticiones `POST`, `PUT` y `DELETE` a la API respectivamente.

**Sincronización tras el login:**  
La función `syncCartAfterLogin` migra los ítems del carrito de invitado a Strapi en el momento del inicio de sesión, garantizando que no se pierden productos añadidos antes de autenticarse.

**Creación de pedido:**  
La función `createOrder` envía el carrito completo como un pedido (`Order`) a Strapi, elimina todos los `CartItem` asociados y vacía el store local.

Strapi v5 utiliza `documentId` (cadena de texto) en lugar del identificador numérico clásico para las relaciones entre colecciones. Todo el servicio del carrito opera con estas cadenas para mantener compatibilidad con la versión actual del CMS.

---

## 9. Layout base y configuración dinámica del sitio

Todas las páginas utilizan el componente `src/layouts/Layout.astro` como envoltorio. Este componente realiza en cada petición una consulta a la colección `site-config` de Strapi, que almacena datos editables desde el panel de administración: nombre del sitio, eslogan, logo, favicon, color primario y configuración de redes sociales.

Esto permite que el propietario del sitio modifique estos valores sin necesidad de tocar el código ni recompilar el frontend.

El layout también gestiona:

- La detección y aplicación del tema (claro/oscuro) antes de que se pinte el HTML, evitando el parpadeo de contenido.
- Las metaetiquetas SEO (`<title>`, `<meta description>`, Open Graph).
- La etiqueta `<link rel="canonical">` con la URL actual.
- El loader global que se muestra mientras la página termina de cargar.

---

## 10. Estilos: variables CSS y Tailwind

Los estilos del proyecto combinan dos enfoques:

**Variables CSS en `src/styles/global.css`:**  
Se definen los tokens de diseño (colores, tipografía, espaciado, radio de borde) como variables CSS nativas. Esto permite que el cambio de tema (claro/oscuro) se gestione aplicando un atributo `data-theme` al elemento `<html>` y redefiniendo las variables.

**Tailwind CSS 4:**  
Se utiliza para las clases de composición de layout (flex, grid, padding, margen, etc.), lo que agiliza la maquetación sin escribir CSS adicional. La versión 4, basada en PostCSS y `@tailwindcss/vite`, reduce la configuración respecto a versiones anteriores.

---

## 11. Despliegue e infraestructura

El proyecto se despliega en un VPS de Hetzner con la siguiente configuración:

| Componente | Herramienta | Detalles |
|---|---|---|
| Servidor web | Nginx | Proxy inverso, HTTPS con Let's Encrypt |
| Gestión de procesos | PM2 | Mantiene activos el frontend y el backend |
| Base de datos | PostgreSQL | Gestionada por Strapi |
| Frontend | Astro (`npm run build`) | HTML estático servido por Nginx |
| Backend | Strapi (`npm run build`) | Proceso Node.js en el puerto 1337 |

PM2 garantiza que ambos procesos se reinician automáticamente si el servidor se reinicia o si uno de ellos falla, sin intervención manual.

---

## Conclusión

La arquitectura adoptada en TheHive responde a criterios de separación de responsabilidades, mantenibilidad y rendimiento. La división entre frontend estático (Astro) y CMS headless (Strapi) permite que cada capa evolucione de forma independiente. La organización por funcionalidad en los componentes, la centralización del cliente de API y el tipado estricto con TypeScript reducen la posibilidad de errores y facilitan la incorporación de nuevas funcionalidades sin refactorizaciones grandes.
