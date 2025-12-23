import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
} from '../validations/notesValidation.js';
import { celebrate } from 'celebrate';

const noteRoutes = Router();

noteRoutes.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
noteRoutes.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
noteRoutes.post('/notes', createNote);
noteRoutes.patch('/notes/:noteId', updateNote);
noteRoutes.delete('/notes/:noteId', deleteNote);

export default noteRoutes;
