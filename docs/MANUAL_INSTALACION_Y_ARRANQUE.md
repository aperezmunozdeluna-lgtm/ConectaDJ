# Manual de instalación y arranque

Este manual explica cómo preparar ConectaDJ en otro equipo y dejar funcionando backend, frontend y base de datos.

## 1. Requisitos

Programas necesarios:

- Java JDK 17 o superior.
- Node.js 20.19 o superior.
- MySQL Server 8.
- MySQL Workbench u otro cliente MySQL.
- Git, solo si se va a clonar el repositorio de entrega desde GitHub.
- Un editor o IDE, por ejemplo Visual Studio Code, IntelliJ IDEA, Eclipse o NetBeans.

Comprobar Java:

```powershell
java -version
```

Comprobar Node y npm:

```powershell
node -v
npm -v
```

Comprobar Git, si se va a clonar desde GitHub:

```powershell
git --version
```

## 2. Estructura esperada

La carpeta del proyecto debe quedar así:

```text
TFG/
|-- backend/       API REST con Java y Spring Boot
|-- frontend/      Aplicación web con React y Vite
|-- database/      Scripts SQL de creación y datos
|-- docs/          Documentación técnica complementaria
|-- README.md
```

Los comandos de este manual se pueden ejecutar desde cualquier ruta, pero los ejemplos usan la raíz del proyecto.

Dentro del backend, el código Java se organiza en paquetes:

```text
controller/     Endpoints REST
dto/            Objetos usados en autenticación y respuestas resumidas
model/          Entidades JPA
repository/     Acceso a datos con Spring Data JPA
config/         Configuración web
```

Dentro del frontend, las carpetas principales son:

```text
components/     Componentes reutilizables
layouts/        Estructura común de página
pages/          Pantallas de la aplicación
services/       Llamadas a la API y gestión de sesión
```

## 3. Preparar MySQL

La base de datos se llama:

```text
djmatch_db
```

Para crearla desde cero:

1. Abrir MySQL Workbench.
2. Conectarse al servidor local.
3. Ejecutar `database/01_schema.sql`.
4. Ejecutar `database/12_seed_demo_data.sql`.

El script `01_schema.sql` crea las once tablas del modelo relacional. El script `12_seed_demo_data.sql` carga usuarios, perfiles con imagen, estilos, ofertas con imagen, candidaturas, conversaciones, mensajes, favoritos y valoraciones de prueba.

No hace falta ejecutar los scripts `02_...` a `11_...` en una instalación nueva. Esos archivos son cambios intermedios que se mantienen como referencia técnica de la evolución de la base de datos.

### Credenciales de MySQL

El backend viene configurado con:

```text
usuario: root
contraseña: root1234
```

La configuración está en:

```text
backend/src/main/resources/application.properties
```

También se puede cambiar sin editar el archivo usando variables de entorno:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

Las credenciales indicadas para MySQL corresponden únicamente al entorno local de desarrollo y pruebas. En una versión de producción deberían configurarse mediante variables de entorno y no incluirse directamente en los archivos del proyecto.

### Usuarios de prueba principales

| Rol | Correo | Contraseña |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| DJ | `luna@example.com` | `demo123` |
| Organizador | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

### Usuarios de prueba secundarios

| Rol | Correo | Contraseña |
| --- | --- | --- |
| DJ | `marco@example.com` | `demo123` |
| DJ | `carla.dj@example.com` | `demo123` |
| DJ | `neo.techno@example.com` | `demo123` |

## 4. Arrancar backend

Desde la raíz del proyecto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

El backend queda escuchando en:

```text
http://localhost:8080
```

Comprobación rápida:

```text
http://localhost:8080/api/health
```

Si responde, Spring Boot está arrancado.

## 5. Arrancar frontend

Abrir otra terminal desde la raíz del proyecto:

```powershell
cd frontend
npm install
npm run dev -- --host localhost --port 5173 --strictPort
```

El frontend queda normalmente en:

```text
http://localhost:5173
```

El frontend llama al backend en:

```text
http://localhost:8080/api
```

Esa URL está definida en `frontend/src/services/api.js`.

## 6. Comprobar compilación

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

El comando del backend necesita que MySQL esté arrancado y que exista la base `djmatch_db`, porque el test de contexto carga la configuración real.

## 7. Orden recomendado desde cero

1. Instalar Java, Node.js y MySQL.
2. Clonar o copiar el proyecto.
3. Ejecutar `database/01_schema.sql`.
4. Ejecutar `database/12_seed_demo_data.sql`.
5. Revisar usuario y contraseña de MySQL.
6. Arrancar backend con `.\mvnw.cmd spring-boot:run`.
7. Arrancar frontend con `npm run dev`.
8. Abrir `http://localhost:5173`.

El proyecto está pensado para ejecutarse en local durante la entrega. No incluye un despliegue público. Para una versión publicada haría falta desplegar backend, frontend y base de datos en servicios externos.

## 8. Problemas frecuentes

### MySQL no conecta

Revisar:

- MySQL Server está arrancado.
- Existe la base `djmatch_db`.
- Se ejecutaron `01_schema.sql` y `12_seed_demo_data.sql`.
- El usuario y contraseña coinciden con `application.properties`.
- El puerto de MySQL es `3306`.

### Error `Unknown database djmatch_db`

La base de datos no está creada. Ejecutar:

```text
database/01_schema.sql
database/12_seed_demo_data.sql
```

### Error `Access denied for user root`

La contraseña de MySQL no coincide con la configurada en el backend. Cambiar `spring.datasource.username` o `spring.datasource.password` en `application.properties`, o usar las variables de entorno.

### El frontend abre pero no carga datos

Revisar:

- Backend arrancado en `http://localhost:8080`.
- MySQL arrancado.
- `http://localhost:8080/api/health` responde.
- La base de datos tiene datos de prueba.

### Puerto ocupado

Si el puerto `8080` está ocupado, Spring Boot dará error. Hay que cerrar el proceso que usa ese puerto o cambiar la configuración.

Si el puerto `5173` está ocupado, Vite suele proponer otro puerto. En ese caso se abre la URL que muestre la terminal.

## 9. Archivos que no se suben

Estas carpetas son generadas y no se suben al repositorio:

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `backend/uploads/`

Después de clonar el proyecto en otro equipo, `node_modules` se vuelve a generar con:

```powershell
cd frontend
npm install
```
