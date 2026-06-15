# Acceso rápido a fotos para la demo

Este documento explica cómo dejar preparada la carpeta de fotos antes de enseñar la subida de imágenes durante la defensa.

## Idea importante

La aplicación no puede obligar al navegador a abrir siempre una carpeta concreta en el selector de archivos.

Esto no es un fallo de ConectaDJ. Es una limitación normal de seguridad de los navegadores: una página web no debe poder decidir ni leer rutas locales del ordenador del usuario.

Por eso la solución correcta para la demo es preparar Windows antes de empezar:

1. Abrir la carpeta de fotos.
2. Abrir la aplicación en `localhost:5173`.
3. Tener la ruta de fotos copiada por si hay que pegarla en el selector.
4. Seleccionar una foto una vez antes de la defensa, si se quiere que el navegador recuerde la última carpeta usada.

## Archivo preparado

Se ha dejado este archivo:

```text
C:\Grado-Ucjc\TFG\docs\ABRIR_DEMO_CON_FOTOS.cmd
```

Al ejecutarlo hace tres cosas:

1. Abre la carpeta:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

2. Abre la aplicación:

```text
http://localhost:5173
```

3. Copia al portapapeles la ruta:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

## Uso recomendado antes de exponer

Antes de empezar la defensa:

1. Arranca MySQL.
2. Arranca el backend.
3. Arranca el frontend.
4. Ejecuta:

```text
C:\Grado-Ucjc\TFG\docs\ABRIR_DEMO_CON_FOTOS.cmd
```

5. Deja abierta la ventana del Explorador con `FOTOS_DEMO`.
6. Entra en la aplicación desde `http://localhost:5173`.

## Para que el selector recuerde la carpeta

Si quieres aumentar la probabilidad de que el navegador abra directamente `FOTOS_DEMO` al pulsar en subir imagen:

1. Antes de la defensa, entra en cualquier pantalla donde puedas subir una imagen.
2. Pulsa en seleccionar archivo.
3. Elige una imagen desde:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

4. Guarda o cancela, según lo que estés probando.
5. No cierres el navegador antes de la demo.

Después de eso, Chrome o Edge suelen recordar la última carpeta usada para subir archivos.

## Carpetas más útiles

| Uso | Carpeta |
|---|---|
| Perfil de DJ | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_djs\perfiles` |
| Candidatura de DJ | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_candidaturas` |
| Perfil de organizador o sala | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\perfiles` |
| Oferta o evento | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\ofertas` |
| Reserva si algo falla | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_reserva_presentacion` |

## Qué hacer si no se abre directamente la carpeta

Si al pulsar en subir imagen se abre otra carpeta:

1. Pega en la barra de ruta del selector:

```text
C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO
```

2. Pulsa `Enter`.
3. Entra en la subcarpeta que corresponda.
4. Selecciona la imagen.

Como el archivo `ABRIR_DEMO_CON_FOTOS.cmd` copia esa ruta al portapapeles, solo tendrías que pegarla con `Ctrl + V`.

## Recomendación para la defensa

No enseñes la subida de imagen si vais justos de tiempo. La demo principal ya tiene perfiles y ofertas con imágenes preparadas.

Si el tribunal pide ver la subida, usa una de estas opciones:

| Caso | Imagen recomendada |
|---|---|
| Perfil de DJ | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_djs\perfiles\dj-perfil-alternativa-01.jpg` |
| Perfil de organizador | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\perfiles\organizador-perfil-demo-01.jpg` |
| Oferta nueva | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_organizadores\ofertas\oferta-evento-corporativo.jpg` |
| Candidatura | `C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO\fotos_candidaturas\candidatura-dj-demo-07.jpg` |
