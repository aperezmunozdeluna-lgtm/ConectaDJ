# Seguridad basica y responsive

## Seguridad implementada

La aplicacion tiene una seguridad basica, suficiente para mostrar el flujo del proyecto en local:

- El login comprueba correo y contrasena contra la tabla `users`.
- La sesion se guarda en `localStorage` para que React sepa el rol activo.
- El frontend muestra u oculta acciones segun el rol del usuario.
- El panel de administracion llama al backend con la cabecera `X-User-Email`.
- El backend comprueba que ese correo exista, este activo y tenga rol `admin`.

No se ha usado Spring Security ni JWT. Por eso no se debe presentar como seguridad de produccion. La mejora natural seria guardar contrasenas con BCrypt y proteger las rutas con tokens o sesiones reales.

Tambien seria recomendable que en produccion las credenciales de base de datos y cualquier clave sensible se gestionasen siempre con variables de entorno. El proyecto ya permite sobrescribir la conexion con `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`.

## Validaciones del backend

El backend valida varios casos antes de guardar datos:

- Registro con email valido, nombre minimo y contrasena minima.
- Registro solo con roles permitidos: `dj`, `organizer` y `private_party`.
- Los usuarios no pueden registrarse directamente como administradores desde el formulario publico.
- Ofertas con titulo, ciudad, descripcion y organizador existente.
- Presupuesto, duracion y experiencia sin valores negativos.
- Candidaturas duplicadas bloqueadas por oferta y DJ.
- Candidaturas solo permitidas en ofertas abiertas.
- Mensajes no vacios y enviados por usuarios de la conversacion.
- Valoraciones entre 1 y 5.
- Imagenes limitadas a JPG, PNG y WEBP.

Los estilos musicales se tratan como catalogo controlado. La aplicacion los consulta para filtros y formularios, pero la edicion del catalogo queda fuera del alcance actual.

## Validaciones del frontend

El frontend hace comprobaciones para evitar errores de uso:

- Formularios con campos obligatorios.
- Mensajes claros si el backend no esta arrancado.
- Control visual de acciones por rol: DJ, organizador, fiesta privada o admin.
- Avisos cuando una accion necesita iniciar sesion.

Estas validaciones mejoran la experiencia, pero las validaciones importantes tambien estan en backend porque el frontend se puede modificar desde el navegador.

## Responsive

La interfaz esta preparada para escritorio, tablet y movil con CSS responsive.

Pantallas a revisar antes de entregar:

| Pantalla | Que comprobar |
| --- | --- |
| Inicio | Hero, tarjetas y botones sin desbordarse. |
| Buscar DJs | Filtros y tarjetas legibles en movil. |
| Ofertas | Imagenes, filtros y botones alineados. |
| Detalle de oferta | Datos de la oferta y formulario de candidatura. |
| Mensajes | Lista de conversaciones y chat usable en movil. |
| Panel DJ | Perfil y candidaturas sin scroll horizontal. |
| Panel organizador | Perfil, ofertas, favoritos y candidaturas. |
| Panel fiesta privada | Mismo flujo que organizador, con textos correctos. |
| Panel admin | Resumen, usuarios y ofertas con botones visibles. |

Prueba rapida:

1. Abrir `http://localhost:5173`.
2. Abrir herramientas de desarrollador.
3. Activar modo dispositivo.
4. Probar anchos aproximados de 390 px, 768 px y escritorio.
