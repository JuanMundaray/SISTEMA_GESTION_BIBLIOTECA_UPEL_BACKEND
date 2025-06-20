// controllers/checkoutController.js
const Checkout = require('../models/checkoutModel');

const createCheckout = async (req, res) => {
  try {
    const { copy_id, user_id, due_date } = req.body;
    const checkout = await Checkout.create({ copy_id, user_id, due_date });
    res.status(201).json(checkout);
  } catch (error) {
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

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckout,
  deleteCheckout
};
