const Space = require('../models/spaceModel');

const createSpace = async (req, res) => {
  try {
    const { name, capacity, type } = req.body;
    const space = await Space.create({ name, capacity, type });
    res.status(201).json(space);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el espacio' });
  }
};

const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los espacios' });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const space = await Space.findById(id);
    if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.json(space);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el espacio' });
  }
};

const updateSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, type } = req.body;
    const space = await Space.update(id, { name, capacity, type });
    if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.json(space);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el espacio' });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const space = await Space.delete(id);
    if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.json({ message: 'Espacio eliminado', space });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el espacio' });
  }
};

module.exports = {
  createSpace,
  getSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace
};
