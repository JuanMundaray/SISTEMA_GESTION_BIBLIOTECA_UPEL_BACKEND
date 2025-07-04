const Fine = require('../models/fineModel');
const createFine = async (req, res) => {
  try {
    const { user_id, checkout_id, amount, reason, issue_date, is_paid, payment_date } = req.body;
    const fine = await Fine.create({ user_id, checkout_id, amount, reason, issue_date, is_paid, payment_date });
    res.status(201).json(fine);
  }
  catch (error) {
    if (error.code === '23503') {
      // Determinar si el error es por user_id o checkout_id
      if (error.detail && error.detail.includes('user_id')) {
        return res.status(404).json({ error: 'El usuario no existe' });
      } else if (error.detail && error.detail.includes('checkout_id')) {
        return res.status(404).json({ error: 'Este prestamo no existe' });
      } else {
        return res.status(404).json({ error: 'El usuario o el prestamo no existe' });
      }
    }
    res.status(500).json({
      error: 'Error al crear la multa',
      details: error.message,
      code:error.code 
    });
  }
};

const getFines = async (req, res) => {
  try {
    const fines = await Fine.findAll();
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las multas' });
  }
};

const getFineById = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.findById(id);
    if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json(fine);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la multa' });
  }
};

const getFineFullById = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.findFullById(id);
    if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json(fine);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la multa completa' });
  }
};

const updateFine = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason, is_paid, payment_date } = req.body;
    const fine = await Fine.update(id, { amount, reason, is_paid, payment_date });
    if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json(fine);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la multa' });
  }
};

const deleteFine = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fine.delete(id);
    if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json({ message: 'Multa eliminada', fine });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la multa' });
  }
};

module.exports = {
  createFine,
  getFines,
  getFineById,
  updateFine,
  deleteFine,
  getFineFullById
};
