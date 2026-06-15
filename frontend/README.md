# Frontend

Esta carpeta contiene la parte visual de ConectaDJ. Está hecha con React y Vite, y consume la API del backend Spring Boot.

## Qué pantallas contiene

- Inicio con acceso a búsqueda de DJs y ofertas.
- Registro e inicio de sesión.
- Buscador de DJs con filtros.
- Listado y detalle de ofertas.
- Panel de DJ.
- Panel de organizador y fiesta privada.
- Mensajería.
- Panel de administrador.

La sesión se guarda en `localStorage` para que la interfaz sepa qué panel y acciones debe mostrar a cada usuario. Es una gestión básica de sesión para el alcance académico del proyecto.

## API usada

La URL base está en `src/services/api.js`:

```text
http://localhost:8080/api
```

Todas las llamadas al backend están agrupadas en ese archivo para que las páginas no llamen a `fetch` directamente.

## Comandos

Instalar dependencias:

```powershell
npm install
```

Arrancar en desarrollo:

```powershell
npm run dev -- --host localhost --port 5173 --strictPort
```

Compilar:

```powershell
npm run build
```

Pasar ESLint:

```powershell
npm run lint
```

## Archivos principales

- `src/App.jsx`: rutas de la aplicación.
- `src/layouts/MainLayout.jsx`: cabecera, navegación y sesión.
- `src/services/api.js`: llamadas HTTP al backend.
- `src/services/session.js`: lectura y guardado de la sesión.
- `src/pages/`: pantallas principales.
- `src/components/`: componentes reutilizables.
- `src/App.css`: estilos generales de la aplicación.

El frontend usa HTML5 y CSS3, con reglas responsive para que las pantallas principales funcionen en escritorio y móvil.
