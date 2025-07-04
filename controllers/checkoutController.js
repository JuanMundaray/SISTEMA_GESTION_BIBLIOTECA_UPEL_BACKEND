const Checkout = require('../models/checkoutModel');

const createCheckout = async (req, res) => {
  try {
    const { copy_id, user_id, due_date } = req.body;
    // Verificar si ya existe un préstamo activo para la copia
    const activeCheckout = await Checkout.findActiveByCopyId(copy_id);
    if (activeCheckout) {
      return res.status(409).json({ error: 'Ya existe un préstamo activo para esta copia. Debe devolverse antes de crear uno nuevo.' });
    }
    const checkout = await Checkout.create({ copy_id, user_id, due_date });
    res.status(201).json(checkout);
  } catch (error) {
    if (error.code === '23503') {
      // Determinar si el error es por user_id o copy_id
      if (error.detail && error.detail.includes('user_id')) {
        return res.status(404).json({ error: 'El usuario no existe' });
      } else if (error.detail && error.detail.includes('copy_id')) {
        return res.status(404).json({ error: 'La copia de libro no existe' });
      } else {
        return res.status(404).json({ error: 'El usuario o la copia de libro no existe' });
      }
    }
    res.status(500).json({ error: 'Error al crear el préstamo' });
  }
};

const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.findAll();
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los préstamos' });
  }
};

const getCheckoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const checkout = await Checkout.findById(id);
    if (!checkout) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el préstamo' });
  }
};

const updateCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { return_date, status, fine_amount } = req.body;
    const checkout = await Checkout.update(id, { return_date, status, fine_amount });
    if (!checkout) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el préstamo' });
  }
};

const deleteCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const checkout = await Checkout.delete(id);
    if (!checkout) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json({ message: 'Préstamo eliminado', checkout });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el préstamo' });
  }
};

const getCheckoutsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkouts = await Checkout.findByUserId(user_id);
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los préstamos del usuario' });
  }
};

const getCheckoutsByCopyId = async (req, res) => {
  try {
    const { copy_id } = req.params;
    const checkouts = await Checkout.findByCopyId(copy_id);
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los préstamos de la copia' });
  }
};

const getAllCheckoutsJoinCopyJoinUser = async (req, res) => {
  try {
    const checkouts = await Checkout.findAllJoinCopyJoinUser();
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los préstamos completos' });
  }
};

const getCheckoutFullById = async (req, res) => {
  try {
    const { id } = req.params;
    const checkout = await Checkout.findFullById(id);
    if (!checkout) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener el préstamo completo',
      details: error.message,
      code: error.code
    });
  }
};

const processReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { return_date } = req.body; // opcional, por si se quiere registrar una fecha específica
    const checkout = await Checkout.processReturn(id, return_date);
    if (!checkout) return res.status(404).json({ error: 'Préstamo no encontrado o ya devuelto' });
    res.json({ message: 'Préstamo devuelto correctamente', checkout });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la devolución', details: error.message, code: error.code });
  }
};

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckout,
  deleteCheckout,
  getCheckoutsByUserId,
  getCheckoutsByCopyId,
  getAllCheckoutsJoinCopyJoinUser,
  getCheckoutFullById,
  processReturn
};
