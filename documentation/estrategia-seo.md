# Estrategia de Posicionamiento SEO — TheHive

**Proyecto:** TheHive — Tienda online de productos de apicultura  
**Módulo:** Proyecto Integrador — 2.º DAW  
**Fecha:** Marzo 2026

---

## Introducción

TheHive es una tienda de comercio electrónico orientada a la venta de miel artesanal y productos derivados de la apicultura. Al tratarse de un negocio online cuya visibilidad depende directamente de su presencia en los motores de búsqueda, se ha diseñado una estrategia de SEO (*Search Engine Optimization*) que cubre tanto los aspectos técnicos de la plataforma como la organización del contenido publicado.

El objetivo de este documento es describir las decisiones de diseño y desarrollo adoptadas para maximizar el posicionamiento orgánico del sitio, así como explicar de qué manera cada decisión contribuye a atraer tráfico cualificado sin recurrir a publicidad de pago.

---

## 1. Selección y asignación de palabras clave

El primer paso de la estrategia ha sido identificar los términos que los usuarios potenciales introducen en Google cuando buscan los productos que TheHive ofrece. A estas consultas se las denomina **palabras clave** (*keywords*).

Se ha seguido un enfoque orientado a **palabras clave de cola larga** (*long-tail keywords*): consultas más específicas y con menor competencia, pero con una intención de compra más clara por parte del usuario.

### Distribución de keywords por sección del sitio

| Página | Keyword principal | Propósito |
|---|---|---|
| Inicio (`/`) | "tienda miel online España" | Captar tráfico general de marca |
| Catálogo (`/productos`) | "miel ecológica online" | Atraer compradores con intención de compra |
| Categoría (`/categoria/[slug]`) | "[tipo de miel] comprar" | Segmentar por tipo de producto |
| Producto (`/productos/[slug]`) | "[nombre del producto] precio" | Conversión directa a venta |
| Blog (`/blog`) | Variadas según artículo | Atraer tráfico informacional y de investigación |
| Sobre nosotros (`/sobre-nosotros`) | "apicultores artesanales" | Reforzar la autoridad y confianza de la marca |

---

## 2. SEO On-Page: optimización de cada página

El SEO On-Page comprende todas las decisiones de contenido y estructura que se toman en cada página individualmente.

### 2.1 Metaetiquetas: título y descripción

Cada página del sitio tiene definidas sus propias metaetiquetas `<title>` y `<meta name="description">` a través del componente `Layout.astro`. Estas etiquetas son los primeros elementos que Google lee al indexar una página y los que aparecen directamente en los resultados de búsqueda.

- El `<title>` incorpora la keyword principal de la página y el nombre del sitio, siguiendo el formato: `[Keyword principal] | TheHive`.
- La `<meta description>` resume el contenido de la página en no más de 160 caracteres, con un enfoque persuasivo que favorece el clic.

```astro
---
// Ejemplo de uso en productos.astro
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Miel Ecológica Online"
  description="Compra miel ecológica y artesanal directamente del apicultor. Sin intermediarios, con envío a toda España."
>
```

### 2.2 Jerarquía de encabezados

Cada página cuenta con un único encabezado de nivel 1 (`<h1>`) que contiene la keyword principal. Los niveles inferiores (`<h2>`, `<h3>`) estructuran el contenido en secciones y subsecciones de forma jerárquica, facilitando tanto la comprensión del usuario como el rastreo de Google.

### 2.3 URLs semánticas

Todas las URLs del sitio son **legibles, descriptivas y en minúsculas**, prescindiendo de parámetros numéricos o identificadores internos. Los valores `slug` de cada producto y artículo de blog se gestionan directamente en Strapi.

| Patrón evitado | Patrón adoptado |
|---|---|
| `/producto?id=47` | `/productos/miel-de-romero-500g` |
| `/cat/1/subcategoria` | `/categoria/mieles-monofloral` |

### 2.4 Textos alternativos en imágenes

Todas las imágenes del catálogo y del contenido editorial incluyen el atributo `alt` con una descripción textual del elemento representado. Esto permite a Google indexar el contenido visual y mejora la accesibilidad del sitio para usuarios con tecnologías de asistencia.

### 2.5 Enlazado interno

Se ha establecido una estructura de enlaces internos entre páginas del mismo sitio: desde el blog hacia los productos relacionados, y desde la página de inicio hacia las categorías principales. Este enlazado facilita el rastreo del sitio por parte de Google y distribuye la autoridad entre las páginas más relevantes.

---

## 3. SEO Técnico

El SEO técnico agrupa los elementos de infraestructura y desarrollo que condicionan la capacidad de Google para rastrear, indexar y posicionar el sitio.

### 3.1 Sitemap XML

Se ha integrado el paquete oficial `@astrojs/sitemap`, que genera automáticamente un archivo `sitemap-index.xml` con todas las URLs públicas del sitio en cada compilación. Este archivo se encuentra disponible en la raíz del dominio y ha sido enviado a Google Search Console para facilitar la indexación.

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thehive.es',
  integrations: [sitemap()],
});
```

### 3.2 Archivo robots.txt

El archivo `robots.txt`, ubicado en el directorio `public/`, indica a los rastreadores de los motores de búsqueda qué secciones del sitio pueden indexar y cuáles no. Las páginas privadas del usuario (perfil, carrito, checkout, login y registro) quedan excluidas de la indexación, evitando que aparezcan en los resultados de búsqueda.

```
User-agent: *
Allow: /
Disallow: /perfil
Disallow: /carrito
Disallow: /checkout
Disallow: /login
Disallow: /registro

Sitemap: https://thehive.es/sitemap-index.xml
```

### 3.3 Datos estructurados (Schema.org)

En las páginas de producto se ha implementado marcado de datos estructurados en formato **JSON-LD** siguiendo el estándar Schema.org. Esto permite a Google comprender que la página representa un producto comercial con precio, disponibilidad y descripción, lo que puede resultar en la aparición de **fragmentos enriquecidos** (*rich snippets*) en los resultados de búsqueda.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Miel de Romero Ecológica · 500g",
  "description": "Miel monofloral de romero recolectada en colmenas propias...",
  "offers": {
    "@type": "Offer",
    "price": "12.50",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

Adicionalmente, el layout general incluye datos de tipo `LocalBusiness` para identificar a TheHive como empresa ante los motores de búsqueda.

### 3.4 Protocolo Open Graph

Se han añadido metaetiquetas del protocolo **Open Graph** en el componente `Layout.astro`. Estas etiquetas controlan la vista previa que se genera al compartir un enlace del sitio en redes sociales, mostrando título, descripción e imagen de forma controlada.

```astro
<meta property="og:title" content={`${title} | TheHive`} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:locale" content="es_ES" />
```

### 3.5 Rendimiento y Core Web Vitals

Google utiliza los **Core Web Vitals** como señal de posicionamiento. Se trata de tres métricas que miden la experiencia de carga y la estabilidad visual de la página:

| Métrica | Descripción | Umbral óptimo |
|---|---|---|
| **LCP** — Largest Contentful Paint | Tiempo hasta que el elemento más grande es visible | < 2,5 s |
| **INP** — Interaction to Next Paint | Tiempo de respuesta ante la primera interacción | < 200 ms |
| **CLS** — Cumulative Layout Shift | Estabilidad visual durante la carga | < 0,1 |

Las decisiones técnicas adoptadas para cumplir con estos umbrales son:

- **Optimización de imágenes:** uso del componente `<Image>` de Astro, que genera automáticamente versiones en formato WebP y añade carga diferida (*lazy loading*).
- **Renderizado estático:** Astro genera HTML estático en tiempo de compilación, lo que elimina el tiempo de procesamiento en servidor en cada petición.
- **Compresión en servidor:** Nginx está configurado con compresión `gzip` para reducir el tamaño de las respuestas HTTP.

### 3.6 HTTPS

El sitio opera bajo protocolo HTTPS mediante un certificado SSL emitido por Let's Encrypt y gestionado automáticamente por Certbot a través de Nginx. Google considera HTTPS como un factor de posicionamiento y muestra advertencias de seguridad en sitios que no lo usan.

---

## 4. Estrategia de contenido

Más allá de los factores técnicos, Google premia los sitios que publican contenido original, relevante y actualizado de forma periódica.

### 4.1 El blog como motor de tráfico

La sección `/blog` cumple un papel estratégico: cada artículo publicado es una nueva URL indexable que puede posicionarse para consultas informacionales. Un usuario que busca "beneficios de la miel de tomillo" puede llegar al sitio a través de un artículo del blog y, desde allí, acceder al catálogo de productos.

Se ha planificado una línea editorial que combina artículos divulgativos sobre apicultura y propiedades de la miel con contenidos más orientados a la compra.

### 4.2 Descripciones de producto únicas

Cada ficha de producto incluye una descripción redactada específicamente para ese artículo, sin reutilizar texto de proveedores o de otras páginas del sitio. El contenido duplicado es penalizado por Google, por lo que la unicidad del texto es un requisito mínimo.

---

## 5. SEO Local

Si TheHive opera desde una ubicación física o trabaja con apicultores de una región concreta, el **SEO local** permite aparecer en resultados geolocalizados y en Google Maps.

Se ha previsto la creación de un perfil en **Google Business Profile** con los datos de la empresa (nombre, dirección, teléfono, horario y enlace al sitio). Asimismo, el contenido del sitio incorpora referencias geográficas en las descripciones de producto y en la página de "Sobre nosotros" para reforzar la relevancia local.

---

## 6. Seguimiento y medición

La estrategia SEO no concluye con la implementación técnica: requiere un seguimiento continuo mediante herramientas de análisis.

| Herramienta | Función |
|---|---|
| Google Search Console | Monitorización de indexación, errores de rastreo y consultas de búsqueda reales |
| PageSpeed Insights | Medición periódica de los Core Web Vitals |
| Schema Markup Validator | Verificación de la validez de los datos estructurados |

---

## 7. Estado de implementación

| Elemento | Estado |
|---|---|
| `<title>` y `<meta description>` únicos por página | Implementado |
| Etiquetas Open Graph en `Layout.astro` | Implementado |
| Sitemap XML generado y enviado a Search Console | Implementado |
| `robots.txt` en `/public` | Pendiente |
| Certificado SSL activo | Pendiente |
| Rendimiento > 80 en PageSpeed Insights | Pendiente |
| Imágenes con atributo `alt` | Implementado |
| Datos estructurados Schema.org en productos | Pendiente |
| Google Business Profile | Pendiente |

---

## Conclusión

La estrategia SEO de TheHive se articula en torno a tres ejes complementarios: una base técnica sólida que permite a Google rastrear e indexar el sitio sin fricciones, una organización del contenido alineada con las intenciones de búsqueda de los usuarios, y un plan de contenido editorial orientado a atraer tráfico orgánico de forma sostenida. La combinación de estas tres líneas de actuación permite al sitio competir en los resultados de búsqueda sin depender de inversión publicitaria y con un posicionamiento que mejora progresivamente con el tiempo.
