// controllers/fineController.js
const Fine = require('../models/fineModel');

module.exports = {
  async createFine(req, res) {
    try {
      const { user_id, checkout_id, amount, reason, issue_date, is_paid } = req.body;
      const fine = await Fine.create({ user_id, checkout_id, amount, reason, issue_date, is_paid });
      res.status(201).json(fine);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la multa' });
    }
  },
  async getFines(req, res) {
    try {
      const fines = await Fine.findAll();
      res.json(fines);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las multas' });
    }
  },
  async getFineById(req, res) {
    try {
      const { id } = req.params;
      const fine = await Fine.findById(id);
      if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
      res.json(fine);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la multa' });
    }
  },
  async updateFine(req, res) {
    try {
      const { id } = req.params;
      const { amount, reason, is_paid } = req.body;
      const fine = await Fine.update(id, { amount, reason, is_paid });
      if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
      res.json(fine);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la multa' });
    }
  },
  async deleteFine(req, res) {
    try {
      const { id } = req.params;
      const fine = await Fine.delete(id);
      if (!fine) return res.status(404).json({ error: 'Multa no encontrada' });
      res.json({ message: 'Multa eliminada', fine });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la multa' });
    }
  }
};
