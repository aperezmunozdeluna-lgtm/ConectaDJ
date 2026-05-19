# Frontend

Esta carpeta contiene la parte visual de ConectaDJ. Esta hecha con React y Vite, y consume la API del backend Spring Boot.

## Que pantallas contiene

- Inicio con acceso a busqueda de DJs y ofertas.
- Registro e inicio de sesion.
- Buscador de DJs con filtros.
- Listado y detalle de ofertas.
- Panel de DJ.
- Panel de organizador y fiesta privada.
- Mensajeria.
- Panel de administrador.

La sesion se guarda en `localStorage` para que la interfaz sepa que panel y acciones debe mostrar a cada usuario. Es una gestion basica de sesion para el alcance academico del proyecto.

## API usada

La URL base esta en `src/services/api.js`:

```text
http://localhost:8080/api
```

Todas las llamadas al backend estan agrupadas en ese archivo para que las paginas no llamen a `fetch` directamente.

## Comandos

Instalar dependencias:

```powershell
npm install
```

Arrancar en desarrollo:

```powershell
npm run dev
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

- `src/App.jsx`: rutas de la aplicacion.
- `src/layouts/MainLayout.jsx`: cabecera, navegacion y sesion.
- `src/services/api.js`: llamadas HTTP al backend.
- `src/services/session.js`: lectura y guardado de la sesion.
- `src/pages/`: pantallas principales.
- `src/components/`: componentes reutilizables.
- `src/App.css`: estilos generales de la aplicacion.

El frontend usa HTML5 y CSS3, con reglas responsive para que las pantallas principales funcionen en escritorio y movil.
