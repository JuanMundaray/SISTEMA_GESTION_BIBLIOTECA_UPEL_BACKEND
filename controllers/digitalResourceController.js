// controllers/digitalResourceController.js
const DigitalResource = require('../models/digitalResourceModel');

module.exports = {
  async createResource(req, res) {
    try {
      const { title, url, description, type } = req.body;
      const resource = await DigitalResource.create({ title, url, description, type });
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el recurso digital' });
    }
  },
  async getResources(req, res) {
    try {
      const resources = await DigitalResource.findAll();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los recursos digitales' });
    }
  },
  async getResourceById(req, res) {
    try {
      const { id } = req.params;
      const resource = await DigitalResource.findById(id);
      if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el recurso digital' });
    }
  },
  async updateResource(req, res) {
    try {
      const { id } = req.params;
      const { title, url, description, type } = req.body;
      const resource = await DigitalResource.update(id, { title, url, description, type });
      if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el recurso digital' });
    }
  },
  async deleteResource(req, res) {
    try {
      const { id } = req.params;
      const resource = await DigitalResource.delete(id);
      if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
      res.json({ message: 'Recurso eliminado', resource });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el recurso digital' });
    }
  }
};
