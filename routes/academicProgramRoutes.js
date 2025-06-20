// routes/academicProgramRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicProgramController');

router.post('/', controller.createAcademicProgram);
router.get('/', controller.getAllAcademicPrograms);
router.get('/:id', controller.getAcademicProgramById);
router.put('/:id', controller.updateAcademicProgram);
router.delete('/:id', controller.deleteAcademicProgram);

module.exports = router;
