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
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';

const noteRoutes = Router();

noteRoutes.use('/notes', authenticate);
noteRoutes.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
noteRoutes.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
noteRoutes.post('/notes', celebrate(createNoteSchema), createNote);
noteRoutes.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);
noteRoutes.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default noteRoutes;
