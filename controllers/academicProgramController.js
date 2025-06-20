// controllers/academicProgramController.js
const AcademicProgram = require('../models/academicProgramModel');

const createAcademicProgram = async (req, res) => {
  try {
    const { name, faculty } = req.body;
    const program = await AcademicProgram.create({ name, faculty });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el programa académico' });
  }
};

const getAllAcademicPrograms = async (req, res) => {
  try {
    const programs = await AcademicProgram.findAll();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los programas académicos' });
  }
};

const getAcademicProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await AcademicProgram.findById(id);
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el programa académico' });
  }
};

const updateAcademicProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, faculty } = req.body;
    const program = await AcademicProgram.update(id, { name, faculty });
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el programa académico' });
  }
};

const deleteAcademicProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await AcademicProgram.delete(id);
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    res.json({ message: 'Programa eliminado', program });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el programa académico' });
  }
};

module.exports = {
  createAcademicProgram,
  getAllAcademicPrograms,
  getAcademicProgramById,
  updateAcademicProgram,
  deleteAcademicProgram
};
