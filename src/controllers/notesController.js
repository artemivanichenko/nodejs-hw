import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;
  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 10;
  const skip = (pageNum - 1) * perPageNum;

  // const filter = {};

  // if (search && typeof search === 'string' && search.trim()) {
  //   filter.$text = { $search: search.trim() };
  // }
  // if (tag && typeof tag === 'string' && tag.trim()) {
  //   filter.tag = tag.trim();
  // }

  const notesQuery = Note.find({ userId: req.user._id });
  if (search) {
    notesQuery.where({
      $text: {
        $search: search,
      },
    });
  }
  if (tag) {
    notesQuery.where({
      tag: tag,
    });
  }
  const totalNotes = await notesQuery.clone().countDocuments();
  const notes = await notesQuery
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPageNum);
  const totalPage = Math.ceil(totalNotes / perPageNum);
  res
    .status(200)
    .json({ page: pageNum, perPage: perPageNum, notes, totalNotes, totalPage });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const result = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!result) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.json(result);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(newNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      new: true,
    },
  );
  if (!updatedNote) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.json(updatedNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  if (!deletedNote) {
    return next(createHttpError(404, 'Note not found'));
  }
  return res.status(200).json(deletedNote);
};
