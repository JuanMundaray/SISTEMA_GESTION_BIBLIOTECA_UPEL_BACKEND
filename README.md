# API de Gestión de Biblioteca UPEL

Esta API permite gestionar usuarios y libros para una biblioteca universitaria. Está desarrollada en Node.js con Express y utiliza PostgreSQL como base de datos.

## Características principales
- Registro, autenticación y gestión de usuarios (admin, profesor, estudiante)
- Gestión de libros: alta, consulta, actualización y disponibilidad
- Validación de datos con Joi
- Middleware de autenticación JWT
- Soporte para paginación y soft delete en usuarios

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
   psql -U tu_usuario -d tu_basededatos -f migrations/migrations.sql
   ```
5. Inicia el servidor:
   ```sh
   npm start
   ```

## Endpoints principales

### Usuarios
- `POST /api/users/register` — Registrar usuario
- `POST /api/users/login` — Login de usuario
- `GET /api/users` — Listar usuarios (requiere autenticación)
- `GET /api/users/:id` — Obtener usuario por ID
- `PUT /api/users/:id` — Actualizar usuario
- `DELETE /api/users/:id` — Desactivar usuario (soft delete)
- `PATCH /api/users/:id/restore` — Restaurar usuario

### Libros
- `POST /api/book` — Crear libro (requiere autenticación)
- `GET /api/book` — Listar libros
- `GET /api/book/:isbn` — Buscar libro por ISBN
- `PATCH /api/book/:id/disponibilidad` — Actualizar disponibilidad

## Validaciones
- Se utiliza Joi para validar los datos de entrada de usuarios y libros.
- Las contraseñas deben tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.

## Autenticación
- Se utiliza JWT. Incluye el token en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.

## Licencia
MIT
