# Base de datos

ConectaDJ usa MySQL 8. La base de datos se llama `djmatch_db`.

## Instalacion limpia

Para crear la base desde cero hay que ejecutar solo estos dos scripts:

1. `01_schema.sql`
2. `12_seed_demo_data.sql`

El primer script crea la base de datos y las once tablas del modelo. El segundo inserta datos de prueba para poder usar la aplicacion sin crear todo a mano.

## Scripts intermedios

Los archivos `02_...` a `11_...` se mantienen como referencia tecnica de la evolucion de la base de datos. Sirven para ver como fue creciendo el esquema, pero no hace falta ejecutarlos en una instalacion nueva.

## Tablas principales

- `users`: datos de acceso y rol.
- `dj_profiles`: perfil publico del DJ.
- `organizer_profiles`: datos de particulares, salas y fiestas privadas.
- `music_styles`: estilos musicales disponibles.
- `dj_styles`: relacion entre DJs y estilos.
- `job_offers`: ofertas publicadas por organizadores.
- `applications`: candidaturas de DJs a ofertas.
- `conversations`: conversaciones entre usuarios.
- `messages`: mensajes de cada conversacion.
- `reviews`: valoraciones recibidas por DJs.
- `favorite_djs`: DJs guardados por organizadores.

El modelo usa claves foraneas para mantener la integridad referencial. Tambien hay restricciones para evitar duplicados en candidaturas y favoritos. En las valoraciones, la regla de una valoracion por organizador y DJ se comprueba desde el backend; reforzarla con una restriccion `UNIQUE` en base de datos queda como mejora futura.

## Usuarios de prueba

| Rol | Correo | Contrasena |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| Particular / sala | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

Los datos de prueba usan comprobaciones `WHERE NOT EXISTS`, asi que el script de demo se puede ejecutar mas de una vez sin duplicar los registros principales.
