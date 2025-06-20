const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { normalizeVenezuelanPhoneNumber } = require('../utils/phoneNumberNormalize');
const registerSchema = require('../schema/registerSchema');
const loginSchema = require('../schema/loginSchema');
const { ciParamSchema, emailParamSchema } = require('../schema/paramUserSchemas');
const { validate } = require('../validators/validator');
require('dotenv').config();

// Helpers (manejo de errores y respuestas)
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor' });
};

const registerUser = async (req, res) => {
  try {
    const phoneNumber = await normalizeVenezuelanPhoneNumber(req.body.phone);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Adaptar a user_type_id
    const userData = { ...req.body, password: hashedPassword, phone: phoneNumber };
    // El modelo debe aceptar user_type_id
    const newUser = await UserModel.create(userData);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    handleError(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findByCI(req.body.ci);
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña Incorrecta' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Cuenta desactivada' });
    }

    const token = jwt.sign(
      { ci: user.ci, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Eliminar password antes de enviar respuesta
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    handleError(res, error);
  }
};
  // Obtener todos los usuarios (paginados)
const getAllUsers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { users, total } = await UserModel.getAll(limit, offset);

      res.json({
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // Obtener un usuario por CI
const findByCiUser = async (req, res) => {
    try {
      const { ci } = req.params;
      const user = await UserModel.findByCI(ci);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario por su cedula de identidad:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Actualizar un usuario
  const updateUser = async (req, res) => {
    try {
      // Validar los datos de entrada (Joi ya lo hace por middleware)
      const { ci } = req.params;
      const { first_name, last_name, username, phone, user_type_id, is_active } = req.body;
      // Verificar si el usuario existe
      const existingUser = await UserModel.findByCI(ci);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      // Actualizar el usuario
      const updatedUser = await UserModel.update(ci, {
        first_name,
        last_name,
        username,
        phone,
        user_type_id,
        is_active
      });
      res.json({
        message: 'Usuario actualizado exitosamente',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  // Eliminar un usuario (soft delete)
  const deleteUser = async (req, res) => {
    try {
      const { ci } = req.params;

      // Verificar si el usuario existe
      const existingUser = await UserModel.findByCI(ci);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Eliminar el usuario (soft delete)
      const deletedUser = await UserModel.softDelete(ci);

      res.json({
        message: 'Usuario eliminado exitosamente',
        user: deletedUser
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // Restaurar un usuario eliminado
  const restoreUser = async (req, res) => {
    try {
      const { ci } = req.params;

      // Verificar si el usuario existe y está eliminado
      const existingUser = await UserModel.findByCI(ci);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Restaurar el usuario
      const restoredUser = await UserModel.restore(ci);

      res.json({
        message: 'Usuario restaurado exitosamente',
        user: restoredUser
      });
    } catch (error) {
      console.error('Error al restaurar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // Buscar usuario por email (para login)
  const findByEmailUser = async (req, res) =>{
    try {
      const { email } = req.params;
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // No devolver la contraseña en la respuesta
      delete user.password;

      res.json(user);
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

// ... (otros métodos del controller actualizados para usar UserModel)

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  findByCiUser,
  findByEmailUser,
  restoreUser,
  updateUser,
  deleteUser
};