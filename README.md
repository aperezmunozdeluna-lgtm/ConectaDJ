# ConectaDJ

Proyecto de TFG de 2 DAM desarrollado por Alfonso Pérez y Raúl Durán Aedillo.

ConectaDJ es una plataforma web para la búsqueda y gestión de DJs profesionales. El proyecto nace como respuesta a una necesidad detectada en el mercado español del ocio y los eventos: muchos contactos entre DJs y contratantes siguen dependiendo de recomendaciones, redes sociales o mensajes privados.

La aplicación funciona como una plataforma de doble cara. Los DJs pueden crear su perfil profesional, consultar ofertas, enviar candidaturas y comunicarse con posibles clientes. Los particulares, salas, fiestas privadas o empresas de eventos pueden buscar DJs, publicar ofertas, gestionar candidaturas, guardar favoritos y usar la mensajería interna.

El alcance de esta versión es académico y local. El backend se ejecuta con Spring Boot en `localhost:8080`, el frontend con Vite en `localhost:5173` y la base de datos en MySQL local.

El proyecto se ha desarrollado principalmente en entorno local y se ha organizado en carpetas diferenciadas para backend, frontend, base de datos y documentación. GitHub se utiliza como repositorio de entrega y publicación del código, facilitando la revisión del proyecto por parte del tutor.

## Tecnologías

- Backend: Java 17, Spring Boot 3, Spring Web, Spring Data JPA y Maven Wrapper.
- Frontend: React, Vite, JavaScript, HTML5 y CSS3.
- Base de datos: MySQL 8.
- Comunicación: API REST con JSON.
- Publicación del código: repositorio de entrega en GitHub.

## Estructura del proyecto

```text
TFG/
|-- backend/       API REST con Spring Boot
|-- frontend/      Aplicación web React
|-- database/      Scripts para crear y cargar la base de datos
|-- docs/          Documentación técnica de apoyo
|-- README.md
```

## Funcionamiento general

La aplicación trabaja con cuatro tipos de usuario:

- `dj`: crea y edita su perfil, consulta ofertas y se inscribe.
- `organizer`: publica ofertas, revisa candidaturas y contacta con DJs.
- `private_party`: funciona como organizador, pero representa una fiesta privada o empresa de eventos.
- `admin`: revisa usuarios y ofertas desde un panel básico.

Cuando un usuario se registra, el backend crea también su perfil relacionado:

- Un usuario `dj` crea un registro en `dj_profiles`.
- Un usuario `organizer` o `private_party` crea un registro en `organizer_profiles`.

El flujo principal es:

1. Un organizador publica una oferta en `job_offers`.
2. Un DJ ve la oferta y crea una candidatura en `applications`.
3. El organizador acepta, rechaza o deja pendiente la candidatura.
4. DJ y organizador pueden hablar mediante `conversations` y `messages`.
5. El organizador puede guardar DJs en `favorite_djs`.
6. El organizador puede valorar a un DJ en `reviews`.

Los estilos musicales se cargan desde el catálogo `music_styles` y se usan en filtros y perfiles. La edición de estilos desde el panel queda como mejora futura, tal como se recoge en la memoria.

## Requisitos

- Java JDK 17 o superior.
- Node.js 20.19 o superior.
- MySQL Server 8.
- MySQL Workbench u otro cliente MySQL.

No hace falta instalar Maven aparte, porque el backend incluye Maven Wrapper.

## Base de datos

La base de datos se llama `djmatch_db`.

Para una instalación limpia solo hay que ejecutar estos scripts, en este orden:

1. `database/01_schema.sql`
2. `database/12_seed_demo_data.sql`

Los scripts `02_...` a `11_...` son pasos intermedios que se fueron usando durante el desarrollo. Se dejan como referencia técnica de la evolución de la base de datos, pero no son necesarios si se crea la base desde cero.

El backend usa por defecto:

```text
usuario: root
contraseña: root1234
```

Las credenciales indicadas para MySQL corresponden únicamente al entorno local de desarrollo y pruebas. En una versión de producción deberían configurarse mediante variables de entorno y no incluirse directamente en los archivos del proyecto.

Si MySQL usa otro usuario o contraseña, se puede cambiar en `backend/src/main/resources/application.properties` o usando las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`.

Usuarios de prueba:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| Organizador | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

## Arrancar el backend

Desde la raíz del proyecto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

El backend queda en:

```text
http://localhost:8080
```

Comprobación rápida:

```text
http://localhost:8080/api/health
```

## Arrancar el frontend

En otra terminal, desde la raíz del proyecto:

```powershell
cd frontend
npm install
npm run dev
```

El frontend queda normalmente en:

```text
http://localhost:5173
```

## Comprobar compilación

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

Estas carpetas se generan en local y no se suben al repositorio:

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `backend/uploads/`

También se ignoran documentos auxiliares que no forman parte del código del repositorio, como presentaciones o plantillas externas dentro de `docs/`.

La plataforma no incluye pagos, suscripciones ni contratación formal entre partes. Es una versión funcional centrada en perfiles, ofertas, candidaturas, mensajería y valoraciones.

## Documentación técnica

- [Manual de instalación y arranque](docs/MANUAL_INSTALACION_Y_ARRANQUE.md)
- [Endpoints principales](docs/ENDPOINTS.md)
- [Seguridad básica y responsive](docs/SEGURIDAD_Y_RESPONSIVE.md)
- [Pruebas de entrega](docs/PRUEBAS_ENTREGA.md)
