**Archivo fuente principal:** `frontend/src/styles/global.css`

El sistema de estilos de TheHive se construye sobre una arquitectura de **design tokens** implementada con variables CSS nativas, expuestas como clases utilitarias a través de **Tailwind CSS v4**. El objetivo de esta arquitectura es mantener una única fuente de verdad para todos los valores visuales del proyecto (colores, tipografía, transiciones), garantizando coherencia visual en todos los componentes y facilitando el mantenimiento a largo plazo.
---
## Índice

1. [[#Arquitectura del sistema]]
2. [[#Paleta de colores]]
3. [[#Sistema de temas (modo claro y oscuro)]]
4. [[#Tipografía]]
5. [[#Transiciones y animaciones]]
6. [[#Componentes UI estilizados]]
---
## Arquitectura del sistema

El sistema combina tres capas que trabajan conjuntamente:

### 1. Tailwind CSS v4 — Motor de utilidades

Tailwind CSS v4 se importa directamente en `global.css`:
CSS
```
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
```

A diferencia de versiones anteriores, Tailwind v4 elimina el fichero `tailwind.config.js` y permite definir los tokens del proyecto directamente en CSS mediante el bloque `@theme {}`.

### 2. Bloque @theme {} — Registro de tokens

Es la pieza central del sistema. Todos los valores definidos dentro de él quedan registrados como tokens de diseño y Tailwind genera automáticamente las clases utilitarias correspondientes. Por ejemplo, definir `--color-primary` genera las clases `bg-primary`, `text-primary`, `border-primary`, etc.

CSS

```
@theme {
  --color-primary: #E89B00;
  --color-bg-secondary: #FAF7F2;
  --color-text-primary: #1A1A1A;
  /* ... */
}
```

### 3. Variables CSS en :root — Capa semántica

Los mismos tokens se reexponen como variables CSS estándar en `:root`, usando alias más cortos para facilitar el consumo en bloques `<style>` de componentes Astro.

CSS

```
:root {
  --primary: var(--color-primary);
  --bg-secondary: var(--color-bg-secondary);
  --text-primary: var(--color-text-primary);
}
```

---

## Paleta de colores

### Colores de marca

Inspirada en tonos cálidos de miel y madera.

|**Token CSS**|**Clase Tailwind**|**Valor**|**Descripción**|
|---|---|---|---|
|`--color-primary`|`*-primary`|`#E89B00`|Dorado miel. Color principal.|
|`--color-primary-dark`|`*-primary-dark`|`#C27A00`|Variante oscura. Estados hover.|
|`--color-primary-light`|`*-primary-light`|`#F6C65B`|Variante clara. Enlaces y fondos suaves.|
|`--color-primary-pale`|`*-primary-pale`|`#FFF3D6`|Tono tenue. Fondo botones outline.|
|`--color-secondary`|`*-secondary`|`#5C2E0C`|Marrón oscuro. Color secundario.|
|`--color-secondary-light`|`*-secondary-light`|`#7A3E12`|Variante clara del secundario.|
|`--color-accent`|`*-accent`|`#F2B705`|Color de acento complementario.|

> [!NOTE]
> 
> La notación `*-nombre` indica que el token genera múltiples clases según el prefijo: `bg-nombre`, `text-nombre`, `border-nombre`, etc.

### Colores de fondo

Jerarquía visual para secciones de página (Modo Claro).

|**Token CSS**|**Clase Tailwind**|**Valor**|**Descripción**|
|---|---|---|---|
|`--color-bg-primary`|`bg-bg-primary`|`#FFFFFF`|Fondo base de la página.|
|`--color-bg-secondary`|`bg-bg-secondary`|`#FAF7F2`|Fondo de secciones y tarjetas.|
|`--color-bg-tertiary`|`bg-bg-tertiary`|`#F3EEE6`|Fondo elementos anidados.|
|`--color-bg-footer`|`bg-bg-footer`|`#FFF3D6`|Fondo específico del footer.|

### Colores de texto

|**Token CSS**|**Clase Tailwind**|**Valor**|**Descripción**|
|---|---|---|---|
|`--color-text-primary`|`text-text-primary`|`#1A1A1A`|Texto principal y titulares.|
|`--color-text-secondary`|`text-text-secondary`|`#5B5B5B`|Subtítulos y metadatos.|
|`--color-text-tertiary`|`text-text-tertiary`|`#8A8A8A`|Pies de página y marcas de tiempo.|
|`--color-text-inverse`|`text-text-inverse`|`#FFFFFF`|Texto sobre fondos oscuros/color.|

### Colores de borde y estado

|**Token CSS**|**Valor**|**Uso previsto**|
|---|---|---|
|`--color-border-default`|`#E8E2D8`|Borde estándar de inputs y tarjetas.|
|`--color-divider`|`#DDD6C8`|Líneas divisorias horizontales/verticales.|
|`--color-success`|`#15803D`|Operaciones completadas con éxito.|
|`--color-error`|`#DC2626`|Fallos y validaciones incorrectas.|
|`--color-warning`|`#D97706`|Avisos de alerta moderada.|
|`--color-info`|`#2563EB`|Mensajes informativos neutros.|

---

## Sistema de temas (modo claro y oscuro)

### Cómo funciona

1. **Capa 1 — Detección automática:** Media query `prefers-color-scheme`.
    
2. **Capa 2 — Preferencia manual:** Atributo `data-theme` en `<html>` ("light" o "dark").
    
3. **Capa 3 — Persistencia:** Uso de `localStorage` para evitar el parpadeo de tema (FOUC).
    

### Valores en modo oscuro

|**Token**|**Modo claro**|**Modo oscuro**|
|---|---|---|
|`--color-bg-primary`|`#FFFFFF`|`#111827`|
|`--color-bg-secondary`|`#FAF7F2`|`#1F2937`|
|`--color-text-primary`|`#1A1A1A`|`#F9FAFB`|
|`--color-border-default`|`#E8E2D8`|`#374151`|
|`--color-primary`|`#E89B00`|`#FBBF24`|

---

## Tipografía

### Escala tipográfica fluida

Se utiliza la función `clamp(mínimo, preferido, máximo)` para evitar el uso excesivo de media queries.

|**Elemento**|**Tamaño mín.**|**Dinámico**|**Tamaño máx.**|**Margen inf.**|
|---|---|---|---|---|
|h1|2rem|5vw|3.5rem|1rem - 1.5rem|
|h2|1.5rem|4vw|2.5rem|0.75rem - 1.25rem|
|p|1rem|1.5vw|1.125rem|0.75rem - 1rem|

---

## Transiciones y animaciones

|**Variable**|**Valor**|**Propósito**|
|---|---|---|
|`--transition-fast`|150ms|Feedback inmediato (clics, iconos).|
|`--transition-base`|250ms|Estándar (colores, fondos, bordes).|
|`--transition-slow`|350ms|Apertura de menús y paneles.|

---

## Componentes UI estilizados

### Button.astro

Ruta: `frontend/src/components/ui/Button.astro`

**Props principales:**

- `variant`: primary, secondary, outline, ghost.
    
- `link`: Si existe, renderiza `<a>`, si no, `<button>`.
    

**Variantes:**

1. **primary**: Acción principal (Dorado/Blanco).
    
2. **secondary**: Acción secundaria (Marrón/Blanco).
    
3. **outline**: Acción terciaria (Borde dorado).
    
4. **ghost**: Mínima prominencia (Solo texto).
    

### Breadcrumbs.astro

Navegación secundaria dinámica basada en `Astro.url.pathname`.

|**Prop**|**Tipo**|**Defecto**|**Descripción**|
|---|---|---|---|
|`homeLabel`|string|"Home"|Etiqueta raíz.|
|`separator`|string|">"|Carácter separador.|