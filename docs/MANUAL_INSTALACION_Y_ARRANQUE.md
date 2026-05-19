# Manual de instalacion y arranque

Este manual explica como preparar ConectaDJ en otro equipo y dejar funcionando backend, frontend y base de datos.

## 1. Requisitos

Programas necesarios:

- Java JDK 17 o superior.
- Node.js 20.19 o superior.
- MySQL Server 8.
- MySQL Workbench u otro cliente MySQL.
- Git, si se va a clonar desde GitHub.
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

Comprobar Git:

```powershell
git --version
```

## 2. Estructura esperada

La carpeta del proyecto debe quedar asi:

```text
TFG/
|-- backend/       API REST con Java y Spring Boot
|-- frontend/      Aplicacion web con React y Vite
|-- database/      Scripts SQL de creacion y datos
|-- docs/          Documentacion tecnica complementaria
|-- README.md
```

Los comandos de este manual se pueden ejecutar desde cualquier ruta, pero los ejemplos usan la raiz del proyecto.

Dentro del backend, el codigo Java se organiza en paquetes:

```text
controller/     Endpoints REST
dto/            Objetos usados en autenticacion y respuestas resumidas
model/          Entidades JPA
repository/     Acceso a datos con Spring Data JPA
config/         Configuracion web
```

Dentro del frontend, las carpetas principales son:

```text
components/     Componentes reutilizables
layouts/        Estructura comun de pagina
pages/          Pantallas de la aplicacion
services/       Llamadas a la API y gestion de sesion
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

El script `01_schema.sql` crea las once tablas del modelo relacional. El script `12_seed_demo_data.sql` carga usuarios, perfiles, estilos, ofertas, favoritos y valoraciones de prueba.

No hace falta ejecutar los scripts `02_...` a `11_...` en una instalacion nueva. Esos archivos son cambios intermedios que se mantienen como historial del desarrollo.

### Credenciales de MySQL

El backend viene configurado con:

```text
usuario: root
contrasena: root1234
```

La configuracion esta en:

```text
backend/src/main/resources/application.properties
```

Tambien se puede cambiar sin editar el archivo usando variables de entorno:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

### Usuarios de prueba

| Rol | Correo | Contrasena |
| --- | --- | --- |
| DJ | `alex@example.com` | `demo123` |
| Particular / sala | `organizador@example.com` | `demo123` |
| Fiesta privada | `fiestaprivada@example.com` | `demo123` |
| Administrador | `admin@example.com` | `demo123` |

## 4. Arrancar backend

Desde la raiz del proyecto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

El backend queda escuchando en:

```text
http://localhost:8080
```

Comprobacion rapida:

```text
http://localhost:8080/api/health
```

Si responde, Spring Boot esta arrancado.

## 5. Arrancar frontend

Abrir otra terminal desde la raiz del proyecto:

```powershell
cd frontend
npm install
npm run dev
```

El frontend queda normalmente en:

```text
http://localhost:5173
```

El frontend llama al backend en:

```text
http://localhost:8080/api
```

Esa URL esta definida en `frontend/src/services/api.js`.

## 6. Comprobar compilacion

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

El comando del backend necesita que MySQL este arrancado y que exista la base `djmatch_db`, porque el test de contexto carga la configuracion real.

## 7. Orden recomendado desde cero

1. Instalar Java, Node.js y MySQL.
2. Clonar o copiar el proyecto.
3. Ejecutar `database/01_schema.sql`.
4. Ejecutar `database/12_seed_demo_data.sql`.
5. Revisar usuario y contrasena de MySQL.
6. Arrancar backend con `.\mvnw.cmd spring-boot:run`.
7. Arrancar frontend con `npm run dev`.
8. Abrir `http://localhost:5173`.

El proyecto esta pensado para ejecutarse en local durante la entrega. Un despliegue publico requeriria publicar backend, frontend y base de datos en servicios externos.

## 8. Problemas frecuentes

### MySQL no conecta

Revisar:

- MySQL Server esta arrancado.
- Existe la base `djmatch_db`.
- Se ejecutaron `01_schema.sql` y `12_seed_demo_data.sql`.
- El usuario y contrasena coinciden con `application.properties`.
- El puerto de MySQL es `3306`.

### Error `Unknown database djmatch_db`

La base de datos no esta creada. Ejecutar:

```text
database/01_schema.sql
database/12_seed_demo_data.sql
```

### Error `Access denied for user root`

La contrasena de MySQL no coincide con la configurada en el backend. Cambiar `spring.datasource.username` o `spring.datasource.password` en `application.properties`, o usar las variables de entorno.

### El frontend abre pero no carga datos

Revisar:

- Backend arrancado en `http://localhost:8080`.
- MySQL arrancado.
- `http://localhost:8080/api/health` responde.
- La base de datos tiene datos de prueba.

### Puerto ocupado

Si el puerto `8080` esta ocupado, Spring Boot dara error. Hay que cerrar el proceso que usa ese puerto o cambiar la configuracion.

Si el puerto `5173` esta ocupado, Vite suele proponer otro puerto. En ese caso se abre la URL que muestre la terminal.

## 9. Archivos que no se suben

Estas carpetas son generadas y estan ignoradas por Git:

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `backend/uploads/`

Despues de clonar el proyecto en otro equipo, `node_modules` se vuelve a generar con:

```powershell
cd frontend
npm install
```
