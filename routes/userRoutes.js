// routes/Users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAdmin = require('../middlewares/requireAdmin');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ci:
 *                 type: string
 *                 example: "12345678"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ci:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               user_type:
 *                 type: string
 *                 enum: [student, professor, admin]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación o email duplicado
 *
 *   get:
 *     summary: Obtener usuarios paginados
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de usuarios por página
 *     responses:
 *       200:
 *         description: Lista de usuarios y paginación
 */
router.post('/', userController.registerUser);
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{ci}:
 *   get:
 *     summary: Obtener usuario por CI
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: ci
 *         required: true
 *         schema:
 *           type: string
 *         description: Cédula de identidad
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Actualizar usuario (solo admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: ci
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               user_type:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: ci
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado
 */
router.get('/:ci', userController.findByCiUser);
router.put('/:ci', userController.updateUser);
router.delete('/:ci', requireAdmin, userController.deleteUser);

/**
 * @swagger
 * /users/{ci}/restore:
 *   patch:
 *     summary: Restaurar usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: ci
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario restaurado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/:ci/restore', userController.restoreUser);

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Buscar usuario por email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/email/:email', userController.findByEmailUser);

module.exports = router;