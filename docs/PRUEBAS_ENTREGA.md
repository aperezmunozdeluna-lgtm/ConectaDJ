# Pruebas de entrega

Este recorrido sirve para comprobar que el proyecto funciona antes de subirlo o enseñarlo.

## Comprobación técnica

Backend:

```powershell
cd backend
.\mvnw.cmd clean test
```

Frontend:

```powershell
cd frontend
npm run build
```

Como comprobación adicional del repositorio se puede ejecutar también `npm run lint`.

## Resumen de pruebas

| Prueba | Resultado esperado |
| --- | --- |
| Registro de usuario DJ | El usuario se crea correctamente. |
| Login de usuario | El usuario accede a la aplicación. |
| Edición del perfil DJ | Los datos se guardan y se muestran actualizados. |
| Búsqueda de DJs | Se muestran resultados según los filtros. |
| Creación de oferta | El organizador puede publicar una oferta. |
| Candidatura a una oferta | El DJ puede candidatarse. |
| Cambio de estado de candidatura | El organizador acepta o rechaza la candidatura. |
| Mensajería | Se crea una conversación y se guardan mensajes. |
| Valoración | Se guarda una valoración sobre un DJ. |
| Panel de administración | Se listan usuarios y ofertas y se cambian estados. |
| Compilación frontend | `npm run build` finaliza sin errores. |
| Prueba backend | `mvnw test` ejecuta correctamente las pruebas. |

## Flujo principal

1. Entrar con `organizador@example.com` y contraseña `demo123`.
2. Ir al panel de particular.
3. Crear una oferta nueva con título, ciudad, descripción, presupuesto y fecha.
4. Cerrar sesión.
5. Entrar con `alex@example.com` y contraseña `demo123`.
6. Ir a ofertas.
7. Abrir la oferta creada y enviar una candidatura.
8. Cerrar sesión.
9. Volver a entrar como `organizador@example.com`.
10. Revisar candidaturas recibidas y aceptar o rechazar la candidatura del DJ.
11. Abrir mensajes y comprobar que se puede conversar con el DJ.
12. Enviar un mensaje.
13. Entrar de nuevo como DJ y responder.

## Flujo de favoritos y valoraciones

1. Entrar como `organizador@example.com`.
2. Ir a buscar DJs.
3. Guardar un DJ como favorito.
4. Comprobar que aparece en el panel de organizador.
5. Abrir el perfil del DJ.
6. Crear una valoración entre 1 y 5.
7. Comprobar que la valoración aparece en el perfil.

## Flujo de fiesta privada

1. Entrar con `fiestaprivada@example.com` y contraseña `demo123`.
2. Revisar el panel de fiesta privada.
3. Crear una oferta.
4. Comprobar que la oferta aparece en el listado.
5. Probar mensajería con un DJ.

## Flujo de administración

1. Entrar con `admin@example.com` y contraseña `demo123`.
2. Abrir el panel de administración.
3. Revisar resumen de usuarios, DJs, ofertas, candidaturas y conversaciones.
4. Activar o desactivar un usuario que no sea la cuenta admin actual.
5. Cambiar el estado de una oferta.

## Revisión responsive

Revisar estas páginas en escritorio, tablet y móvil:

- Inicio.
- Buscar DJs.
- Ofertas.
- Detalle de oferta.
- Mensajes.
- Panel DJ.
- Panel organizador.
- Panel fiesta privada.
- Panel administrador.

Puntos importantes:

- Sin scroll horizontal.
- Botones dentro de su contenedor.
- Formularios legibles.
- Tarjetas sin textos desbordados.
- Mensajería usable en pantalla pequeña.

La memoria recoge como referencia pruebas en móvil desde 360 px de ancho y escritorio a partir de 1024 px.
