# API de Gestión de Biblioteca UPEL

Esta API permite gestionar usuarios, libros, préstamos, reservas, espacios, recursos digitales y más para una biblioteca universitaria. Desarrollada en Node.js + Express y PostgreSQL.

## Características principales
- Registro, autenticación y gestión de usuarios (admin, profesor, estudiante)
- Gestión de libros y copias
- Préstamos y devoluciones de libros
- Reservas de libros y espacios
- Gestión de espacios y reservas de espacios
- Recursos digitales
- Multas y control de pagos
- Validación de datos con Joi
- Middleware de autenticación JWT
- Soporte para paginación y soft delete
- Documentación OpenAPI/Swagger modular en `/swagger`

## Instalación
1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```env
   PORT=3000
   DATABASE_URL=postgres://usuario:contraseña@localhost:5432/tu_basededatos
   JWT_SECRET=tu_clave_secreta
   ```
4. Ejecuta las migraciones para crear las tablas necesarias:
   ```sh
   psql -U tu_usuario -d tu_basededatos -f database/migrations/migrations.sql
   ```
5. Inicia el servidor:
   ```sh
   npm start
   ```

## Endpoints principales

### Usuarios
- `POST /users` — Registrar usuario
- `POST /users/login` — Login de usuario
- `GET /users` — Listar usuarios (requiere autenticación)
- `GET /users/:ci` — Obtener usuario por CI
- `PUT /users/:ci` — Actualizar usuario
- `DELETE /users/:ci` — Desactivar usuario (soft delete, admin)
- `PATCH /users/:ci/restore` — Restaurar usuario
- `GET /users/email/:email` — Buscar usuario por email

### Libros y copias
- `POST /books` — Crear libro
- `GET /books` — Listar libros
- `GET /books/:id` — Obtener libro por ID
- `PUT /books/:id` — Actualizar libro
- `DELETE /books/:id` — Eliminar libro
- `POST /book-copies` — Crear copia de libro
- `GET /book-copies` — Listar copias
- `GET /book-copies/:id` — Obtener copia por ID
- `PUT /book-copies/:id` — Actualizar copia
- `DELETE /book-copies/:id` — Eliminar copia

### Préstamos
- `POST /checkouts` — Crear préstamo
- `GET /checkouts` — Listar préstamos
- `GET /checkouts/:id` — Obtener préstamo por ID
- `PUT /checkouts/:id` — Actualizar préstamo
- `DELETE /checkouts/:id` — Eliminar préstamo

### Reservas de libros
- `POST /holds` — Crear reserva
- `GET /holds` — Listar reservas
- `GET /holds/:id` — Obtener reserva por ID
- `PUT /holds/:id` — Actualizar reserva
- `DELETE /holds/:id` — Eliminar reserva

### Espacios y reservas de espacios
- `POST /spaces` — Crear espacio (admin)
- `GET /spaces` — Listar espacios
- `GET /spaces/:id` — Obtener espacio por ID
- `PUT /spaces/:id` — Actualizar espacio (admin)
- `DELETE /spaces/:id` — Eliminar espacio (admin)
- `POST /space-reservations` — Crear reserva de espacio
- `GET /space-reservations` — Listar reservas de espacios
- `GET /space-reservations/:id` — Obtener reserva de espacio por ID
- `PUT /space-reservations/:id` — Actualizar reserva de espacio
- `DELETE /space-reservations/:id` — Eliminar reserva de espacio

### Recursos digitales
- `POST /digital-resources` — Crear recurso digital (admin)
- `GET /digital-resources` — Listar recursos digitales
- `GET /digital-resources/:id` — Obtener recurso digital por ID
- `PUT /digital-resources/:id` — Actualizar recurso digital (admin)
- `DELETE /digital-resources/:id` — Eliminar recurso digital (admin)

### Multas
- `POST /fines` — Crear multa (admin)
- `GET /fines` — Listar multas
- `GET /fines/:id` — Obtener multa por ID
- `PUT /fines/:id` — Actualizar multa (admin)
- `DELETE /fines/:id` — Eliminar multa (admin)

## Validaciones
- Se utiliza Joi para validar los datos de entrada de todas las entidades.
- Las contraseñas deben tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.

## Autenticación
- Se utiliza JWT. Incluye el token en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.
- Algunos endpoints requieren permisos de administrador.

## Documentación OpenAPI/Swagger
- La documentación modular de la API está en la carpeta `/swagger` (un archivo por entidad).
- Puedes visualizarla con Swagger UI o Redoc.

## Licencia
MIT
