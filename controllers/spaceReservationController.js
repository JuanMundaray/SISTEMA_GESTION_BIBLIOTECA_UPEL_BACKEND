const SpaceReservation = require('../models/spaceReservationModel');

const createReservation = async (req, res) => {
  try {
    const { space_id, user_id, start_time, end_time, purpose } = req.body;
    const reservation = await SpaceReservation.create({ space_id, user_id, start_time, end_time, purpose });
    res.status(201).json(reservation);
  } catch (error) {
    if(error.code === '23503'){
      if(error.detail.includes('space_id')) {
        return res.status(404).json({ error: 'El espacio no existe' });
      }
      if(error.detail.includes('user_id')) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
    }
    res.status(500).json({ error: 'Error al crear la reserva de espacio' });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await SpaceReservation.findAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas de espacio' });
  }
};

const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await SpaceReservation.findById(id);
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reserva de espacio' });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time, purpose } = req.body;
    const reservation = await SpaceReservation.update(id, { start_time, end_time, purpose });
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reserva de espacio' });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await SpaceReservation.delete(id);
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva de espacio' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
