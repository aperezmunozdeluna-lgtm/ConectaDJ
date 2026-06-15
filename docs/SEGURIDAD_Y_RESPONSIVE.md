# Seguridad básica y responsive

## Seguridad implementada

La aplicación tiene una seguridad básica, suficiente para mostrar el flujo del proyecto en local y para una entrega académica:

- El login comprueba correo y contraseña contra la tabla `users`.
- La sesión se guarda en `localStorage` para que React sepa el rol activo.
- El frontend muestra u oculta acciones según el rol del usuario.
- El panel de administración llama al backend con la cabecera `X-User-Email`.
- El backend comprueba que ese correo exista, esté activo y tenga rol `admin`.

No se ha usado Spring Security ni JWT. Por eso no se debe presentar como seguridad de producción. La mejora natural sería guardar contraseñas con BCrypt y proteger las rutas con tokens o sesiones reales.

También sería recomendable que en producción las credenciales de base de datos y cualquier clave sensible se gestionasen siempre con variables de entorno. El proyecto ya permite sobrescribir la conexión con `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`.

## Validaciones del backend

El backend valida varios casos antes de guardar datos:

- Registro con email válido, nombre mínimo y contraseña mínima.
- Registro solo con roles permitidos: `dj`, `organizer` y `private_party`.
- Los usuarios no pueden registrarse directamente como administradores desde el formulario público.
- Ofertas con título, ciudad, descripción y organizador existente.
- Presupuesto, duración y experiencia sin valores negativos.
- Candidaturas duplicadas bloqueadas por oferta y DJ.
- Candidaturas solo permitidas en ofertas abiertas.
- Mensajes no vacíos y enviados por usuarios de la conversación.
- Las fiestas privadas solo pueden iniciar conversaciones con DJs.
- Valoraciones entre 1 y 5.
- Imágenes limitadas a JPG, PNG y WEBP.

Los estilos musicales se tratan como catálogo controlado. La aplicación los consulta para filtros y formularios, pero la edición del catálogo queda fuera del alcance actual.

## Validaciones del frontend

El frontend hace comprobaciones para evitar errores de uso:

- Formularios con campos obligatorios.
- Mensajes claros si el backend no está arrancado.
- Control visual de acciones por rol: DJ, organizador, fiesta privada o admin.
- Avisos cuando una acción necesita iniciar sesión.

Estas validaciones mejoran la experiencia, pero las validaciones importantes también están en backend porque el frontend se puede modificar desde el navegador.

## Responsive

La interfaz está preparada para escritorio, tablet y móvil con CSS responsive.

Pantallas a revisar antes de entregar:

| Pantalla | Qué comprobar |
| --- | --- |
| Inicio | Hero, tarjetas y botones sin desbordarse. |
| Buscar DJs | Filtros y tarjetas legibles en móvil. |
| Ofertas | Imágenes, filtros y botones alineados. |
| Detalle de oferta | Datos de la oferta y formulario de candidatura. |
| Mensajes | Lista de conversaciones y chat usable en móvil. |
| Panel DJ | Perfil y candidaturas sin scroll horizontal. |
| Panel organizador | Perfil, ofertas, favoritos y candidaturas. |
| Panel fiesta privada | Mismo flujo que organizador, con textos correctos. |
| Panel admin | Resumen, usuarios y ofertas con botones visibles. |

Prueba rápida:

1. Abrir `http://localhost:5173`.
2. Abrir herramientas de desarrollador.
3. Activar modo dispositivo.
4. Probar anchos aproximados de 390 px, 768 px y escritorio.
