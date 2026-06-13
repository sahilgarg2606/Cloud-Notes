const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote);

router.route('/:id')
    .put(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;