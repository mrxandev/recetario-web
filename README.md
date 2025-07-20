# Recetario Web

Una aplicación web moderna de recetas construida con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Autenticación de usuarios** con Supabase Auth
- **Búsqueda avanzada** de recetas con filtros dinámicos
- **Sistema de favoritos** personalizado por usuario
- **Página "Mis Recetas"** con estadísticas y gestión de favoritos
- **Interfaz responsive** con diseño moderno y consistente
- **Animaciones suaves** y transiciones mejoradas

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3 con configuración personalizada
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Routing**: React Router DOM
- **Iconos**: Lucide React

## 🎨 Diseño

El proyecto utiliza un sistema de diseño unificado con:

### Paleta de Colores
- **Primario**: Azules (Indigo) para elementos principales
- **Secundario**: Púrpuras para acentos
- **Acento**: Naranjas para elementos destacados
- **Neutros**: Grises para fondos y texto

### CSS y Estilos
- **Tailwind CSS**: Sistema principal de estilos
- **CSS Global mínimo**: Solo para animaciones personalizadas y scrollbar
- **Animaciones**: float, glow, shimmer para mejorar UX

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticación
│   ├── general/       # Componentes globales (Navbar, Hero)
│   └── recipes/       # Componentes relacionados con recetas
├── context/           # Context providers (Auth)
├── pages/             # Páginas principales
├── services/          # Servicios de API (Supabase)
└── assets/           # Recursos estáticos
```

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repo]
   cd recetario-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   ```

## 📋 Páginas Principales

- **/** - Página de inicio con hero y recetas destacadas
- **/recetas** - Búsqueda avanzada con todos los filtros
- **/misrecetas** - Recetas favoritas del usuario (solo autenticados)
- **/login** - Página de inicio de sesión
- **/signup** - Página de registro

## 🔧 Configuración

### Tailwind CSS
El proyecto incluye una configuración personalizada de Tailwind con:
- Colores extendidos (primary, secondary, accent)
- Animaciones personalizadas
- Fuente Inter como predeterminada

### Supabase
Estructura de base de datos requerida:
- Tabla `recipes` con campos para título, descripción, ingredientes, etc.
- Tabla `user_favorites` para el sistema de favoritos
- RLS (Row Level Security) configurado apropiadamentepeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
