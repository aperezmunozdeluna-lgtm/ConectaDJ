# Endpoints principales

El backend expone una API REST bajo la ruta base:

```text
http://localhost:8080/api
```

El frontend usa estas rutas desde `frontend/src/services/api.js`.

## Salud del servidor

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/health` | Comprobar que Spring Boot está arrancado. |

## Autenticación

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/auth/register` | Registrar un usuario DJ, organizador o fiesta privada. |
| POST | `/api/auth/login` | Iniciar sesión y devolver los datos básicos del usuario. |

En el registro, el backend crea también el perfil asociado: `dj_profiles` para DJs y `organizer_profiles` para organizadores o fiestas privadas.

## DJs y estilos

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/djs` | Listar DJs. Acepta filtros por ciudad, experiencia, disponibilidad y estilo. |
| GET | `/api/djs/{id}` | Ver el detalle de un DJ. |
| PUT | `/api/djs/{id}` | Actualizar el perfil de un DJ. |
| GET | `/api/music-styles` | Listar estilos musicales. |

Los estilos salen del catálogo `music_styles`. Se muestran en perfiles y filtros; la edición de estilos desde el panel queda como mejora futura.

## Organizadores

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/organizers/{id}` | Ver el perfil de un organizador, sala o fiesta privada. |
| PUT | `/api/organizers/{id}` | Actualizar datos del perfil de organizador. |

## Ofertas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/offers` | Listar ofertas. Acepta filtros por estado, ciudad, presupuesto, experiencia y estilo. |
| GET | `/api/offers/{id}` | Ver una oferta concreta. |
| GET | `/api/offers/organizer/{organizerId}` | Listar ofertas de un organizador. |
| POST | `/api/offers` | Crear una oferta. |
| PUT | `/api/offers/{id}` | Editar una oferta. |
| PATCH | `/api/offers/{id}/status` | Cambiar el estado de una oferta: `open`, `closed` o `cancelled`. |

## Candidaturas

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/applications` | Crear una candidatura de un DJ a una oferta. |
| GET | `/api/applications/dj/{djProfileId}` | Ver candidaturas enviadas por un DJ. |
| GET | `/api/applications/organizer/{organizerId}` | Ver candidaturas recibidas por un organizador. |
| PATCH | `/api/applications/{id}/status` | Cambiar estado: `pending`, `accepted`, `rejected` o `withdrawn`. |

## Mensajería

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/users` | Listar usuarios activos con datos resumidos. |
| GET | `/api/conversations/user/{userId}` | Listar conversaciones de un usuario. |
| GET | `/api/conversations/user/{userId}/unread` | Contar mensajes no leídos por conversación. |
| POST | `/api/conversations` | Crear una conversación o recuperar una existente. |
| GET | `/api/conversations/{conversationId}/messages` | Listar mensajes de una conversación. |
| POST | `/api/messages` | Enviar un mensaje. |
| PATCH | `/api/conversations/{conversationId}/read` | Marcar mensajes como leídos. |

La mensajería se crea entre usuarios activos de la plataforma. Para la demo se recomienda enseñar el flujo principal entre organizadores o fiestas privadas y DJs. Las fiestas privadas quedan limitadas a conversaciones con DJs, que es el caso de uso previsto para ese rol.

## Imágenes

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/uploads/images` | Subir imagen JPG, PNG o WEBP. |
| GET | `/uploads/images/{archivo}` | Servir una imagen subida. |

## Favoritos y valoraciones

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/favorites/organizer/{organizerId}` | Listar DJs favoritos de un organizador. |
| POST | `/api/favorites` | Guardar un DJ como favorito. |
| DELETE | `/api/favorites/organizer/{organizerId}/dj/{djProfileId}` | Quitar un DJ de favoritos. |
| GET | `/api/djs/{djProfileId}/reviews` | Ver valoraciones de un DJ. |
| POST | `/api/reviews` | Crear una valoración. |

## Administración

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/admin/summary` | Resumen de usuarios, DJs, ofertas, candidaturas y conversaciones. |
| GET | `/api/admin/users` | Listar usuarios desde el panel admin. |
| GET | `/api/admin/offers` | Listar ofertas desde el panel admin. |
| PATCH | `/api/admin/users/{userId}/active` | Activar o desactivar un usuario. |
| PATCH | `/api/admin/offers/{offerId}/status` | Cambiar el estado de una oferta desde administración. |

Las rutas de administración comprueban la cabecera `X-User-Email` con el correo de un usuario que tenga rol `admin`.

La API está organizada por recursos, igual que se describe en la memoria: autenticación, DJs, organizadores, ofertas, candidaturas, mensajes, valoraciones, favoritos y administración.
