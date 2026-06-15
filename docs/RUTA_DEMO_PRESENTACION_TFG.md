# Ruta de demo para la presentación del TFG ConectaDJ

Este documento está pensado para usarlo durante la defensa del TFG, justo después de la diapositiva de **Demostración práctica** de `ConectaDJ.pptx`.

La guía oficial recomienda dedicar aproximadamente la mitad del tiempo a la presentación y la otra mitad a la demo. En vuestro guion se plantea una demo de unos **5 a 7 minutos**, pero para ir con margen esta ruta principal está pensada para durar unos **4 minutos y 45 segundos**. Así podéis enseñar lo importante sin apurar el tiempo máximo.

La idea es que la demo principal quede por debajo del tiempo estimado. Si os entretenéis un poco, deberíais seguir cerca de los **5 minutos y medio**, sin acercaros peligrosamente al límite.

## 1. Objetivo de la demo

La demo tiene que demostrar que ConectaDJ no es solo una presentación, sino una aplicación real funcionando en local.

La idea que debe entender el tribunal es:

> ConectaDJ permite que un organizador busque DJs, publique ofertas, reciba candidaturas, contacte con DJs, guarde favoritos, valore perfiles y que un administrador revise usuarios y ofertas.

No hace falta enseñar absolutamente todos los botones. Es mejor enseñar un recorrido claro y completo.

## 2. URLs que deben estar abiertas

Mantén siempre estos localhost:

| Parte | URL |
|---|---|
| Aplicación frontend | `http://localhost:5173` |
| Backend health | `http://localhost:8080/api/health` |
| API base | `http://localhost:8080/api` |

No cambies a otro puerto. La documentación y la presentación hablan de:

```text
Frontend: localhost:5173
Backend: localhost:8080
```

## 3. Preparación antes de empezar la defensa

Antes de empezar la demo, deja esto preparado:

1. Backend arrancado.
2. Frontend arrancado.
3. MySQL iniciado.
4. Navegador abierto en `http://localhost:5173`.
5. Sesión cerrada en la aplicación.
6. Pestaña secundaria con `http://localhost:8080/api/health`, por si el tribunal pregunta si el backend está levantado.
7. Este documento abierto para seguir la ruta.

Comandos de arranque:

Backend:

```powershell
cd C:\Grado-Ucjc\TFG\backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd C:\Grado-Ucjc\TFG\frontend
npm run dev -- --host localhost --port 5173 --strictPort
```

El comando con `--strictPort` es recomendable para la defensa porque evita que Vite cambie automáticamente a otro puerto.

## 4. Usuarios que debes usar en la demo

Estos son los usuarios principales. Son los más seguros para enseñar la aplicación.

| Uso en la demo | Rol | Correo | Contraseña | Nombre visible |
|---|---|---|---|---|
| Panel DJ principal | DJ | `alex@example.com` | `demo123` | Alex Beat |
| Crear candidatura en directo | DJ | `luna@example.com` | `demo123` | Luna Mix |
| Organizador principal | Organizador | `organizador@example.com` | `demo123` | Sala Central |
| Fiesta privada | Fiesta privada | `fiestaprivada@example.com` | `demo123` | Eventos BlackRoom |
| Administración | Admin | `admin@example.com` | `demo123` | Admin |

### Por qué usar Luna para una candidatura en directo

Alex Beat es el mejor DJ para enseñar el panel porque tiene muchas candidaturas y datos ya preparados. Pero precisamente por eso **no es el mejor para enviar una candidatura nueva en directo**, porque ya está inscrito en muchas ofertas y puede salir el aviso de candidatura duplicada.

Para crear una candidatura en directo, usa:

```text
luna@example.com
demo123
```

También podrías usar `neo.techno@example.com`, pero Luna es más fácil de recordar.

## 5. Usuarios secundarios disponibles

La base local de demo se ha dejado limpia: no hay cuentas manuales poco presentables ni usuarios de ensayo con datos incompletos. Para la defensa usa las cuentas principales de la tabla anterior.

Los perfiles y ofertas de la ruta principal tienen imágenes preparadas. Así, al enseñar búsquedas, paneles y ofertas, la aplicación se ve completa y no aparecen tarjetas sin foto.

Si durante la exposición necesitáis subir una imagen nueva, usad la carpeta preparada:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

Si necesitas enseñar más perfiles o ampliar la demo, también tienes estos usuarios secundarios:

| Uso opcional | Rol | Correo | Contraseña | Nombre visible |
|---|---|---|---|---|
| Perfil DJ adicional | DJ | `marco@example.com` | `demo123` | Marco Sound |
| Perfil DJ adicional | DJ | `carla.dj@example.com` | `demo123` | Carla Groove |
| Perfil DJ adicional | DJ | `neo.techno@example.com` | `demo123` | Neo Pulse |

Si quieres ir a lo seguro, usa solo las cuentas principales con contraseña `demo123`.

## 6. Estructura recomendada de la demo

Esta es la ruta principal recomendada. Está pensada para unos **4 minutos y 45 segundos**. Si os entretenéis un poco en alguna pantalla, todavía deberíais seguir por debajo de los 6 minutos.

La idea es enseñar datos ya preparados. No crees oferta nueva ni candidatura nueva en la ruta principal salvo que vayáis muy bien de tiempo.

| Orden | Pantalla | Usuario | Tiempo aproximado |
|---|---|---|---|
| 1 | Inicio | Sin login | 15 segundos |
| 2 | Buscar DJs | Sin login | 30 segundos |
| 3 | Perfil público de DJ | Sin login | 25 segundos |
| 4 | Login organizador | `organizador@example.com` | 15 segundos |
| 5 | Panel organizador y mención a fiesta privada | Organizador | 40 segundos |
| 6 | Ofertas y candidaturas recibidas | Organizador | 35 segundos |
| 7 | Login DJ | `alex@example.com` | 15 segundos |
| 8 | Panel DJ y candidaturas | DJ | 40 segundos |
| 9 | Mensajes | Organizador o DJ | 25 segundos |
| 10 | Panel admin | `admin@example.com` | 35 segundos |
| 11 | Cierre | Sin cambiar pantalla | 10 segundos |

Tiempo total aproximado:

```text
4 minutos y 45 segundos
```

Si vais justos de tiempo, no inicies sesión como fiesta privada, no crees oferta nueva y no crees candidatura nueva. Enseña solo datos ya preparados. La fiesta privada se menciona dentro del panel de organizador, explicando que comparte el mismo flujo de publicación de ofertas y gestión de candidaturas.

Regla práctica:

- Si al minuto 2 todavía no has entrado como organizador, acelera.
- Si al minuto 3:30 todavía no has enseñado el panel DJ, salta directamente a mensajes y admin.
- Si quedan menos de 60 segundos, entra al admin y cierra.

## 6.1 Ruta principal exacta para no pasaros

Esta es la ruta que deberías seguir en la defensa real:

| Minuto | Acción | Qué enseñar |
|---|---|---|
| 0:00 - 0:15 | Inicio | Portada, navegación y objetivo de la web |
| 0:15 - 0:45 | Buscar DJs | Listado y un filtro sencillo |
| 0:45 - 1:10 | Perfil DJ | Perfil de Alex Beat o Carla Groove |
| 1:10 - 1:25 | Login organizador | Entrar con `organizador@example.com` |
| 1:25 - 2:05 | Panel organizador | Perfil, favoritos, ofertas y mención a fiesta privada |
| 2:05 - 2:40 | Candidaturas recibidas | Ver candidatura y explicar aceptar/rechazar |
| 2:40 - 2:55 | Login DJ | Entrar con `alex@example.com` |
| 2:55 - 3:35 | Panel DJ | Perfil, ofertas recomendadas y candidaturas |
| 3:35 - 4:00 | Mensajes | Conversación y envío/lectura de mensaje |
| 4:00 - 4:35 | Admin | Usuarios, roles, ofertas y estados |
| 4:35 - 4:45 | Cierre | Resumen del flujo completo |

Esta tabla es la que debéis ensayar. Si la hacéis en **4:45 o 5:00**, vais perfectos. Si algún cambio de sesión tarda más, todavía tenéis margen antes de llegar a los 6 minutos.

## 6.2 Relación con la guía, el guion y la presentación

Esta ruta está ajustada a los tres documentos:

| Documento | Qué pide o recomienda | Cómo se aplica en esta ruta |
|---|---|---|
| `Guia_Presentacion_TFG.pdf` | Repartir la defensa entre presentación y demostración práctica | La demo queda por debajo del bloque estimado para no apurar |
| `Guion_exposicion_TFG_ConectaDJ_Alfonso_Raul.pdf` | Demo de unos 5 a 7 minutos | La ruta principal dura unos 4:45 y deja margen |
| `ConectaDJ.pptx` | Enseñar organizador/fiesta privada, DJ y administrador | Se enseñan organizador, DJ y admin; fiesta privada se menciona como flujo equivalente y queda opcional |

La prioridad es que el tribunal vea el flujo completo sin que tengáis que correr al final.

## 7. Frase de transición desde la presentación

Al terminar la diapositiva 11, di algo parecido a esto:

> Una vez explicada la parte técnica, vamos a enseñar la aplicación funcionando en local. El frontend está levantado en `localhost:5173`, el backend en `localhost:8080` y la base de datos MySQL contiene usuarios, perfiles, ofertas, candidaturas, mensajes y valoraciones de prueba.

Después abre:

```text
http://localhost:5173
```

## 8. Ruta paso a paso

### Paso 1. Página de inicio

Usuario:

```text
Sin iniciar sesión
```

URL:

```text
http://localhost:5173
```

Qué hacer:

1. Enseñar la portada de ConectaDJ.
2. Señalar la navegación superior: `Buscar DJs`, `Ofertas`, `Mensajes`, `Entrar`, `Registrarse`.
3. Explicar que la página inicial ya consume datos reales de la API.

Qué decir:

> Esta es la página principal de ConectaDJ. Desde aquí el usuario entiende la propuesta de la plataforma: buscar DJs, consultar ofertas o registrarse. La aplicación no es una maqueta estática, sino que trabaja con datos almacenados en MySQL y servidos por el backend Spring Boot.

No te entretengas demasiado aquí. La portada solo sirve para entrar en contexto.

### Paso 2. Búsqueda de DJs

Usuario:

```text
Sin iniciar sesión
```

Ruta:

```text
Buscar DJs
```

URL:

```text
http://localhost:5173/buscar-djs
```

Qué hacer:

1. Entrar en `Buscar DJs`.
2. Enseñar el listado de DJs.
3. Aplicar algún filtro sencillo:
   - ciudad: `Madrid`;
   - disponibilidad;
   - estilo musical, si aparece en el selector.
4. Abrir el perfil de `Alex Beat` o `Carla Groove`.

Qué decir:

> Esta pantalla resuelve uno de los problemas iniciales del proyecto: en lugar de buscar DJs de forma dispersa en redes sociales, el organizador puede comparar perfiles usando filtros por ciudad, estilo musical, experiencia o disponibilidad.

Consejo:

No uses filtros demasiado restrictivos. Si un filtro deja la pantalla sin resultados, pulsa limpiar filtros o vuelve atrás.

### Paso 3. Perfil público de un DJ

Usuario:

```text
Sin login o con organizador
```

DJ recomendado:

```text
Alex Beat
```

Qué hacer:

1. Abrir una tarjeta de DJ.
2. Enseñar nombre artístico, ciudad, experiencia, tarifa, estilos y disponibilidad.
3. Enseñar las valoraciones si aparecen.
4. Explicar que los enlaces externos sirven para completar el perfil profesional.

Qué decir:

> En el perfil público se centraliza la información profesional del DJ: nombre artístico, ciudad, experiencia, estilos musicales, tarifa orientativa, biografía, enlaces externos, disponibilidad y valoraciones. Esto ayuda al organizador a decidir si ese DJ encaja con su evento.

No hace falta valorar todavía. La valoración se puede explicar más adelante.

### Paso 4. Iniciar sesión como organizador

Usuario recomendado:

```text
Correo: organizador@example.com
Contraseña: demo123
```

Qué hacer:

1. Ir a `Entrar`.
2. Usar el botón `Entrar como particular` o escribir las credenciales.
3. Esperar a que redirija al panel de organizador.

Qué decir:

> Ahora entramos como organizador para enseñar las funcionalidades privadas. La aplicación adapta la navegación según el rol del usuario, por eso al iniciar sesión aparece el panel correspondiente.

### Paso 5. Panel del organizador

Usuario:

```text
organizador@example.com
```

Qué enseñar:

1. Tarjetas/resumen del panel.
2. Perfil de `Sala Central`.
3. DJs guardados.
4. Formulario de publicación de ofertas.
5. Ofertas publicadas.
6. Candidaturas recibidas.

Qué decir:

> Este es el panel del organizador. Desde aquí puede editar su perfil, guardar DJs favoritos, publicar ofertas y revisar candidaturas. Es una parte importante porque representa el lado de quien necesita contratar o contactar con un DJ.

Consejo:

No edites el perfil durante la defensa salvo que sea necesario. Enseñar que existe el formulario es suficiente.

### Paso 6. Publicar o enseñar una oferta

Tienes dos formas de hacerlo.

#### Opción segura: no crear oferta nueva

Usa esta opción si no quieres arriesgarte a escribir datos en directo.

Qué hacer:

1. En el panel de organizador, bajar hasta `Ofertas publicadas`.
2. Enseñar una oferta ya creada.
3. Recomendadas:

| Oferta | Motivo |
|---|---|
| `DJ para evento privado` | Nombre claro y profesional |
| `Sesión en local de ocio` | Buena para explicar eventos de sala |
| `DJ house para terraza de verano` | Buena para explicar estilos y presupuesto |

Qué decir:

> Aquí vemos las ofertas publicadas por el organizador. Cada oferta tiene título, descripción, ciudad, fecha, presupuesto, duración, estado y requisitos. Los DJs pueden ver estas ofertas desde su tablón y enviar candidaturas.

#### Opción completa: crear una oferta en directo

Usa esta opción si quieres demostrar el flujo completo en vivo.

Formulario recomendado:

| Campo | Valor recomendado |
|---|---|
| Título | `Demo TFG - DJ para evento privado` |
| Ciudad | `Madrid` |
| Fecha | una fecha futura |
| Estilo musical | `House` o `Pop` |
| Experiencia mínima | `1` |
| Presupuesto | `300` |
| Duración | `3` |
| Descripción | `Oferta creada durante la demo para comprobar el flujo de candidatura entre organizador y DJ.` |
| Imagen | Opcional. Si no quieres arriesgar, déjala vacía. |

Después pulsa:

```text
Publicar oferta
```

Qué decir:

> Al publicar la oferta, el frontend envía los datos al backend mediante la API REST y Spring Boot guarda el registro en MySQL. Después la oferta queda visible para los DJs.

Consejo:

Si el tiempo es justo, no crees oferta nueva. Enseña una ya creada.

### Paso 7. Cerrar sesión como organizador

Qué hacer:

1. Pulsar `Salir`.
2. Volver a la pantalla de inicio o login.

Qué decir:

> Ahora cambiamos al otro lado de la plataforma para ver qué ve un DJ.

### Paso 8. Entrar como DJ

Hay dos opciones según lo que quieras enseñar.

#### Opción A: enseñar panel DJ con datos completos

Usuario:

```text
Correo: alex@example.com
Contraseña: demo123
```

Úsalo para enseñar:

- panel DJ;
- perfil profesional;
- candidaturas existentes;
- estados de candidatura;
- mensajes.

#### Opción B: crear candidatura en directo

Usuario:

```text
Correo: luna@example.com
Contraseña: demo123
```

Úsalo para:

- inscribirte en una oferta durante la demo;
- evitar candidatura duplicada de Alex;
- enseñar el cambio de rol con otro DJ.

Recomendación práctica:

Si vas justo de tiempo, usa solo `alex@example.com`.

Si quieres enseñar una candidatura nueva en directo, usa `luna@example.com`.

### Paso 9. Panel del DJ

Usuario recomendado para esta parte:

```text
alex@example.com
```

Qué enseñar:

1. Panel del DJ.
2. Perfil profesional editable.
3. Disponibilidad.
4. Ofertas recomendadas.
5. Candidaturas enviadas.
6. Estados: pendiente, aceptada, rechazada o retirada.

Qué decir:

> Este es el panel del DJ. Desde aquí puede mantener su perfil profesional, revisar ofertas que encajan con su ciudad o experiencia y consultar el estado de sus candidaturas. Así el DJ no solo aparece en un listado, sino que tiene una zona propia para gestionar su actividad.

No edites demasiados campos en directo. Enseña que el formulario existe y que el perfil se puede guardar.

### Paso 10. Enviar candidatura a una oferta

Si quieres hacerlo en directo, usa:

```text
Correo: luna@example.com
Contraseña: demo123
```

Ruta:

```text
Ofertas
```

Qué hacer:

1. Entrar como Luna Mix.
2. Ir a `Ofertas`.
3. Buscar la oferta creada en directo o una oferta abierta.
4. Escribir un mensaje de candidatura.
5. Pulsar `Inscribirme`.

Mensaje recomendado:

```text
Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.
```

Qué decir:

> El DJ puede consultar el tablón de ofertas y enviar una candidatura con un mensaje. El sistema guarda la candidatura en estado pendiente y evita que el mismo DJ se inscriba dos veces en la misma oferta.

Importante:

Si aparece el mensaje `Ya estás inscrito en esta oferta`, no pasa nada. Explica:

> Esto ocurre porque el sistema detecta candidaturas duplicadas. Es una validación del backend para evitar que un DJ se inscriba dos veces en la misma oferta.

Y continúa enseñando una candidatura ya existente desde el panel.

### Paso 11. Volver como organizador y gestionar candidatura

Usuario:

```text
Correo: organizador@example.com
Contraseña: demo123
```

Qué hacer:

1. Cerrar sesión como DJ.
2. Entrar como organizador.
3. Ir al panel de organizador.
4. Bajar a `Candidaturas recibidas`.
5. Localizar la candidatura nueva o una pendiente.
6. Pulsar `Aceptar` o `Rechazar`.

Recomendación:

Para la demo, pulsa `Aceptar`, porque así puedes enlazarlo con la mensajería interna.

Qué decir:

> Desde el panel, el organizador ve las candidaturas recibidas, puede consultar el perfil del DJ y cambiar el estado. Al aceptar una candidatura, se facilita continuar el contacto mediante la mensajería interna.

Nota:

El sistema permite cambiar candidaturas pendientes a aceptadas o rechazadas. Si una candidatura ya fue aceptada o rechazada, puede volver a ponerse pendiente desde las acciones disponibles.

### Paso 12. Mensajería interna

Usuario recomendado:

```text
organizador@example.com
```

Ruta:

```text
Mensajes
```

Qué hacer:

1. Entrar en `Mensajes`.
2. Seleccionar la conversación con `Alex Beat`.
3. Si hace falta, usar `Nuevo mensaje` y elegir un DJ.
4. Escribir un mensaje corto.
5. Pulsar `Enviar`.

Conversaciones preparadas:

| Usuario | Conversación | Uso |
|---|---|---|
| `organizador@example.com` | Alex Beat | Opción principal para enseñar mensajería |
| `organizador@example.com` | Luna Mix | Opción secundaria con mensajes de local de ocio |
| `organizador@example.com` | Marco Sound | Opción secundaria con mensajes de terraza |
| `fiestaprivada@example.com` | Luna Mix o Alex Beat | Opción para enseñar fiesta privada con DJs |

Mensaje recomendado:

```text
Hola, hemos revisado tu candidatura. Podemos cerrar detalles del evento por aquí.
```

Qué decir:

> La mensajería interna permite centralizar la comunicación dentro de la plataforma. En esta versión funciona mediante API REST y datos persistidos en MySQL. No es un chat en tiempo real con WebSockets, pero sí permite crear conversaciones, enviar mensajes y consultar mensajes anteriores.

Para la defensa, explica la mensajería como contacto entre organizadores o fiestas privadas y DJs. Técnicamente la aplicación permite iniciar conversaciones entre usuarios activos, pero el caso de uso principal de ConectaDJ es el contacto profesional alrededor de perfiles, ofertas y candidaturas. Las fiestas privadas quedan limitadas a conversaciones con DJs.

Importante:

No digas que la mensajería es en tiempo real. En la presentación aparece como mejora futura.

### Paso 13. Favoritos y valoraciones

Usuario:

```text
organizador@example.com
```

Ruta recomendada:

```text
Buscar DJs -> Perfil de DJ
```

Qué hacer:

1. Ir a `Buscar DJs`.
2. Abrir el perfil de `Alex Beat`, `Luna Mix` o `Neo Pulse`.
3. Enseñar el botón `Guardar DJ`, si aparece.
4. Enseñar las valoraciones existentes.
5. Si decides crear valoración, usa un DJ que no haya sido valorado antes por ese organizador.

Opción segura:

No crear una valoración nueva. Solo enseñar que en el perfil aparecen valoraciones y explicar que el organizador puede valorar.

Qué decir:

> Las valoraciones ayudan a construir reputación dentro de la plataforma. Además, el organizador puede guardar DJs como favoritos para recuperarlos después desde su panel.

Consejo:

Para no arriesgar en directo, muestra valoraciones ya existentes en lugar de crear una nueva.

### Paso 14. Fiesta privada

Este paso es opcional. Úsalo si tienes tiempo o si quieres demostrar el cuarto tipo de usuario.

Usuario:

```text
Correo: fiestaprivada@example.com
Contraseña: demo123
```

Qué enseñar:

1. Panel de fiesta privada.
2. Perfil `Eventos BlackRoom`.
3. Ofertas publicadas.
4. Candidaturas.
5. Mensajes con DJs.

Qué decir:

> La fiesta privada funciona de forma parecida al organizador, pero representa otro caso de uso: particulares o empresas que necesitan DJs para eventos concretos. Esto amplía el alcance de la plataforma sin mezclarlo con el rol DJ.

Si vas justo de tiempo, salta este paso y menciona que existe.

### Paso 15. Panel de administración

Usuario:

```text
Correo: admin@example.com
Contraseña: demo123
```

Ruta:

```text
Panel administrador
```

Qué enseñar:

1. Resumen general.
2. Usuarios registrados.
3. Roles de usuarios.
4. Estado activo/inactivo.
5. Ofertas publicadas.
6. Cambiar estado de una oferta, si quieres enseñarlo.

Qué decir:

> Por último, el administrador tiene un panel básico para revisar usuarios y ofertas. No pretende ser un sistema avanzado de administración, pero permite demostrar control sobre cuentas, roles y publicaciones.

Muy importante:

No desactives el usuario `admin@example.com`.

No desactives usuarios durante la defensa. Si quieres explicar esa funcionalidad, enseña el botón o el estado desde el panel, pero no lo pulses en directo. Así mantienes la base de datos limpia para el resto de la demo.

### Paso 16. Cierre final

No hace falta cambiar de pantalla. Puedes terminar desde el panel admin o desde la página principal.

Frase recomendada:

> Con esto se ve el flujo completo de ConectaDJ: un organizador puede buscar DJs y publicar ofertas, un DJ puede gestionar su perfil y enviar candidaturas, ambos pueden comunicarse mediante mensajes y el administrador puede revisar usuarios y ofertas. La aplicación está funcionando en local con React, Spring Boot y MySQL, y queda preparada para ampliaciones futuras como seguridad avanzada, notificaciones o despliegue en producción.

## 9. Ruta de emergencia si vais justos de tiempo

Si solo tienes **4 minutos** para la demo, haz esto. Es la versión mínima que sigue enseñando el flujo principal:

1. Inicio.
2. Buscar DJs.
3. Perfil de Alex Beat.
4. Login como organizador:

```text
organizador@example.com
demo123
```

5. Enseñar panel organizador, ofertas y candidaturas recibidas.
6. Salir.
7. Login como DJ:

```text
alex@example.com
demo123
```

8. Enseñar panel DJ y candidaturas.
9. Enseñar mensajes solo por encima.
10. Salir.
11. Login admin:

```text
admin@example.com
demo123
```

12. Enseñar panel admin.

En esta ruta de emergencia no crees oferta nueva, no crees candidatura nueva, no valores DJs y no enseñes fiesta privada. Solo enseña datos ya preparados.

## 10. Ruta completa si todo va bien

Si tienes **6 minutos y medio o 7 minutos** y quieres enseñar más, puedes usar esta ruta extendida:

1. Inicio.
2. Buscar DJs.
3. Perfil DJ.
4. Login organizador.
5. Crear oferta nueva.
6. Salir.
7. Login DJ Luna.
8. Enviar candidatura a esa oferta.
9. Salir.
10. Login organizador.
11. Aceptar candidatura.
12. Abrir mensajes.
13. Enseñar favoritos/valoraciones.
14. Login admin.
15. Enseñar panel admin.

Esta ruta es más completa, pero también tiene más riesgo porque depende de escribir datos en directo. Úsala solo si habéis ensayado y vais bien de tiempo. Si dudas, usa la ruta principal de 4:45.

## 10.1 Qué partes son opcionales

Estas partes son buenas, pero no son obligatorias si el tiempo va justo:

| Parte | Cuándo enseñarla | Cuándo saltarla |
|---|---|---|
| Crear oferta nueva | Solo si vais sobrados y el formulario está ensayado | Si quedan menos de 3 minutos |
| Crear candidatura nueva con Luna | Solo si habéis creado oferta nueva o hay oferta clara libre | Si ya vais tarde o sale duplicada |
| Fiesta privada | Si el tribunal pregunta por ese rol o sobra tiempo | En la ruta principal |
| Crear valoración nueva | Si sabéis seguro que no existe valoración previa | Casi siempre es mejor saltarla |
| Subida de imagen | Solo si está ensayada y usando `docs/FOTOS_DEMO/` | En defensa real, mejor no arriesgar si vais justos |

## 11. Datos recomendados para crear una oferta en directo

Si decides crear una oferta nueva durante la demo, usa estos datos:

| Campo | Valor |
|---|---|
| Título | `Demo TFG - DJ para evento privado` |
| Ciudad | `Madrid` |
| Fecha | una fecha futura |
| Estilo musical | `House` |
| Experiencia mínima | `1` |
| Presupuesto | `300` |
| Duración | `3` |
| Descripción | `Oferta creada durante la demo para comprobar el flujo completo entre organizador y DJ.` |
| Imagen | `docs/FOTOS_DEMO/fotos_organizadores/ofertas/oferta-evento-corporativo.jpg` |

Si ya existe una oferta con ese nombre por ensayos anteriores, no pasa nada. La aplicación permite crear más ofertas.

## 12. Datos recomendados para enviar candidatura

Usuario:

```text
luna@example.com
demo123
```

Mensaje:

```text
Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.
```

Imagen recomendada si la pantalla permite adjuntar una foto o necesitáis una imagen de apoyo:

```text
docs/FOTOS_DEMO/fotos_candidaturas/candidatura-dj-demo-07.jpg
```

Recuerda que el mensaje debe tener al menos 10 caracteres.

## 13. Qué no debes decir durante la demo

Para que la presentación sea coherente con el código real, evita estas frases:

| No decir | Mejor decir |
|---|---|
| "La mensajería es en tiempo real" | "La mensajería funciona mediante API REST y queda como mejora futura hacerla en tiempo real con WebSockets" |
| "La seguridad usa JWT" | "La seguridad es básica para el alcance académico; JWT y BCrypt son mejoras futuras" |
| "La app está desplegada" | "La app se ejecuta en local: frontend en `5173` y backend en `8080`" |
| "Hay pagos integrados" | "Los pagos serían una mejora futura si la plataforma se monetizara" |
| "Es una aplicación de contratación cerrada" | "Es una plataforma de intermediación: perfiles, ofertas, candidaturas, mensajes y valoraciones" |

Esto es importante porque el tribunal puede preguntar por el código real.

## 14. Qué hacer si algo falla

### Falla el frontend

Abre:

```text
http://localhost:5173
```

Si no carga, revisa la terminal del frontend.

Comando:

```powershell
cd C:\Grado-Ucjc\TFG\frontend
npm run dev -- --host localhost --port 5173 --strictPort
```

### Falla el backend

Abre:

```text
http://localhost:8080/api/health
```

Si no responde, revisa la terminal del backend.

Comando:

```powershell
cd C:\Grado-Ucjc\TFG\backend
.\mvnw.cmd spring-boot:run
```

### Falla el login

Usa usuarios demo:

| Rol | Correo | Contraseña |
|---|---|---|
| DJ | `alex@example.com` | `demo123` |
| Organizador | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Admin | `admin@example.com` | `demo123` |

Todos los usuarios recomendados de esta guía están activos y usan la contraseña `demo123`. Si falla el login, revisa que el correo esté escrito exactamente igual y que la base de datos cargada sea `djmatch_db`.

### Falla una candidatura nueva

Si sale que ya existe candidatura:

1. No te bloquees.
2. Di que el backend evita duplicados.
3. Enseña una candidatura ya creada desde el panel.

Frase útil:

> Este aviso demuestra una validación del backend: el mismo DJ no puede inscribirse dos veces en la misma oferta.

### Falla una valoración nueva

Si dice que ya has valorado a ese DJ:

1. No lo presentes como error grave.
2. Explica que el sistema evita valorar varias veces al mismo DJ desde el mismo organizador.
3. Enseña las valoraciones existentes.

## 15. Checklist final antes de defender

Marca mentalmente estos puntos:

| Punto | Estado esperado |
|---|---|
| MySQL | Arrancado |
| Backend | `localhost:8080` funcionando |
| Frontend | `localhost:5173` funcionando |
| Login DJ | `alex@example.com` funciona |
| Login organizador | `organizador@example.com` funciona |
| Login fiesta privada | `fiestaprivada@example.com` funciona |
| Login admin | `admin@example.com` funciona |
| Ofertas | Se muestran |
| DJs | Se muestran |
| Mensajes | Se pueden abrir |
| Panel admin | Se abre |

## 16. Mini-guion oral de la demo

Puedes usar este texto como apoyo, pero no lo leas literalmente:

> Primero vamos a ver la página inicial y el buscador de DJs. Aquí se pueden consultar perfiles y aplicar filtros por ciudad, estilo, experiencia o disponibilidad.

> Después entramos como organizador para ver el panel privado. Desde este panel se pueden publicar ofertas, revisar candidaturas, guardar DJs favoritos y contactar con ellos.

> Ahora cambiamos al rol de DJ. El DJ puede gestionar su perfil profesional, consultar ofertas y enviar candidaturas. Las candidaturas tienen estados para que el usuario sepa si están pendientes, aceptadas o rechazadas.

> También tenemos mensajería interna para centralizar el contacto dentro de la plataforma. En esta versión funciona mediante API REST y base de datos.

> Por último, entramos como administrador para revisar usuarios y ofertas. Es un panel básico, pero suficiente para demostrar control sobre la plataforma dentro del alcance académico del proyecto.

> Con esto queda demostrado el flujo principal: búsqueda, perfil, oferta, candidatura, comunicación, valoración y administración.
