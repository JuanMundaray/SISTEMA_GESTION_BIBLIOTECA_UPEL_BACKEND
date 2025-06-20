// controllers/holdController.js
const Hold = require('../models/holdModel');

const createHold = async (req, res) => {
  try {
    const { book_id, user_id, expiry_date, status } = req.body;
    const hold = await Hold.create({ book_id, user_id, expiry_date, status });
    res.status(201).json(hold);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const getAllHolds = async (req, res) => {
  try {
    const holds = await Hold.findAll();
    res.json(holds);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

const getHoldById = async (req, res) => {
  try {
    const { id } = req.params;
    const hold = await Hold.findById(id);
    if (!hold) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(hold);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};

const updateHold = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiry_date, status } = req.body;
    const hold = await Hold.update(id, { expiry_date, status });
    if (!hold) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(hold);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

const deleteHold = async (req, res) => {
  try {
    const { id } = req.params;
    const hold = await Hold.delete(id);
    if (!hold) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada', hold });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};

module.exports = {
  createHold,
  getAllHolds,
  getHoldById,
  updateHold,
  deleteHold
};
