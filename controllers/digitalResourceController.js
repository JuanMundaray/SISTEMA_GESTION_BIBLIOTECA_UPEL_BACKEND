const DigitalResource = require('../models/digitalResourceModel');

const createResource = async (req, res) => {
  try {
    const { book_id, title, author, url, type, upload_date } = req.body;
    const resource = await DigitalResource.create({ book_id, title, author, url, type, upload_date });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el recurso digital' });
  }
};

const getResources = async (req, res) => {
  try {
    const resources = await DigitalResource.findAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los recursos digitales' });
  }
};

const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await DigitalResource.findById(id);
    if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el recurso digital' });
  }
};

const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_id, title, author, url, type, upload_date } = req.body;
    const resource = await DigitalResource.update(id, { book_id, title, author, url, type, upload_date });
    if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el recurso digital' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await DigitalResource.delete(id);
    if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json({ message: 'Recurso eliminado', resource });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el recurso digital' });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource
};
