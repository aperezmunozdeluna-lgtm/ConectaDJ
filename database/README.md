# Base de datos

ConectaDJ usa MySQL 8. La base de datos se llama `djmatch_db`.

## Instalación limpia

Para crear la base desde cero hay que ejecutar solo estos dos scripts:

1. `01_schema.sql`
2. `12_seed_demo_data.sql`

El primer script crea la base de datos y las once tablas del modelo. El segundo inserta datos de prueba para poder usar la aplicación sin crear todo a mano.

## Scripts intermedios

Los archivos `02_...` a `11_...` se mantienen como referencia técnica de la evolución de la base de datos. Sirven para ver cómo fue creciendo el esquema, pero no hace falta ejecutarlos en una instalación nueva.

## Tablas principales

- `users`: datos de acceso y rol.
- `dj_profiles`: perfil público del DJ.
- `organizer_profiles`: datos de particulares, salas y fiestas privadas.
- `music_styles`: estilos musicales disponibles.
- `dj_styles`: relación entre DJs y estilos.
- `job_offers`: ofertas publicadas por organizadores.
- `applications`: candidaturas de DJs a ofertas.
- `conversations`: conversaciones entre usuarios.
- `messages`: mensajes de cada conversación.
- `reviews`: valoraciones recibidas por DJs.
- `favorite_djs`: DJs guardados por organizadores.

El modelo usa claves foráneas para mantener la integridad referencial. También hay restricciones para evitar duplicados en candidaturas y favoritos. En las valoraciones, la regla de una valoración por organizador y DJ se comprueba desde el backend; reforzarla con una restricción `UNIQUE` en base de datos queda como mejora futura.

## Usuarios de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| Organizador | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

Los datos de prueba usan comprobaciones `WHERE NOT EXISTS`, así que el script de demo se puede ejecutar más de una vez sin duplicar los registros principales.
