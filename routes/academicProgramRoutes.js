// routes/academicProgramRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicProgramController');

/**
 * @route POST /academic-programs
 * @desc Crear un nuevo programa académico
 * @access Público o Admin (según lógica de negocio)
 */
router.post('/', controller.createAcademicProgram);

/**
 * @route GET /academic-programs
 * @desc Obtener todos los programas académicos
 * @access Público
 */
router.get('/', controller.getAllAcademicPrograms);

/**
 * @route GET /academic-programs/:id
 * @desc Obtener un programa académico por ID
 * @access Público
 */
router.get('/:id', controller.getAcademicProgramById);

/**
 * @route PUT /academic-programs/:id
 * @desc Actualizar un programa académico
 * @access Público o Admin (según lógica de negocio)
 */
router.put('/:id', controller.updateAcademicProgram);

/**
 * @route DELETE /academic-programs/:id
 * @desc Eliminar un programa académico
 * @access Público o Admin (según lógica de negocio)
 */
router.delete('/:id', controller.deleteAcademicProgram);

module.exports = router;
