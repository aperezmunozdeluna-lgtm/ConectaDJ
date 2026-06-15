# Guía completa de arranque y demo de ConectaDJ

Este documento sirve como apoyo para arrancar ConectaDJ en local y preparar la demostración práctica del TFG.

La aplicación está pensada para ejecutarse en estos puertos:

| Parte | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8080` |
| API base | `http://localhost:8080/api` |
| Comprobación rápida backend | `http://localhost:8080/api/health` |

No cambies estos puertos para la presentación, porque son los que aparecen en la documentación y en la presentación del proyecto.

## 1. Qué debe estar preparado antes de arrancar

Antes de iniciar la demo conviene revisar estos puntos:

| Requisito | Comprobación |
|---|---|
| Java | `java -version` |
| Node.js | `node -v` |
| npm | `npm -v` |
| MySQL | Servicio `MySQL80` iniciado |
| Base de datos | Debe existir `djmatch_db` |
| Dependencias frontend | Debe existir `frontend/node_modules/` |

El backend usa por defecto esta configuración local:

```text
Base de datos: djmatch_db
Usuario MySQL: root
Contraseña MySQL: root1234
Puerto MySQL: 3306
```

Estas credenciales son solo para entorno local de desarrollo y pruebas. No se deben presentar como credenciales de producción.

## 2. Preparar la base de datos

Si la base de datos ya está creada y tiene datos, no hace falta tocar nada.

Si tienes que preparar el proyecto desde cero en otro equipo:

1. Abrir MySQL Workbench.
2. Conectarse al servidor local.
3. Ejecutar `database/01_schema.sql`.
4. Ejecutar `database/12_seed_demo_data.sql`.

Para una instalación limpia no hace falta ejecutar los scripts `02_...` a `11_...`. Esos scripts quedan como referencia técnica de la evolución de la base de datos.

## 3. Arrancar el backend

Abre una terminal en la raíz del proyecto:

```powershell
cd C:\Grado-Ucjc\TFG\backend
.\mvnw.cmd spring-boot:run
```

Cuando arranque correctamente, debe quedar escuchando en:

```text
http://localhost:8080
```

Para comprobar que el backend está vivo, abre en el navegador:

```text
http://localhost:8080/api/health
```

La respuesta esperada es:

```text
Backend funcionando
```

No cierres esta terminal mientras estés usando la aplicación.

## 4. Arrancar el frontend

Abre otra terminal distinta:

```powershell
cd C:\Grado-Ucjc\TFG\frontend
npm run dev -- --host localhost --port 5173 --strictPort
```

Vite levantará el frontend en:

```text
http://localhost:5173
```

Con `--strictPort`, si el puerto `5173` está ocupado, Vite dará error en vez de abrir la aplicación en otro puerto. Esto es útil para la demo porque obliga a mantener el localhost correcto.

## 5. Orden recomendado para arrancar en la presentación

El orden más seguro es este:

1. Comprobar que MySQL está iniciado.
2. Arrancar backend.
3. Comprobar `http://localhost:8080/api/health`.
4. Arrancar frontend.
5. Abrir `http://localhost:5173`.
6. Hacer login con los usuarios recomendados de demo.

## 6. Comandos de comprobación antes de exponer

Ejecuta estos comandos antes de la defensa para confirmar que todo compila:

Backend:

```powershell
cd C:\Grado-Ucjc\TFG\backend
.\mvnw.cmd test
```

Resultado esperado:

```text
BUILD SUCCESS
Tests run: 8, Failures: 0, Errors: 0
```

Frontend:

```powershell
cd C:\Grado-Ucjc\TFG\frontend
npm run build
npm run lint
```

Resultado esperado:

```text
npm run build termina sin errores
npm run lint termina sin errores
```

## 7. Usuarios recomendados para la demo

Estos son los usuarios que conviene usar en la exposición porque tienen datos preparados y permiten enseñar bien el flujo principal.

| Tipo | Correo | Contraseña | Nombre visible | Uso recomendado |
|---|---|---|---|---|
| DJ | `alex@example.com` | `demo123` | Alex Beat | Usuario principal para enseñar panel DJ, candidaturas, mensajes y perfil |
| Organizador | `organizador@example.com` | `demo123` | Sala Central | Usuario principal para publicar ofertas, revisar candidaturas y gestionar favoritos |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` | Eventos BlackRoom | Usuario para enseñar que una fiesta privada funciona como organizador |
| Administrador | `admin@example.com` | `demo123` | Admin | Usuario para enseñar panel de administración |

La base local se ha dejado limpia para la defensa: solo quedan usuarios presentables, activos y con datos coherentes. Las cuentas manuales con datos incompletos o poco profesionales se han eliminado.

Todos los perfiles de DJ, los perfiles de organizador/fiesta privada y las ofertas recomendadas tienen imagen asociada para que la demo no muestre tarjetas vacías o poco presentables.

Además, se ha dejado una carpeta con fotos preparadas por si durante la exposición queréis enseñar la subida de imagen sin buscar archivos:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

También se ha preparado un acceso rápido para abrir la aplicación y la carpeta de fotos a la vez:

```text
C:\Grado-Ucjc\TFG\docs\ABRIR_DEMO_CON_FOTOS.cmd
```

Ese archivo no modifica la aplicación. Solo abre `http://localhost:5173`, abre la carpeta `FOTOS_DEMO` en el Explorador y copia la ruta al portapapeles. La explicación completa está en `docs/ACCESO_RAPIDO_FOTOS_DEMO.md`.

Rutas más útiles durante la exposición:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_djs\perfiles
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_candidaturas
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\perfiles
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\ofertas
```

Para entrar como DJ, organizador o fiesta privada puedes usar los botones de acceso rápido de la pantalla de login.

Para entrar como administrador, escribe manualmente:

```text
Correo: admin@example.com
Contraseña: demo123
```

## 8. Todos los usuarios creados en la base local actual

Estos usuarios son los que existen ahora mismo en la base de datos local `djmatch_db` después de la limpieza de datos para la demo.

Resumen:

| Tipo | Total |
|---|---:|
| Administradores | 1 |
| DJs | 5 |
| Organizadores | 1 |
| Fiestas privadas | 1 |
| Total de usuarios | 8 |

### 8.1 Administrador

| Estado | Correo | Contraseña | Rol | Uso |
|---|---|---|---|---|
| Activo | `admin@example.com` | `demo123` | `admin` | Recomendado para enseñar el panel de administración |

### 8.2 DJs

| Estado | Correo | Contraseña | Nombre visible | Ciudad | Uso |
|---|---|---|---|---|---|
| Activo | `alex@example.com` | `demo123` | Alex Beat | Madrid | Recomendado para la demo principal |
| Activo | `luna@example.com` | `demo123` | Luna Mix | Valencia | Recomendado si quieres crear una candidatura nueva en directo |
| Activo | `marco@example.com` | `demo123` | Marco Sound | Barcelona | Usuario demo secundario |
| Activo | `carla.dj@example.com` | `demo123` | Carla Groove | Madrid | Usuario demo secundario |
| Activo | `neo.techno@example.com` | `demo123` | Neo Pulse | Valencia | Usuario demo secundario |

### 8.3 Organizadores

| Estado | Correo | Contraseña | Nombre visible | Ciudad | Uso |
|---|---|---|---|---|---|
| Activo | `organizador@example.com` | `demo123` | Sala Central | Madrid | Recomendado para la demo principal |

### 8.4 Fiesta privada

| Estado | Correo | Contraseña | Nombre visible | Ciudad | Uso |
|---|---|---|---|---|---|
| Activo | `fiestaprivada@example.com` | `demo123` | Eventos BlackRoom | Madrid | Recomendado para enseñar el flujo de fiesta privada |

## 9. Qué usuarios usar en la defensa

Usa estos como ruta principal:

| Momento de la demo | Usuario |
|---|---|
| Enseñar búsqueda de DJs | Sin login o `organizador@example.com` |
| Enseñar panel de organizador | `organizador@example.com` |
| Enseñar panel DJ | `alex@example.com` |
| Crear una candidatura nueva en directo | `luna@example.com` |
| Enseñar fiesta privada | `fiestaprivada@example.com` |
| Enseñar administración | `admin@example.com` |

Usuarios secundarios que puedes enseñar si hace falta:

| Usuario | Cuándo usarlo |
|---|---|
| `marco@example.com` | Para enseñar otro DJ con ciudad Barcelona y música electrónica |
| `carla.dj@example.com` | Para enseñar una DJ de Madrid orientada a pop/reggaeton |
| `neo.techno@example.com` | Para enseñar otro DJ de techno/tech house |

Ya no hay usuarios inactivos ni cuentas manuales poco presentables en la base local de demo.

## 10. Recorrido recomendado para la demo del TFG

Este recorrido está pensado para enseñar la aplicación de forma ordenada y sin perder tiempo.

### Paso 1. Abrir la aplicación

Abrir:

```text
http://localhost:5173
```

Enseña brevemente:

- Página de inicio.
- Navegación principal.
- Acceso a búsqueda de DJs.
- Acceso a ofertas.

### Paso 2. Enseñar búsqueda de DJs

Ruta:

```text
http://localhost:5173/buscar-djs
```

Qué enseñar:

- Listado de DJs.
- Filtros por ciudad, experiencia, disponibilidad o estilo.
- Tarjetas de DJs.
- Entrada al detalle de un DJ.

Usuario recomendado:

```text
Sin login o con organizador@example.com
```

### Paso 3. Entrar como organizador

Correo:

```text
organizador@example.com
```

Contraseña:

```text
demo123
```

Qué enseñar:

- Panel de organizador.
- Perfil de Sala Central.
- Ofertas publicadas.
- Candidaturas recibidas.
- DJs favoritos.

### Paso 4. Crear o enseñar una oferta

Desde el panel de organizador puedes enseñar una oferta ya creada o crear una nueva.

Ofertas recomendadas para enseñar:

| Oferta | Organizador | Estado |
|---|---|---|
| DJ para evento privado | Sala Central | Abierta |
| Sesión en local de ocio | Sala Central | Abierta |
| DJ house para terraza de verano | Sala Central | Abierta |
| DJ para fiesta privada | Eventos BlackRoom | Abierta |
| DJ comercial para fiesta de empresa | Eventos BlackRoom | Abierta |
| DJ para fiesta privada en sala | Eventos BlackRoom | Abierta |

La base local ya no contiene ofertas con nombres de prueba poco presentables.

### Paso 5. Entrar como DJ

Correo:

```text
alex@example.com
```

Contraseña:

```text
demo123
```

Qué enseñar:

- Panel DJ.
- Perfil de Alex Beat.
- Candidaturas enviadas.
- Estado de candidaturas: pendiente, aceptada o rechazada.
- Posibilidad de consultar ofertas.
- Posibilidad de enviar candidatura a una oferta abierta.

### Paso 6. Enseñar flujo de candidatura

Flujo recomendado:

1. Entrar como organizador.
2. Crear o elegir una oferta abierta.
3. Cerrar sesión.
4. Entrar como DJ.
5. Ir a ofertas.
6. Abrir la oferta.
7. Enviar candidatura.
8. Cerrar sesión.
9. Volver a entrar como organizador.
10. Revisar candidaturas recibidas.
11. Aceptar o rechazar la candidatura.

Este flujo enseña claramente la relación entre organizador y DJ.

### Paso 7. Enseñar mensajería

La mensajería funciona mediante API REST y datos persistidos en MySQL.

Qué enseñar:

- Lista de conversaciones.
- Chat entre usuarios.
- Envío de mensaje.
- Mensajes leídos/no leídos si aparece el contador.

Usuario recomendado:

```text
alex@example.com
organizador@example.com
```

Conversaciones preparadas para enseñar:

| Usuario que inicia sesión | Conversación recomendada | Qué demuestra |
|---|---|---|
| `organizador@example.com` | Alex Beat | Conversación principal entre organizador y DJ |
| `organizador@example.com` | Luna Mix | Mensajes sobre una sesión de local de ocio |
| `organizador@example.com` | Marco Sound | Mensajes sobre una terraza de verano |
| `fiestaprivada@example.com` | Luna Mix o Alex Beat | Fiesta privada hablando con DJs |

Para la defensa, enseña la mensajería como comunicación entre organizadores o fiestas privadas y DJs. Técnicamente permite conversaciones entre usuarios activos, pero el flujo importante del proyecto es el contacto profesional alrededor de perfiles, ofertas y candidaturas. Las fiestas privadas se limitan a hablar con DJs.

### Paso 8. Enseñar favoritos y valoraciones

Con el organizador:

```text
organizador@example.com
```

Qué enseñar:

- Buscar DJs.
- Guardar un DJ como favorito.
- Ver favoritos desde el panel de organizador.
- Entrar en el perfil de un DJ.
- Crear o enseñar una valoración.

### Paso 9. Enseñar fiesta privada

Correo:

```text
fiestaprivada@example.com
```

Contraseña:

```text
demo123
```

Qué enseñar:

- Panel de fiesta privada.
- Que puede publicar ofertas igual que un organizador.
- Ofertas asociadas a Eventos BlackRoom.
- Candidaturas y mensajes.

### Paso 10. Enseñar panel de administrador

Correo:

```text
admin@example.com
```

Contraseña:

```text
demo123
```

Qué enseñar:

- Resumen de usuarios, DJs, ofertas, candidaturas y conversaciones.
- Listado de usuarios.
- Activar o desactivar usuarios.
- Listado de ofertas.
- Cambiar estado de ofertas.

No desactives el usuario admin actual durante la demo.

## 11. Comprobaciones rápidas durante la demo

Si algo no carga, comprueba en este orden:

1. Backend:

```text
http://localhost:8080/api/health
```

2. Frontend:

```text
http://localhost:5173
```

3. MySQL:

```powershell
Get-Service MySQL80
```

4. Puertos:

```powershell
Get-NetTCPConnection -LocalPort 8080,5173 -ErrorAction SilentlyContinue
```

## 12. Problemas frecuentes y solución

### El backend no arranca

Revisa:

- MySQL está iniciado.
- Existe la base de datos `djmatch_db`.
- El usuario y contraseña de MySQL coinciden con `application.properties`.
- El puerto `8080` no está ocupado.

Comando útil:

```powershell
Get-Service MySQL80
```

Si MySQL está parado:

```powershell
Start-Service MySQL80
```

### Error `Unknown database djmatch_db`

La base de datos no existe.

Solución:

1. Abrir MySQL Workbench.
2. Ejecutar `database/01_schema.sql`.
3. Ejecutar `database/12_seed_demo_data.sql`.
4. Volver a arrancar backend.

### Error `Access denied for user root`

La contraseña de MySQL no coincide.

El proyecto espera por defecto:

```text
usuario: root
contraseña: root1234
```

Si tu MySQL usa otra contraseña, hay que cambiarla en `backend/src/main/resources/application.properties` o usar variables de entorno.

### El frontend abre pero no carga datos

Normalmente significa que el backend no está arrancado.

Comprueba:

```text
http://localhost:8080/api/health
```

También revisa que `frontend/src/services/api.js` apunta a:

```text
http://localhost:8080/api
```

### Vite abre otro puerto

Si Vite abre `5174` u otro puerto, es que `5173` está ocupado.

Para la demo no conviene cambiar de puerto. Usa:

```powershell
npm run dev -- --host localhost --port 5173 --strictPort
```

Si falla, libera el puerto `5173` antes de continuar.

### El login falla

Revisa:

- El correo está bien escrito.
- La contraseña está bien escrita.
- La cuenta está activa.

Todos los usuarios incluidos en esta guía están activos. Si un login falla durante la demo, usa una de las cuentas principales con contraseña `demo123`.

## 13. Cómo parar la aplicación

Si arrancaste backend y frontend en terminales normales:

1. Ir a la terminal del backend.
2. Pulsar `Ctrl + C`.
3. Ir a la terminal del frontend.
4. Pulsar `Ctrl + C`.

Si necesitas buscar procesos por puerto:

```powershell
Get-NetTCPConnection -LocalPort 8080,5173 -ErrorAction SilentlyContinue
```

Si sabes el PID y necesitas cerrarlo:

```powershell
Stop-Process -Id NUMERO_PID
```

Usa `Stop-Process` solo si sabes seguro qué proceso estás cerrando.

## 14. Resumen rápido para tener abierto antes de exponer

Terminal 1:

```powershell
cd C:\Grado-Ucjc\TFG\backend
.\mvnw.cmd spring-boot:run
```

Terminal 2:

```powershell
cd C:\Grado-Ucjc\TFG\frontend
npm run dev -- --host localhost --port 5173 --strictPort
```

Navegador:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080/api/health
```

Usuarios principales:

| Rol | Correo | Contraseña |
|---|---|---|
| DJ | `alex@example.com` | `demo123` |
| Organizador | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Admin | `admin@example.com` | `demo123` |
