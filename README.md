# ConectaDJ

Proyecto de TFG de 2 DAM desarrollado por Alfonso Perez y Raul Duran Aedillo.

ConectaDJ es una plataforma web para la busqueda y gestion de DJs profesionales. El proyecto nace como respuesta a una necesidad detectada en el mercado espanol del ocio y los eventos: muchos contactos entre DJs y contratantes siguen dependiendo de recomendaciones, redes sociales o mensajes privados.

La aplicacion funciona como una plataforma de doble cara. Los DJs pueden crear su perfil profesional, consultar ofertas, enviar candidaturas y comunicarse con posibles clientes. Los particulares, salas, fiestas privadas o empresas de eventos pueden buscar DJs, publicar ofertas, gestionar candidaturas, guardar favoritos y usar la mensajeria interna.

El alcance de esta version es academico y local. El backend se ejecuta con Spring Boot en `localhost:8080`, el frontend con Vite en `localhost:5173` y la base de datos en MySQL local.

## Tecnologias

- Backend: Java 17, Spring Boot 3, Spring Web, Spring Data JPA y Maven Wrapper.
- Frontend: React, Vite, JavaScript, HTML5 y CSS3.
- Base de datos: MySQL 8.
- Comunicacion: API REST con JSON.
- Control de versiones: Git y GitHub.

## Estructura del proyecto

```text
TFG/
|-- backend/       API REST con Spring Boot
|-- frontend/      Aplicacion web React
|-- database/      Scripts para crear y cargar la base de datos
|-- docs/          Documentacion tecnica de apoyo
|-- README.md
```

## Funcionamiento general

La aplicacion trabaja con cuatro tipos de usuario:

- `dj`: crea y edita su perfil, consulta ofertas y se inscribe.
- `organizer`: publica ofertas, revisa candidaturas y contacta con DJs.
- `private_party`: funciona como organizador, pero representa una fiesta privada o empresa de eventos.
- `admin`: revisa usuarios y ofertas desde un panel basico.

Cuando un usuario se registra, el backend crea tambien su perfil relacionado:

- Un usuario `dj` crea un registro en `dj_profiles`.
- Un usuario `organizer` o `private_party` crea un registro en `organizer_profiles`.

El flujo principal es:

1. Un organizador publica una oferta en `job_offers`.
2. Un DJ ve la oferta y crea una candidatura en `applications`.
3. El organizador acepta, rechaza o deja pendiente la candidatura.
4. DJ y organizador pueden hablar mediante `conversations` y `messages`.
5. El organizador puede guardar DJs en `favorite_djs`.
6. El organizador puede valorar a un DJ en `reviews`.

Los estilos musicales se cargan desde el catalogo `music_styles` y se usan en filtros y perfiles. La edicion de estilos desde el panel queda como mejora futura, tal como se recoge en la memoria.

## Requisitos

- Java JDK 17 o superior.
- Node.js 20.19 o superior.
- MySQL Server 8.
- MySQL Workbench u otro cliente MySQL.

No hace falta instalar Maven aparte, porque el backend incluye Maven Wrapper.

## Base de datos

La base de datos se llama `djmatch_db`.

Para una instalacion limpia solo hay que ejecutar estos scripts, en este orden:

1. `database/01_schema.sql`
2. `database/12_seed_demo_data.sql`

Los scripts `02_...` a `11_...` son pasos intermedios que se fueron usando durante el desarrollo. Se dejan como historial, pero no son necesarios si se crea la base desde cero.

El backend usa por defecto:

```text
usuario: root
contrasena: root1234
```

Si MySQL usa otro usuario o contrasena, se puede cambiar en `backend/src/main/resources/application.properties` o usando las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`.

Usuarios de prueba:

| Rol | Correo | Contrasena |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| Particular / sala | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

## Arrancar el backend

Desde la raiz del proyecto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

El backend queda en:

```text
http://localhost:8080
```

Comprobacion rapida:

```text
http://localhost:8080/api/health
```

## Arrancar el frontend

En otra terminal, desde la raiz del proyecto:

```powershell
cd frontend
npm install
npm run dev
```

El frontend queda normalmente en:

```text
http://localhost:5173
```

## Comprobar compilacion

Backend:

```powershell
cd backend
.\mvnw.cmd clean test
```

Frontend:

```powershell
cd frontend
npm run build
npm run lint
```

## Carpetas que no se suben

Estas carpetas se generan en local y estan ignoradas por Git:

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `backend/uploads/`

Tambien se ignoran documentos auxiliares que no forman parte del codigo del repositorio, como presentaciones o plantillas externas dentro de `docs/`.

La plataforma no incluye pagos, suscripciones ni contratacion formal entre partes. Es una version funcional centrada en perfiles, ofertas, candidaturas, mensajeria y valoraciones.

## Documentacion tecnica

- [Manual de instalacion y arranque](docs/MANUAL_INSTALACION_Y_ARRANQUE.md)
- [Endpoints principales](docs/ENDPOINTS.md)
- [Seguridad basica y responsive](docs/SEGURIDAD_Y_RESPONSIVE.md)
- [Pruebas de entrega](docs/PRUEBAS_ENTREGA.md)
